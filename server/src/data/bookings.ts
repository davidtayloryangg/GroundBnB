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

export const getBookingsByListingId = async (listingId : string) => {
  const query = firestore.query(collection, firestore.where('listingId', '==', listingId), firestore.where('status', '==', 'ACTIVE'));
  const bookingsForListing = await firestore.getDocs(query);
  const bookingsFoundForListing = []

  if(!bookingsForListing.empty) {
    bookingsForListing.forEach((booking) => {
      bookingsFoundForListing.push(booking.data());
    });
  }

  return bookingsFoundForListing;
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

export const createBooking = async (bookerId : string, listingId : string, numOfPeople : number, ownerId : string, totalPrice : number, endTimestamp : string, startTimestamp : string) => {
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

  const bookingAdded = await firestore.addDoc(collection, booking);
  await firestore.updateDoc(doc(db, "bookings", bookingAdded.id), {
    bookingId : bookingAdded.id
  });

  booking.bookingId = bookingAdded.id;
  return booking;
};