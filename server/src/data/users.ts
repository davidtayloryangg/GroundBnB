import * as firestore from "firebase/firestore";
const db = require("../firebase/config").db;
const collection = firestore.collection(db, "users");
//const query = firestore.query(collection, firestore.where('name', '==', 'Bob'));
const doc = firestore.doc;
const Timestamp = firestore.Timestamp;

export const createUser = async (
  userId: string,
  email: string,
  firstName: string,
  lastName: string
) => {
  const userDoc = await firestore.getDoc(doc(collection, userId));
  if (userDoc.exists()) {
    return userDoc.data();
  }
  const user = {
    id: userId,
    email: email,
    firstName: firstName,
    lastName: lastName,
  };
  await firestore.setDoc(doc(collection, userId), user);
  return user;
};
