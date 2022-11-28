import * as firestore from 'firebase/firestore';
const db = require('../firebase/config').db;
const collection = firestore.collection( db, 'listings' );
const doc = firestore.doc
const Timestamp = firestore.Timestamp;  

export const getAllListings = async () => {
    const querySnapshot = await firestore.getDocs(collection);
    const listings = querySnapshot.docs.map(doc => doc.data());
    return listings;
}