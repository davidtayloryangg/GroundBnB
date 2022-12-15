import { useContext, useEffect } from 'react';
import { doSignOut } from '../firebase/FirebaseFunctions';
import { AuthContext } from '../firebase/Auth';
import { useNavigate } from 'react-router-dom';

const SignOutButton = () => {
  const { currentUser } = useContext(AuthContext);
  const nav = useNavigate();

  useEffect(
    () => {
      if (!currentUser) {
        nav('/signin');
      }
    }
  )

  return (
    <button type='button' onClick={doSignOut}>
      Sign Out
    </button>
  );
};

export default SignOutButton;