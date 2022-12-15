import { doSocialSignIn, doSocialSignUp } from '../firebase/FirebaseFunctions';
import '../App.css';

const SocialSignIn = (props: any) => {
  const socialSignOn = async (provider: string) => {
    try {
      doSocialSignUp(provider);
    }
    catch (error) {
      alert(error);
    }
  };
  return (
    <div>
      {props.type === 'signin' && (
        <div>
          <img
            className='social-signin'
            onClick={() => socialSignOn('google')}
            alt='google signin'
            src='/imgs/btn_google_signin.png'
          />
        </div>
      )}
      {props.type === 'signup' && (
        <div>
          <img
            className='sign-up-img'
            onClick={() => socialSignOn('google')}
            alt='google signup'
            src='/imgs/btn_google_signin.png'
          />
        </div>
      )}
    </div>
  );
};

export default SocialSignIn;