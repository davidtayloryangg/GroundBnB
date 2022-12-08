import * as firestore from "firebase/firestore";
import { where } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase/config";
const collection = firestore.collection(db, "listings");
const doc = firestore.doc;
const Timestamp = firestore.Timestamp;
const GeoPoint = firestore.GeoPoint;
import * as im from "imagemagick";
import * as fs from "fs";
import * as path from "path";

export const getListing = async (listingId: string) => {
  const listing = await firestore.getDoc(doc(db, "listings", listingId));
  if (!listing.exists()) {
    return null;
  }
  return listing.data();
};

const cropImage = (image) => {
  return new Promise((resolve, reject) => {
    im.crop(
      {
        srcPath: image.path,
        dstPath: `uploads-imagemagick/${image.filename}.jpg`,
        width: 500,
        height: 500
      },
      (err, stdout) => {
        if (err) reject(err);
        resolve(stdout);
      }
    );
  });
};

export const createListing = async (
  description: String,
  price: Number,
  street: String,
  city: String,
  state: String,
  zipcode: String,
  lat: number,
  lon: number,
  ownerId: String,
  imageArray
) => {
  // check if address already exists
  const q1 = firestore.query(
    collection,
    where("address.street", "==", street),
    where("address.city", "==", city),
    where("address.state", "==", state),
    where("address.zipcode", "==", zipcode)
  );
  const querySnapshot1 = await firestore.getDocs(q1);
  if (!querySnapshot1.empty) throw "Listing address already exists";

  const geolocation = new GeoPoint(lat, lon);
  const q2 = firestore.query(
    collection,
    where("address.geolocation", "==", geolocation)
  );
  const querySnapshot2 = await firestore.getDocs(q2);
  if (!querySnapshot2.empty) throw "Listing coordinates already exists";

  // add new listing to firestore
  const docRef = await firestore.addDoc(collection, {
    description: description,
    price: parseFloat(price.toFixed(2)),
    ownerId: ownerId,
    address: {
      street: street,
      city: city,
      state: state,
      zipcode: zipcode,
      geolocation: geolocation,
    },
    averageRating: 0,
    numOfBookings: 0,
    // imageUrls: need to get urls from cloud storage
    // listingId: is added below after doc creation
    reviews: [],
  });

  let imageUrls = [];

  // uploading images
  for (let i = 0; i < imageArray.length; i++) {
    const storageRef = ref(storage, `${ownerId}/${docRef.id}-${i}.jpg`);
    await cropImage(imageArray[i]);

    const fileToUploadPath = `../../uploads-imagemagick/${imageArray[i].filename}.jpg`;
    const fileToUpload = fs
      .readFileSync(path.resolve(__dirname, fileToUploadPath))
      .toString("base64");

    await uploadString(storageRef, fileToUpload, "base64")
      .then(async (snapshot) => {
        console.log("File uploaded!");
        await getDownloadURL(
          ref(storage, `${ownerId}/${docRef.id}-${i}.jpg`)
        ).then((url) => imageUrls.push(url));
      })
      .catch((e) => console.log(e));
  }
  // update listing with the image urls and listingId
  await firestore.updateDoc(doc(db, "listings", docRef.id), {
    imageUrls: imageUrls,
    listingId: docRef.id,
  });

  return docRef.id;
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
