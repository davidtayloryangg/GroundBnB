import React from 'react';
import {doSocialSignIn} from '../firebase/FirebaseFunctions';

const SocialSignIn = () => {
  const socialSignOn = async (provider: string) => {
    try {
      await doSocialSignIn(provider);
    } catch (error) {
      alert(error);
    }
  };
  return (
    <div>
      <img 
        className='social-signin'
        onClick={() => socialSignOn('google')}
        alt='google signin'
        src='/imgs/btn_google_signin.png'
      />
    </div>
  );
};

export default SocialSignIn;