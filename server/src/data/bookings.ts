import * as firestore from "firebase/firestore";
const db = require("../firebase/config").db;
const collection = firestore.collection( db, 'bookings' );
const doc = firestore.doc;
const Timestamp = firestore.Timestamp;

export const cancelBooking = async (bookingId: string) => {
  await firestore.updateDoc(doc(db, "bookings", bookingId), {
    status: "CANCELED",
  });
};

export const getBooking = async (bookingId: string) => {
  const booking = await firestore.getDoc(doc(db, "bookings", bookingId));
  if (!booking.exists()) {
    return null;
  }
  return booking.data();
};

export const getBookingsByListingId = async (listingId : string, excludeCanceled : boolean) => {
  const  query = (excludeCanceled) ? 
                  firestore.query(collection, firestore.where('listingId', '==', listingId), firestore.where('status', '==', 'ACTIVE')) : 
                  firestore.query(collection, firestore.where('listingId', '==', listingId));
  const bookingsForListing = await firestore.getDocs(query);
  const bookingsFoundForListing = [];

  if(!bookingsForListing.empty) {
    bookingsForListing.forEach((booking) => {
      bookingsFoundForListing.push(booking.data());
    });
  }

  return bookingsFoundForListing;
};

export const getBookingsByOwnerId = async (ownerId : string) => {
  const query = firestore.query(collection, firestore.where('ownerId', '==', ownerId));
  const bookingsByOwnerId = await firestore.getDocs(query);
  const bookingsFoundForOwner = [];

  if (!bookingsByOwnerId.empty) {
    bookingsByOwnerId.forEach((booking) => {
      bookingsFoundForOwner.push(booking.data());
    });
  }

  return bookingsFoundForOwner;
};

export const getBookingsByBookerId = async (bookerId : string) => {
  const query = firestore.query(collection, firestore.where('bookerId', '==', bookerId));
  const bookingsForBooker = await firestore.getDocs(query);
  const bookingsFoundForBooker = [];

  if (!bookingsForBooker.empty) {
    bookingsForBooker.forEach((booking) => {
      bookingsFoundForBooker.push(booking.data());
    });
  }

  return bookingsFoundForBooker;
};

export const getAllBookings = async () => {
  const bookings = await firestore.getDocs(collection);
  if (bookings.empty) {
    return null;
  }

  return bookings.docs.map((booking) => {
    return booking.data();
  });
};

export const createBooking = async (bookerId : string, listingId : string, numOfPeople : number, ownerId : string, totalPrice : number, numOfBookings : number,endTimestamp : string, startTimestamp : string) => {
  const booking = {
    bookerId : bookerId,
    endTimestamp : Timestamp.fromDate(new Date(endTimestamp)),
    listingId : listingId,
    numOfPeople : numOfPeople,
    ownerId : ownerId,
    startTimestamp : Timestamp.fromDate(new Date(startTimestamp)),
    totalPrice : totalPrice,
    status : 'ACTIVE',
    bookingId : null
  };

  await firestore.updateDoc(doc(db, "listings", listingId), {
    numOfBookings : numOfBookings + 1
  }); 

  const bookingAdded = await firestore.addDoc(collection, booking);
  await firestore.updateDoc(doc(db, "bookings", bookingAdded.id), {
    bookingId : bookingAdded.id
  });

  booking.bookingId = bookingAdded.id;
  return booking;
};

export const getUserBookingsForGivenListingId = async (bookerId : string, listingId : string) => {
  const  query = firestore.query(collection, firestore.where('bookerId', '==', bookerId), firestore.where('listingId', '==', listingId), firestore.where('status', '==', 'ACTIVE'));
  const bookingsByUserForGivenListing = await firestore.getDocs(query);
  const bookingsByUserForGivenListingFound = [];

  if (!bookingsByUserForGivenListing.empty) {
    bookingsByUserForGivenListing.forEach((booking) => {
      bookingsByUserForGivenListingFound.push(booking.data());
    });
  }

  return bookingsByUserForGivenListingFound;
};
