import React, { useContext } from 'react';
import SocialSignIn from './SocialSignIn';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../firebase/Auth';
import {
  doSignInWithEmailAndPassword,
  doPasswordReset,
} from '../firebase/FirebaseFunctions';

function SignIn() {
  const { currentUser } = useContext(AuthContext);
  const handleLogin = async (event: any) => {
    event.preventDefault();
    let { email, password } = event.target.elements;

    try {
      await doSignInWithEmailAndPassword(email.value, password.value);
    } catch (error) {
      alert(error);
    }
  };

  const passwordReset = (event: any) => {
    event.preventDefault();
    let email = (document.getElementById('email') as HTMLInputElement).value;
    if (email) {
      doPasswordReset(email);
      alert('Password reset email was sent');
    } else {
      alert(
        'Please enter an email address below before you click the forgot password link'
      );
    }
  };
  if (currentUser) {
    return <Navigate to='/' />;
  }
  return (
    <div>
      <h1>Log in</h1>
      <form onSubmit={handleLogin}>
        <div className='form-group'>
          <label>
            Email:
            <input
              className='form-control'
              name='email'
              id='email'
              type='email'
              placeholder='Email'
              required
            />
          </label>
        </div>
        <br />
        <div className='form-group'>
          <label>
            Password:
            <input
              className='form-control'
              name='password'
              type='password'
              placeholder='Password'
              autoComplete='off'
              required
            />
          </label>
        </div>
        <br />
        <button type='submit'>Log in</button>

        <button className='forgotPassword' onClick={passwordReset}>
          Forgot Password
        </button>
      </form>

      <br />
      <SocialSignIn type='signin' />
    </div>
  );
}

export default SignIn;