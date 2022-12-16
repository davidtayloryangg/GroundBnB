const db = require("./firebase/config").db;
import { doc, getDoc } from "firebase/firestore";

function validString(str: string): void {
  // Checks if str is a string
  if (typeof str !== "string") throw `${str} is not a string.`;
  // Checks if str contains only spaces
  if (str.trim().length === 0) throw "A string with just spaces is not valid.";
}

function validNumber(num: Number): void {
  // Checks if num is a number
  if (typeof num !== "number") throw `${num} is not a number.`;
  // Checks if num is an integer
  if (!Number.isInteger(num)) throw "Invalid number.";
}

function validPrice(num: Number): void {
  // Checks if num is a number
  if (typeof num !== "number") throw `${num} is not a valid price.`;
}

function validEmail(email: string): void {
  // Checks if email is a string
  if (typeof email !== "string") throw `${email} is not a string.`;
  // Checks if email contains a '.'
  if (email.indexOf(".") === -1) throw `Invalid email.`;
  // Checks if email contains a '@'
  if (email.indexOf("@") === -1) throw `Invalid email.`;
  // Checks if email only contains valid characters
  if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
    throw "Invalid email.";
}

function validDate(dateString: string): void {
  // Checks if dateString is a string
  if (typeof dateString !== "string") throw `${dateString} is not a string.`;
  // Checks if dateString is empty
  if (dateString.trim().length === 0) throw "Invalid date.";
  // Converts dateString to a Date
  let date: Date = new Date(dateString);
  // Checks if date is an invalid date
  if (date.toString() === "Invalid Date") throw "Invalid date.";
}

function validTime(time: string): void {
  // Checks if time is a string
  if (typeof time !== "string") throw `${time} is not a string.`;
  // Checks if time is valid and in the format HH:MM:SS
  if (!/(?:[01]\d|2[0123]):(?:[012345]\d):(?:[012345]\d)/.test(time))
    throw "Invalid time.";
}

function validRating(rating: Number): void {
  // Checks if rating is a number
  if (typeof rating !== "number") throw `${rating} is not a number.`;
  // Checks if rating is an integer
  if (!Number.isInteger(rating)) throw "Invalid rating.";
  // Checks if rating is between 1 and 5
  if (rating < 1 || rating > 5) throw "Invalid rating.";
}

async function validUID(uid: string): Promise<void> {
  // Checks if uid is a string
  if (typeof uid !== "string") throw `${uid} is not a string.`;
  // Checks if UID contains spaces
  if (/\s/g.test(uid)) throw "Invalid UID";
  // Gets the user document
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);
  // Checks if doc is undefined
  if (!userSnap.exists()) throw "Invalid UID";
}

function validFile(multerFile): void {
  const validFileTypes = ['image/jpeg', 'image/jpg'];
  // Check if valid jpeg file
  if (!validFileTypes.includes(multerFile.mimetype)) throw 'Image must be a jpeg or jpg file';
}

async function validListingId(listingId: string): Promise<void> {
  // Checks if listingId is a string
  if (typeof listingId !== "string") throw `${listingId} is not a string`;
  // Checks if listingId contains spaces
  if (/\s/g.test(listingId)) throw "Invalid listingId";
  // Gets the listing document
  const listingRef = doc(db, "listings", listingId);
  const listingSnap = await getDoc(listingRef);
  // Checks if doc is undefined
  if (!listingSnap.exists()) throw "Invalid listingId";
}

function validateCity(city: string) {
  // Checks if city is a string
  if (typeof city !== "string") throw `${city} is not a string.`;
  // Checks if city contains only letters
  if (/[^a-z ]/i.test(city)) throw "Invalid city";
  // Checks if city is at least 2 characters
  if (city.length < 2) throw "Invalid city.";
}

function validateState(state: string) {
  // Checks if state is a string
  if (typeof state !== "string") throw `${state} is not a string.`;
  let states = [
    "AL",
    "AK",
    "AS",
    "AZ",
    "AR",
    "CA",
    "CO",
    "CT",
    "DE",
    "DC",
    "FM",
    "FL",
    "GA",
    "GU",
    "HI",
    "ID",
    "IL",
    "IN",
    "IA",
    "KS",
    "KY",
    "LA",
    "ME",
    "MH",
    "MD",
    "MA",
    "MI",
    "MN",
    "MS",
    "MO",
    "MT",
    "NE",
    "NV",
    "NH",
    "NJ",
    "NM",
    "NY",
    "NC",
    "ND",
    "MP",
    "OH",
    "OK",
    "OR",
    "PW",
    "PA",
    "PR",
    "RI",
    "SC",
    "SD",
    "TN",
    "TX",
    "UT",
    "VT",
    "VI",
    "VA",
    "WA",
    "WV",
    "WI",
    "WY",
  ];
  // Converts state to uppercase
  state = state.toUpperCase();
  // Checks that state is in states array
  if (!states.includes(state)) throw "Invalid state.";
}

function validLatitude(lat: number) {
  // Checks if latitude is a number
  if (typeof lat !== 'number') throw 'Latitude must be a number';
  // Checks if latitude is in the correct range
  if (lat > 90 || lat < -90 ) throw 'Latitiude must be between -90 and 90';
}

function validLongitude(lon: number) {
  // Checks if longitude is a number
  if (typeof lon !== 'number') throw 'Longitude must be a number'
  // Checks if longitude is in the correct range
  if (lon > 180 || lon < -180 ) throw 'Longitude must be between -180 and 180';
}

function validateZip(zip: string) {
  // Checks if zip is a string
  if (typeof zip !== "string") throw `${zip} is not a string.`;
  // Checks if zip is 5 digits
  if (zip.length !== 5) throw "Invalid zip.";
  // Checks if zip only contains numbers
  if (!/^\d+$/.test(zip)) throw "Invalid zip.";
}

function validateImages(imageArray): void {
  if (imageArray.length <= 0) throw "At least one image needs to be submitted";
  for (let i = 0; i < imageArray.length; i++) {
    this.validFile(imageArray[i]);
  }
}

function validateReview(text: string, date: string, rating: Number) {
  validDate(date);
  validRating(rating);
  validString(text);
}

function validNumOfPeople(numOfPeople: Number) {
  // Checks if numOfPeople is a number
  if (typeof numOfPeople !== "number") throw `${numOfPeople} is not a number.`;
  // Checks if numOfPeople is an integer
  if (!Number.isInteger(numOfPeople)) throw "Invalid number of people.";
}

function stringFilter(str: string) {
  validString(str);
  str = str.trim();
  return str;
}

function emailFilter(email: string) {
  validEmail(email);
  return stringFilter(email);
}

export {
  validString,
  validNumber,
  validPrice,
  validEmail,
  validDate,
  validTime,
  validRating,
  validUID,
  validFile,
  validateCity,
  validateState,
  validateZip,
  validLatitude,
  validLongitude,
  validateReview,
  validateImages,
  validListingId,
  validNumOfPeople,
  stringFilter,
  emailFilter,
};
