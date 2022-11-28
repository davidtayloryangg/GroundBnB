import * as firestore from 'firebase/firestore';
const db = require('../firebase/config').db;
const collection = firestore.collection( db, 'listings' );
const doc = firestore.doc
const Timestamp = firestore.Timestamp;  

export const getAllListings = async () => {
    const querySnapshot = await firestore.getDocs(collection);
    console.log(querySnapshot);
    
    const listings = querySnapshot.docs.map(doc => 
        console.log(doc.data()));
        
        // doc.data());
    return listings;
}