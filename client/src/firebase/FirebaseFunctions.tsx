import firebase from 'firebase/compat/app';

async function doCreateUserWithEmailAndPassword(email: string, password: string, displayName: any) {
  await firebase.auth().createUserWithEmailAndPassword(email, password);
  firebase.auth().currentUser.updateProfile({ displayName: displayName });
}

async function doChangePassword(email: any, oldPassword: any, newPassword: string) {
  let credential = firebase.auth.EmailAuthProvider.credential(
    email,
    oldPassword
  );
  await firebase.auth().currentUser.reauthenticateWithCredential(credential);
  await firebase.auth().currentUser.updatePassword(newPassword);
  await doSignOut();
}

async function doSignInWithEmailAndPassword(email: string, password: string) {
  await firebase.auth().signInWithEmailAndPassword(email, password);
}

async function doSocialSignIn(provider: string) {
  let socialProvider: any = null;
  if (provider === 'google') {
    socialProvider = new firebase.auth.GoogleAuthProvider();
  } 
  await firebase.auth().signInWithPopup(socialProvider);
}

async function doPasswordReset(email: string) {
  await firebase.auth().sendPasswordResetEmail(email);
}

async function doPasswordUpdate(password: string) {
  await firebase.auth().currentUser.updatePassword(password);
}

async function doSignOut() {
  await firebase.auth().signOut();
}

export {
  doCreateUserWithEmailAndPassword,
  doSocialSignIn,
  doSignInWithEmailAndPassword,
  doPasswordReset,
  doPasswordUpdate,
  doSignOut,
  doChangePassword
};