import { useState } from 'react';
import { firestore } from '../lib/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

export default function FlashcardCreator() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(firestore, 'flashcards'), {
        question,
        answer,
        createdAt: new Date(),
      });
      setQuestion('');
      setAnswer('');
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Question"
        required
      />
      <input
        type="text"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Answer"
        required
      />
      <button type="submit">Add Flashcard</button>
    </form>
  );
}
