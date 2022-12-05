import { Request, Response } from "express";
import * as express from "express";
import * as bookingsData from "../data/bookings";
import * as listingsData from "../data/listings";
import * as xss from "xss";
import * as validation from "../validation";
export const bookingRoutes = express.Router();

bookingRoutes.post(
  "/:bookingId/cancel",
  async (req: Request, res: Response) => {
    console.log("POST /bookings/:bookingId/cancel");
    const bookingId = req.params.bookingId;

    const booking = await bookingsData.getBooking(bookingId);
    if (booking === null) {
      res.status(404).json({ message: "Booking not found" });
      return;
    }
    if (booking.status === "CANCELED") {
      res.status(400).json({ message: "Booking already canceled" });
      return;
    }

    try {
      await bookingsData.cancelBooking(bookingId);
    } catch (e) {
      res.status(500).json({ message: e });
      return;
    }

    const canceledBooking = await bookingsData.getBooking(bookingId);

    res.json({
      message: "Booking canceled successfully",
      booking: canceledBooking,
    });
  }
);

bookingRoutes.get("/all", async (req: Request, res: Response) => {
  console.log("GET /bookings/all");

  const bookings = await bookingsData.getAllBookings();

  if (bookings === null) {
    res.status(404).json({ message : "No Bookings Found"});
    return;
  } 

  res.status(200).json(bookings);
});

bookingRoutes.post("/create", async (req: Request, res: Response) => {
  console.log("POST /bookings/create");

  const bookerId = new xss.FilterXSS().process(req.body.bookerId).trim();
  const listingId = new xss.FilterXSS().process(req.body.listingId).trim();
  const numOfPeople = parseInt(new xss.FilterXSS().process(req.body.numOfPeople).trim());
  const endTimestamp = new xss.FilterXSS().process(req.body.endTimestamp).trim();
  const startTimestamp = new xss.FilterXSS().process(req.body.startTimestamp).trim();

  try {
    validation.validNumOfPeople(numOfPeople);
    validation.validDate(endTimestamp);
    validation.validDate(startTimestamp);
    await validation.validUID(bookerId);
    await validation.validListingId(listingId);
  } catch (e) {
    res.status(400).json({ message : e});
    return;
  }

  // get all bookings for the given listingId for this booking
  const listingFound = await listingsData.getListing(listingId);

  if (listingFound === null) {
    res.status(404).json({ message : 'Listing not found'});
    return;
  }

  if (listingFound.ownerId === bookerId) {
    res.status(409).json({ message : 'Owner cannot book their own listing'});
    return;
  }

  const startDate = new Date(startTimestamp);
  const endDate = new Date(endTimestamp);
  const today = new Date();

  const startDateJustDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
  const endDateJustDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());

  if (endDateJustDate < startDateJustDate) {
    res.status(400).json({ message : 'Booking starting time cannot be greater than booking end time'});
    return;
  } else if (startDateJustDate < new Date(today.getFullYear(), today.getMonth(), today.getDate())) {
    res.status(400).json({ message : 'Booking starting time cannot be less than todays date'});
    return;
  }

  // get all dates already booked for that listing
  const futureBookingsForListing = [];
  const bookings = await bookingsData.getBookingsByListingId(listingId);
  bookings.forEach((booking) => {
    const startDateJustDate = new Date(booking.startTimestamp.toDate().getFullYear(), booking.startTimestamp.toDate().getMonth(), booking.startTimestamp.toDate().getDate());
    const endDateJustDate = new Date(booking.endTimestamp.toDate().getFullYear(), booking.endTimestamp.toDate().getMonth(), booking.endTimestamp.toDate().getDate());

    if (endDateJustDate > new Date(today.getFullYear(), today.getMonth(), today.getDate())) {
      let isUnique = futureBookingsForListing.find(date => date.getTime() === startDateJustDate.getTime());

      if(!isUnique) {
        futureBookingsForListing.push(startDateJustDate);
      } else if (futureBookingsForListing.length === 0) {
        futureBookingsForListing.push(startDateJustDate);
      }

      let nextDateJustTime = new Date(startDateJustDate.getFullYear(), startDateJustDate.getMonth(), startDateJustDate.getDate());
      while (endDateJustDate.getTime() > nextDateJustTime.getTime()) {
        nextDateJustTime.setDate(nextDateJustTime.getDate() + 1);
        let isUnique = futureBookingsForListing.find(date => date.getTime() === nextDateJustTime.getTime());
        
        if(!isUnique){
          futureBookingsForListing.push(new Date(nextDateJustTime.getFullYear(), nextDateJustTime.getMonth(), nextDateJustTime.getDate())); 
        }
      }
    }
  });

  // get all dates wanting to be booked
  let datesTryingToBook = [startDateJustDate];
  let nextDateJustDate = new Date(startDateJustDate.getFullYear(), startDateJustDate.getMonth(), startDateJustDate.getDate());
  while (endDateJustDate.getTime() > nextDateJustDate.getTime()) {
    nextDateJustDate.setDate(nextDateJustDate.getDate() + 1);
    let isUnique = datesTryingToBook.find(date => date.getTime() === nextDateJustDate.getTime());

    if (!isUnique) {
      datesTryingToBook.push(new Date(nextDateJustDate.getFullYear(), nextDateJustDate.getMonth(), nextDateJustDate.getDate()));
    }
  }

  // check if dates booked conflict with dates being tried to book
  try {
    datesTryingToBook.forEach((date) => {
      futureBookingsForListing.forEach((futureBooking) => {
        if (date.getTime() === futureBooking.getTime()) {
          throw 'Dates to be book conflict';
        }
      });
    });
  } catch (e) {
    res.status(409).json({ message : e});
    return;
  }
  

  const diffInDays = Math.round((endDateJustDate.getTime() - startDateJustDate.getTime()) / (1000 * 60 * 60 * 24));
  const booking = await bookingsData.createBooking(bookerId, listingId, numOfPeople, listingFound.ownerId, (listingFound.price * (diffInDays + 1)), endDateJustDate.toString(), startDateJustDate.toString());
  res.status(200).json(booking);
});
