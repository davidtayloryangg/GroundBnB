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

export {
  validString,
  validNumber,
  validEmail,
  validDate,
  validTime,
  validRating,
  validUID,
};
