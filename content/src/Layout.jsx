//import { Text } from './pages/text';
import { Navbar } from './shared/Navbar';
import { Text } from './pages/text/index_new';
//import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase/config';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
//import AuthModal from './pages/auth/AuthModal';

export const Layout = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    onAuthStateChanged(auth, (res) => {
      // console.log(res?.accessToken);
      if (!res?.accessToken) {
        navigate('/auth');
      } else {
        setIsLoading(false);
      }
    });
  }, [navigate]);

  if (isLoading) {
    return <div>Loading</div>;
  }

  return (
    <div>
      <Navbar />
      <Text />
    </div>
  );
};
