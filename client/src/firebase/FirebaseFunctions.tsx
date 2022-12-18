import firebase from "firebase/compat/app";
import axios from "axios";

async function doCreateUserWithEmailAndPassword(
  email: string,
  password: string,
  displayName: any
) {
  await firebase.auth().createUserWithEmailAndPassword(email, password);
  await firebase.auth().currentUser.updateProfile({ displayName: displayName });
}

async function doChangePassword(
  email: any,
  oldPassword: any,
  newPassword: string
) {
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
  if (provider === "google") {
    socialProvider = new firebase.auth.GoogleAuthProvider();
  }
  await firebase.auth().signInWithPopup(socialProvider);
}

async function doSocialSignUp(provider: string) {
  await doSocialSignIn(provider);

  await axios.post("http://localhost:4000/users/signup", {
    userId: firebase.auth().currentUser.uid,
    email: firebase.auth().currentUser.email,
    firstName: firebase.auth().currentUser.displayName.split(" ")[0],
    lastName: firebase.auth().currentUser.displayName.split(" ")[1],
  });
}

async function doSignUpWithEmailAndPassword(
  email: string,
  password: string,
  displayName: string
) {
  await doCreateUserWithEmailAndPassword(email, password, displayName);

  await axios.post("http://localhost:4000/users/signup", {
    userId: firebase.auth().currentUser.uid,
    email: email,
    firstName: displayName.split(" ")[0],
    lastName: displayName.split(" ")[1],
  });
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
  doSocialSignUp,
  doSignInWithEmailAndPassword,
  doSignUpWithEmailAndPassword,
  doPasswordReset,
  doPasswordUpdate,
  doSignOut,
  doChangePassword,
};
