import xss from "xss";

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

function validateZip(zip: string) {
  // Checks if zip is a string
  if (typeof zip !== "string") throw `${zip} is not a string.`;
  // Checks if zip is 5 digits
  if (zip.length !== 5) throw "Invalid zip.";
  // Checks if zip only contains numbers
  if (!/^\d+$/.test(zip)) throw "Invalid zip.";
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

function isAtLeast13(dob: Date) {
  var today = new Date();

  var age = today.getFullYear() - dob.getFullYear();
  if (
    dob.getMonth() > today.getMonth() ||
    (dob.getMonth() === today.getMonth() && dob.getDate() > today.getDate())
  ) {
    age--;
  }

  if (age < 13) {
    throw "You must be at least 13 years old to use this service.";
  }
}

function stringFilter(str: string) {
  validString(str);
  str = xss(str);
  str = str.trim();
  return str;
}

function reviewFilter(str: string) {
  str = xss(str);
  return str;
}

function emailFilter(email: string) {
  validEmail(email);
  return stringFilter(email);
}

export {
  validString,
  validNumber,
  validEmail,
  validDate,
  validTime,
  validRating,
  validateCity,
  validateState,
  validateZip,
  validateReview,
  validNumOfPeople,
  isAtLeast13,
  stringFilter,
  emailFilter,
  reviewFilter
};
