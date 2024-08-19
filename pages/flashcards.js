import { useState, useEffect } from 'react';
import { SignIn, useAuth, SignOut } from '@clerk/nextjs';
import FlashcardCreator from '../components/Flashcard'; // Adjust path as necessary

export default function Flashcards() {
  const { isSignedIn } = useAuth();
  const [flashcards, setFlashcards] = useState([]);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [newQuestion, setNewQuestion] = useState(''); // For AI generation
  const [loading, setLoading] = useState(false); // For AI generation loading state

  useEffect(() => {
    if (isSignedIn) {
      // Fetch flashcards on component mount
      fetch('/api/flashcards')
        .then((res) => res.json())
        .then((data) => setFlashcards(data.flashcards || []))
        .catch((error) => console.error('Error fetching flashcards:', error));
    }
  }, [isSignedIn]);

  const handleCreateFlashcard = async () => {
    if (!question) return; // Prevent empty questions

    try {
      const res = await fetch('/api/flashcards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question, answer }),
      });

      const data = await res.json();
      if (data.success) {
        setFlashcards([...flashcards, data.flashcard]);
        setQuestion('');
        setAnswer('');
      } else {
        console.error('Failed to create flashcard:', data.error);
      }
    } catch (error) {
      console.error('Error creating flashcard:', error);
    }
  };

  const handleGenerateFlashcard = async () => {
    if (!newQuestion) return; // Prevent empty prompts

    setLoading(true);
    try {
      const res = await fetch('/api/ai-flashcards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ category: newQuestion }), // Adjust based on your API requirements
      });

      const data = await res.json();
      const { flashcards: generatedFlashcards } = data;

      if (generatedFlashcards && Array.isArray(generatedFlashcards)) {
        setFlashcards(prevFlashcards => [...prevFlashcards, ...generatedFlashcards]);
        setNewQuestion('');
      } else {
        console.error('Failed to generate flashcards or invalid response format');
      }
    } catch (error) {
      console.error('Error generating flashcards:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFlashcard = async (id) => {
    try {
      const res = await fetch('/api/removeFlashcard', { // Adjust this route as needed
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();
      if (data.success) {
        setFlashcards(flashcards.filter(card => card.id !== id));
      } else {
        console.error('Failed to remove flashcard:', data.error);
      }
    } catch (error) {
      console.error('Error removing flashcard:', error);
    }
  };

  if (!isSignedIn) {
    return <SignIn />;
  }

  return (
    <div>
      <SignOut />
      <h2>Your Flashcards</h2>
      <div>
        {flashcards.map((card) => (
          <div key={card.id}>
            <Flashcard question={card.question} answer={card.answer} />
            <button onClick={() => handleRemoveFlashcard(card.id)}>Remove</button>
          </div>
        ))}
      </div>
      <div>
        <h3>Create a New Flashcard</h3>
        <input
          type="text"
          placeholder="Enter question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter answer (optional)"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
        />
        <button onClick={handleCreateFlashcard}>Add Flashcard</button>
      </div>
      <div>
        <h3>Generate Flashcards with AI</h3>
        <input
          type="text"
          placeholder="Enter category or prompt for AI"
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
        />
        <button onClick={handleGenerateFlashcard} disabled={loading}>
          {loading ? 'Generating...' : 'Generate Flashcards'}
        </button>
      </div>
    </div>
  );
}
