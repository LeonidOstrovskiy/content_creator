import './styles.scss';
import { Link } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/config';
import { useEffect, useState } from 'react';
import { useSignOut } from 'react-firebase-hooks/auth';

export const Navbar = () => {
  const [isLogged, setIsLogged] = useState(false);
  const [signOut, loading, error] = useSignOut(auth);

  useEffect(() => {
    onAuthStateChanged(auth, (res) => {
      if (res?.accessToken) {
        setIsLogged(true);
      }
    });
  }, []);

  const signOutHandler = () => {
    signOut();
  };

  return (
    <header className="header">
      <nav className="navbar">
        <Link className="link" to="/">
          Text
        </Link>
        <Link className="link" to="/image">
          Image
        </Link>
        {isLogged && (
          <p
            onClick={signOutHandler}
            className="link"
            style={{ cursor: 'pointer' }}
          >
            Logout
          </p>
        )}
      </nav>
    </header>
  );
};
