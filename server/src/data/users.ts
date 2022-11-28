import * as firestore from 'firebase/firestore';
const db = require('../firestore/config').db;
const collection = firestore.collection( db, 'users' );
//const query = firestore.query(collection, firestore.where('name', '==', 'Bob'));
const doc = firestore.doc
const Timestamp = firestore.Timestamp;

class users {
    public createUser = async (userId: string, email:string, firstName:string, lastName:string, birthDay:number, birthMonth:number, birthYear:number) => {
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

}       

export default new users();