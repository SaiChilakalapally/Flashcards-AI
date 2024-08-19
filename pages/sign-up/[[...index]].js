import { SignUp, useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const SignUpPage = () => {
  const { isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isSignedIn) {
      router.push('/create-flashcards'); // Redirect to create flashcards page upon sign-up
    }
  }, [isSignedIn, router]);

  return ( 
    <div style={styles.container}>
      <SignUp path="/sign-up" routing="path" />;
    </div>
  )
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

export default SignUpPage;
