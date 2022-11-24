require('dotenv').config();
const firebase = require('firebase/app');
const firestore = require('firebase/firestore');

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEAS_ID
};

const app = firebase.initializeApp(firebaseConfig);
// const db = firebase.firestore();
const db = firestore.getFirestore(app);
// const usersCollection = db.collections('users');
// const bookingsCollection = db.collections('bookings');
// const listingsCollections = db.collections('listings');

module.exports = db;