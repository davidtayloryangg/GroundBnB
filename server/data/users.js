// const usersCollection = require('../firestore/config').users;
const firestore = require('firebase/firestore');
const collection = firestore.collection;
const db = require('../firestore/config');

module.exports = {
  async createUser(userId, email, firstName, lastName, birthDate) {
    // const newUser = usersCollection.add({
    //   id: userId,
    //   email: email,
    //   firstName: firstName,
    //   lastName: lastName,
    //   birthDate: birthDate
    // });

    const newUser = await firestore.addDoc(collection(db, 'users'), {
      id: userId,
      email: email,
      firstName: firstName,
      lastName: lastName,
      birthDate: birthDate
    });

    return newUser;
  }
}