import { useAuth } from '@clerk/nextjs';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from '../styles/Home.module.css'; // Import the CSS module

const HomePage = () => {
  const { isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isSignedIn) {
      router.push('/create-flashcards'); // Redirect to create flashcards page if already signed in
    }
  }, [isSignedIn, router]);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Flashcard SaaS</h1>
        <div className={styles.authButtons}>
          {!isSignedIn ? (
            <>
              <Link href="/sign-in" className={styles.button}>Sign In</Link>
              <Link href="/sign-up" className={styles.button}>Sign Up</Link>
            </>
          ) : (
            <button onClick={() => router.push('/create-flashcards')} className={styles.button}>Go to Flashcards</button>
          )}
        </div>
      </header>
      <main className={styles.main}>
        <p className={styles.description}>Welcome to Flashcard SaaS. Please sign in or sign up to create and manage your flashcards.</p>
      </main>
      <footer className={styles.footer}>
        <p>&copy; 2024 Flashcard SaaS</p>
      </footer>
    </div>
  );
};

export default HomePage;
