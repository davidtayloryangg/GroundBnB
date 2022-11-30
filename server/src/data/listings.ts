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

export const getListing = async (listingId: string) => {
  const listing = await firestore.getDoc(doc(db, "listings", listingId));
  if (!listing.exists()) {
    return null;
  }
  return listing.data();
};

export const addReview = async (listingId, userId, rating, text, date) => {
  await firestore.updateDoc(doc(db, "listings", listingId), {
    reviews: firestore.arrayUnion({
      userId: userId,
      rating: rating,
      text: text,
      date: Timestamp.fromDate(new Date(date)),
    }),
  });
  const listing = await getListing(listingId);
  const reviews = listing.reviews;
  let totalRating = 0;
  reviews.forEach((review) => {
    totalRating += review.rating;
  });
  const avgRating = totalRating / reviews.length;
  await firestore.updateDoc(doc(db, "listings", listingId), {
    averageRating: avgRating,
  });
};

//functon that checks if a user has already reviewed a listing
export const hasUserReviewed = async (listingId, userId) => {
  const listing = await firestore.getDoc(doc(db, "listings", listingId));
  if (!listing.exists()) {
    return false;
  }
  const reviews = listing.data().reviews;
  for (let i = 0; i < reviews.length; i++) {
    if (reviews[i].userId === userId) {
      return true;
    }
  }
  return false;
};
