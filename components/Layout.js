import React from 'react';
import Link from 'next/link';
import styles from './Layout.module.css'; // Import your CSS module for styling

const Layout = ({ children }) => {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Flashcard SaaS</h1>
        <div className={styles.buttonContainer}>
          <Link href="/sign-in" className={styles.button}>Sign In</Link>
          <Link href="/sign-up" className={styles.button}>Sign Up</Link>
        </div>
      </header>
      <main className={styles.main}>{children}</main>
      <footer className={styles.footer}>
        <p>&copy; 2024 Flashcard SaaS</p>
      </footer>
    </div>
  );
};

export default Layout;
