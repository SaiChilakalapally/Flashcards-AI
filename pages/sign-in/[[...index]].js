import { SignIn, useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const SignInPage = () => {
  const { isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isSignedIn) {
      router.push('/create-flashcards'); // Redirect to create flashcards page upon sign-in
    }
  }, [isSignedIn, router]);

  return (
    <div style={styles.container}>
      <SignIn path="/sign-in" routing="path" />
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh', // Full viewport height
    backgroundColor: '#f0f0f0', // Optional: Add a background color
  },
};

export default SignInPage;
