import { useState } from 'react';
import './styles.scss';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase/config';
import { redirect } from 'react-router-dom';
const Login = () => {
  const [inputs, setInputs] = useState({ email: '', password: '' });

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isError, setIsError] = useState(false);

  const [signInWithEmailAndPassword, user, loading, error] =
    useSignInWithEmailAndPassword(auth);

  const handleOnChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
    if (inputs.email !== '') {
      setEmailError('');
    }
    if (inputs.password !== '') {
      setPasswordError('');
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (inputs.email === '' || inputs.password === '') {
      setIsError(true);

      if (inputs.email === '') {
        setEmailError('Enter your email');
      }

      if (inputs.password === '') {
        setPasswordError('Enter your password');
      }
      setIsError(true);

      return;
    }

    try {
      const loggedUser = await signInWithEmailAndPassword(
        inputs.email,
        inputs.password
      );
      if (!loggedUser) {
        return;
      }
      setInputs({ email: '', password: '' });
      redirect('/');
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <p
        style={{
          width: '100%',
          height: '400px',
          backgroundColor: 'white',
          color: 'green',
        }}
      >
        Creating a user...
      </p>
    );
  }
  return (
    <form
      className={`${isError ? 'no-gap' : 'gap-form'}`}
      onSubmit={submitHandler}
    >
      <label className="label" htmlFor="email">
        Enter your email
      </label>
      <input
        name="email"
        id="email"
        type="email"
        placeholder="...email"
        value={inputs.email}
        onChange={handleOnChange}
        className="input"
      />
      {emailError && <p className="error"> {emailError} </p>}
      <label className="label" htmlFor="password">
        Enter your password
      </label>

      <input
        name="password"
        id="password"
        type="password"
        placeholder="******"
        value={inputs.password}
        onChange={handleOnChange}
        className="input"
      />
      {passwordError && <p className="error"> {passwordError} </p>}
      <button type="submit" className="button">
        {' '}
        Login{' '}
      </button>
      {error && <p className="error">{error.message} </p>}
    </form>
  );
};

export default Login;
