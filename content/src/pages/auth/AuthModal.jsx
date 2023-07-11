import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SignUp from './SignUp';
import Login from './Login';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase/config';

const AuthModal = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [invisible, setInvisible] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, (res) => {
      // console.log(res?.accessToken);
      if (res?.accessToken) {
        setInvisible(true);
        setIsLoading(false);
        navigate('/');
      } else {
        setIsLoading(false);
      }
    });
  }, [navigate]);

  if (isLoading) {
    return <div>Loading</div>;
  }
  return (
    <div className={invisible ? 'invisible' : 'auth-wrapper'}>
      {!isLogin && <SignUp />}
      {isLogin && <Login />}
      <p className="p" onClick={() => setIsLogin(!isLogin)}>
        {isLogin && 'Not yet registered?'}{' '}
        {!isLogin && 'Already have an account?'}{' '}
      </p>
    </div>
  );
};

export default AuthModal;
