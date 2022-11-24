const firestore = require('firebase/firestore');
const collection = firestore.collection;
const doc = firestore.doc;
const Timestamp = firestore.Timestamp;
const db = require('../firebase/config');

module.exports = {
  async createUser(userId, email, firstName, lastName, birthDay, birthMonth, birthYear) {
    const newUser = await firestore.setDoc(doc(db, 'users', userId), {
      id: userId,
      email: email,
      firstName: firstName,
      lastName: lastName,
      birthDate: Timestamp.fromDate(new Date(birthYear, birthMonth - 1, birthDay))
    });

    return newUser;
  }
}