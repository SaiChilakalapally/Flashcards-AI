import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/router';
import styles from '../styles/CreateFlashcards.module.css';

const CreateFlashcards = () => {
  const [flashcards, setFlashcards] = useState({ All: [] });
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [newFlashcard, setNewFlashcard] = useState({ question: '' });
  const { isSignedIn, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isSignedIn) {
      router.push('/sign-in');
    }
  }, [isSignedIn, router]);

  useEffect(() => {
    const storedFlashcards = JSON.parse(localStorage.getItem('flashcards')) || { All: [] };
    console.log('Loaded flashcards from localStorage:', storedFlashcards); // Debug log
    setFlashcards(storedFlashcards);

    if (!storedFlashcards[selectedCategory]) {
      fetchFlashcardsForCategory(selectedCategory);
    }
  }, [selectedCategory]);

  const fetchFlashcardsForCategory = async (category) => {
    try {
      console.log(`Fetching flashcards for category: ${category}`); // Debug log
      const response = await fetch('/api/ai-flashcards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ category }),
      });

      if (!response.ok) {
        const errorText = await response.text(); // Get more detailed error information
        throw new Error(`HTTP error! Status: ${response.status}, Details: ${errorText}`);
      }

      const data = await response.json();
      console.log('Fetched data for category:', category, data); // Debug log
      const flashcardsForCategory = Array.isArray(data.flashcards) ? data.flashcards : [];

      setFlashcards(prevFlashcards => {
        const updatedFlashcards = {
          ...prevFlashcards,
          [category]: flashcardsForCategory,
          All: [
            ...(prevFlashcards.All || []),
            ...flashcardsForCategory.filter(card => !prevFlashcards.All.some(existingCard => existingCard.id === card.id)),
          ],
        };

        localStorage.setItem('flashcards', JSON.stringify(updatedFlashcards));
        return updatedFlashcards;
      });
    } catch (error) {
      console.error('Error fetching flashcards:', error);
      // Optionally, you can simulate flashcards if the API fails
    }
  };

  const handleCategoryChange = (event) => {
    const newCategory = event.target.value;
    setSelectedCategory(newCategory);

    // Fetch flashcards if not already loaded for the new category
    if (!flashcards[newCategory]) {
      fetchFlashcardsForCategory(newCategory);
    }
  };

  const handleNewFlashcardChange = (event) => {
    setNewFlashcard({ question: event.target.value });
  };

  const fetchAnswerFromAI = async (question) => {
    try {
      const response = await fetch('/api/ai-answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('AI Answer:', data); // Debugging log
      return data.answer || 'No answer generated';
    } catch (error) {
      console.error('Error fetching answer:', error);
      return 'Error generating answer';
    }
  };

  const handleAddFlashcard = async () => {
    if (newFlashcard.question) {
      const answer = await fetchAnswerFromAI(newFlashcard.question);

      const newFlashcardObject = {
        id: new Date().getTime(),
        question: newFlashcard.question,
        answer,
      };

      setFlashcards(prevFlashcards => {
        const updatedCategory = [
          ...(prevFlashcards[selectedCategory] || []),
          newFlashcardObject,
        ];
        const updatedAll = [
          ...(prevFlashcards.All || []),
          newFlashcardObject,
        ];
        const updatedFlashcards = {
          ...prevFlashcards,
          [selectedCategory]: updatedCategory,
          All: updatedAll,
        };

        localStorage.setItem('flashcards', JSON.stringify(updatedFlashcards));
        return updatedFlashcards;
      });

      setNewFlashcard({ question: '' });
    }
  };

  const handleRemoveFlashcard = (id) => {
    setFlashcards(prevFlashcards => {
      const updatedCategory = (prevFlashcards[selectedCategory] || []).filter(card => card.id !== id);
      const updatedAll = (prevFlashcards.All || []).filter(card => card.id !== id);
      const updatedFlashcards = {
        ...prevFlashcards,
        [selectedCategory]: updatedCategory,
        All: updatedAll,
      };

      localStorage.setItem('flashcards', JSON.stringify(updatedFlashcards));
      return updatedFlashcards;
    });
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Flashcard SaaS</h1>
        {isSignedIn && (
          <button onClick={() => signOut()}>Sign Out</button>
        )}
      </header>
      <main className={styles.main}>
        <div className={styles.newFlashcardForm}>
          <input
            type="text"
            name="question"
            value={newFlashcard.question}
            onChange={handleNewFlashcardChange}
            placeholder="Enter question"
            className={styles.inputField}
          />
          <button onClick={handleAddFlashcard} className={styles.addButton}>
            Add Flashcard
          </button>
        </div>
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className={styles.categorySelect}
        >
          <option value="All">All</option>
          <option value="Math">Math</option>
          <option value="Science">Science</option>
          <option value="History">History</option>
          <option value="Geography">Geography</option>
          <option value="Literature">Literature</option>
          {/* Add more categories as needed */}
        </select>
        <div className={styles.flashcardsContainer}>
          {flashcards[selectedCategory] && flashcards[selectedCategory].length > 0 ? (
            flashcards[selectedCategory].map((flashcard) => (
              <div key={flashcard.id} className={styles.flashcard}>
                <button
                  onClick={() => handleRemoveFlashcard(flashcard.id)}
                  className={styles.removeButton}
                >
                  X
                </button>
                <div className={styles.cardInner}>
                  <div className={styles.cardFront}>
                    <p>{flashcard.question}</p>
                  </div>
                  <div className={styles.cardBack}>
                    <p>{flashcard.answer}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No flashcards available for the selected category. Generating...</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default CreateFlashcards;
