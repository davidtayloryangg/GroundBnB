import * as firestore from "firebase/firestore";
import { where, query, orderBy, limit, getDocs } from "firebase/firestore";
import { ref, uploadString, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage } from "../firebase/config";
const collection = firestore.collection(db, "listings");
const doc = firestore.doc;
const Timestamp = firestore.Timestamp;
const GeoPoint = firestore.GeoPoint;
import * as im from "imagemagick";
import * as fs from "fs";
import * as path from "path";

const itemsPerPage = 9;

export const getAllListings = async () => {
  const querySnapshot = await firestore.getDocs(collection);
  const listings = querySnapshot.docs.map((doc) => {
    const data = doc.data();
    // TODO MISSING PRICE PER DAY IN DATA
    return {
      id: doc.id,
      description: data.description,
      address: data.address,
      averageRating: data.averageRating,
      imagesUrls: data.imageUrls,
      ownerId: data.ownerId,
      price: data.price,
      reviews: data.reviews,
    };
  });

  return listings;
};

export const getListing = async (listingId: string) => {
  const listing = await firestore.getDoc(doc(db, "listings", listingId));
  if (!listing.exists()) {
    return null;
  }
  return listing.data();
};

export const getListingByOwnerId = async (ownerId: string) => {
  const query = firestore.query(
    collection,
    firestore.where("ownerId", "==", ownerId)
  );
  const listingsByOwnerId = await firestore.getDocs(query);
  const listingsFoundForOwner = [];

  if (!listingsByOwnerId.empty) {
    listingsByOwnerId.forEach((listing) => {
      listingsFoundForOwner.push(listing.data());
    });
  }

  return listingsFoundForOwner;
};

const cropImage = (image) => {
  return new Promise((resolve, reject) => {
    im.crop(
      {
        srcPath: image.path,
        dstPath: `uploads-imagemagick/${image.filename}.jpg`,
        width: 500,
        height: 500,
      },
      (err, stdout) => {
        if (err) reject(err);
        resolve(stdout);
      }
    );
  });
};

export const createListing = async (description: String, price: Number, street: String, city: String, state: String, zipcode: String, lat: number, lon: number, ownerId: String, imageArray) => {
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

  // uploading images
  let imageUrls = [];
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
    fs.unlinkSync(path.resolve(__dirname, "../../" + imageArray[i].path));
    fs.unlinkSync(path.resolve(__dirname, fileToUploadPath));
  }
  // update listing with the image urls and listingId
  await firestore.updateDoc(doc(db, "listings", docRef.id), {
    imageUrls: imageUrls,
    listingId: docRef.id,
  });

  return docRef.id;
};

