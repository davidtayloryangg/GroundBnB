import * as firestore from 'firebase/firestore';
const db = require('../firebase/config').db;
const collection = firestore.collection( db, 'users' );
//const query = firestore.query(collection, firestore.where('name', '==', 'Bob'));
const doc = firestore.doc
const Timestamp = firestore.Timestamp;  

export const createUser = async (userId:string, email:string, firstName:string, lastName:string, birthDay:number, birthMonth:number, birthYear:number) => {
    const user = {
        id: userId,
        email: email,
        firstName: firstName,
        lastName: lastName,
        birthDate: Timestamp.fromDate(new Date(birthYear, birthMonth - 1, birthDay))
        };
        await firestore.setDoc(doc(collection, userId), user);
        return user;
}

export const getUserByUserId = async (userId: string) => {
    const userFound = await firestore.getDoc(doc(db, "users", userId));

    if(!userFound.exists()) {
        return null;
    }

    const user = userFound.data();
    return {
        firstName : user.firstName,
        lastName : user.lastName
    };
}
