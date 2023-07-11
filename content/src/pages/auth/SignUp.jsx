import { useState } from 'react';
import './styles.scss';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase/config';
import { redirect } from 'react-router-dom';

const SignUp = () => {
  const [inputs, setInputs] = useState({ email: '', name: '', password: '' });
  const [emailError, setEmailError] = useState('');
  const [nameError, setNameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isError, setIsError] = useState(false);

  const [createUserWithEmailAndPassword, user, loading, error] =
    useCreateUserWithEmailAndPassword(auth);

  const handleOnChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
    if (inputs.email !== '') {
      setEmailError(false);
    }
    if (inputs.name !== '') {
      setNameError(false);
    }
    if (inputs.password !== '') {
      setPasswordError(false);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (inputs.email === '') {
      setEmailError('Enter your email');
      setIsError(true);
    }
    if (inputs.name === '') {
      setNameError('Give yourself a name');
      setIsError(true);
    }
    if (inputs.password === '') {
      setPasswordError('Please enter a password');
      setIsError(true);
    }
    if (isError) {
      return;
    }
    try {
      const newUser = await createUserWithEmailAndPassword(
        inputs.email,
        inputs.password
      );
      if (!newUser) {
        return;
      }
      setInputs({ email: '', password: '', name: '' });
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
      {emailError !== '' && <p className="error">{emailError} </p>}
      <label htmlFor="name" className="label">
        Enter your name
      </label>
      <input
        name="name"
        id="name"
        type="text"
        placeholder="...give yourself a name"
        value={inputs.name}
        onChange={handleOnChange}
        className="input"
      />
      {nameError !== '' && <p className="error">{nameError} </p>}
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
      {passwordError !== '' && <p className="error">{passwordError} </p>}
      <button className="button" type="submit">
        {' '}
        Sign Up{' '}
      </button>
      {error && <p className="error">{error.message} </p>}
    </form>
  );
};

export default SignUp;