export const editListing = async (listingId: string, description: String, price: Number, street: String, city: String, state: String, zipcode: String, lat: number, lon: number, ownerId: String, imageArray) => {
  // check if listing exists
  const listingData = await getListing(listingId);
  if (!listingData) throw 'Listing with listingId does not exist';
  if (listingData.ownerId !== ownerId) throw 'Listing does not belong to user currently logged in';

  // check if address already exists
  const q1 = firestore.query(
    collection,
    where("address.street", "==", street),
    where("address.city", "==", city),
    where("address.state", "==", state),
    where("address.zipcode", "==", zipcode)
  );
  const querySnapshot1 = await firestore.getDocs(q1);
  if (querySnapshot1.size > 1) throw "Listing address already exists";
  querySnapshot1.forEach((doc) => {
    if (doc.id !== listingId) throw "Listing address already exists";
  });

  const geolocation = new GeoPoint(lat, lon);
  const q2 = firestore.query(
    collection,
    where("address.geolocation", "==", geolocation)
  );
  const querySnapshot2 = await firestore.getDocs(q2);
  if (querySnapshot2.size > 1) throw "Listing address already exists";
  querySnapshot2.forEach((doc) => {
    if (doc.id !== listingId) throw "Listing address already exists";
  });

  // handle images if new images are submitted
  if (imageArray.length > 0) {
    for (let i = 0; i < listingData.imageUrls.length; i++) {
      const storageRef = ref(storage, `${ownerId}/${listingId}-${i}.jpg`);
      deleteObject(storageRef)
        .then(() => console.log('Image deleted'))
        .catch((e) => console.log(e));
    }

    let imageUrls = [];
    for (let i = 0; i < imageArray.length; i++) {
      const storageRef = ref(storage, `${ownerId}/${listingId}-${i}.jpg`);
      await cropImage(imageArray[i]);

      const fileToUploadPath = `../../uploads-imagemagick/${imageArray[i].filename}.jpg`;
      const fileToUpload = fs
        .readFileSync(path.resolve(__dirname, fileToUploadPath))
        .toString("base64");

      await uploadString(storageRef, fileToUpload, "base64")
        .then(async (snapshot) => {
          console.log("File uploaded!");
          await getDownloadURL(
            ref(storage, `${ownerId}/${listingId}-${i}.jpg`)
          ).then((url) => imageUrls.push(url));
        })
        .catch((e) => console.log(e));
      fs.unlinkSync(path.resolve(__dirname, '../../' + imageArray[i].path));
      fs.unlinkSync(path.resolve(__dirname, fileToUploadPath));
    }

    // update document
    await firestore.updateDoc(doc(db, "listings", listingId), {
      description: description,
      price: parseFloat(price.toFixed(2)),
      address: {
        street: street,
        city: city,
        state: state,
        zipcode: zipcode,
        geolocation: geolocation,
      },
      imageUrls: imageUrls,
    });
  }
  else {
    await firestore.updateDoc(doc(db, "listings", listingId), {
      description: description,
      price: parseFloat(price.toFixed(2)),
      address: {
        street: street,
        city: city,
        state: state,
        zipcode: zipcode,
        geolocation: geolocation,
      }
    });
  }
  

  return listingId;
}

export const getListings = async (pageNum: number, filterBy: string | null) => {
  let listingLimit: number = pageNum * itemsPerPage;
  let dbQuery;
  switch (filterBy) {
    case "rating-asc":
      dbQuery = query(
        collection,
        orderBy("averageRating"),
        limit(listingLimit)
      );
      break;
    case "rating-desc":
      dbQuery = query(
        collection,
        orderBy("averageRating", "desc"),
        limit(listingLimit)
      );
      break;
    case "price-asc":
      dbQuery = query(collection, orderBy("price"), limit(listingLimit));
      break;
    case "price-desc":
      dbQuery = query(
        collection,
        orderBy("price", "desc"),
        limit(listingLimit)
      );
      break;
    default:
      dbQuery = query(
        collection,
        orderBy("averageRating", "desc"),
        limit(listingLimit)
      );
      break;
  }
  const snapshot = await firestore.getCountFromServer(collection);
  let totalListingsCount: number = snapshot.data().count;
  const documentSnapshots = await getDocs(dbQuery);
  let docsReturnedCount: number = documentSnapshots.size;
  if (listingLimit - 10 > docsReturnedCount) {
    let returnObj = {
      next: null,
      data: [],
    };
    return returnObj;
  }
  let listingsDoc;
  if (listingLimit > docsReturnedCount) {
    let itemsToReturn = itemsPerPage - (listingLimit - docsReturnedCount);
    listingsDoc = documentSnapshots.docs.slice(-itemsToReturn);
  } else {
    listingsDoc = documentSnapshots.docs.slice(-itemsPerPage);
  }
  let listings = [];
  listingsDoc.forEach((doc) => {
    listings.push(doc.data());
  });
  let nextURL: number =
    totalListingsCount === docsReturnedCount ? null : pageNum + 1;
  let returnObj = {
    next: nextURL,
    data: listings,
  };
  return returnObj;
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
