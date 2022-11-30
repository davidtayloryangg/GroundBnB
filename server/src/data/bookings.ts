import * as firestore from "firebase/firestore";
const db = require("../firebase/config").db;
const doc = firestore.doc;

export const cancelBooking = async (bookingId: string) => {
  await firestore.updateDoc(doc(db, "bookings", bookingId), {
    status: "CANCELLED",
  });
};

export const getBooking = async (bookingId: string) => {
  const booking = await firestore.getDoc(doc(db, "bookings", bookingId));
  if (!booking.exists()) {
    return null;
  }
  return booking.data();
};
