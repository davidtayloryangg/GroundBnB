import * as firestore from 'firebase/firestore';
const db = require('../firebase/config').db;
const collection = firestore.collection( db, 'listings' );
const doc = firestore.doc
const Timestamp = firestore.Timestamp;  

export const getAllListings = async () => {
    const querySnapshot = await firestore.getDocs(collection);
    const listings = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        // TODO MISSING PRICE PER DAY IN DATA
        return {
            id: doc.id,
            description: data.description,
            address: data.address,
            imagesUrls: data.imageUrls,
            ownerId: data.owner,
            numberOfBookings: data.numberOfBookings,
            reviews: data.reviews,
        }
    });

    return listings;
}