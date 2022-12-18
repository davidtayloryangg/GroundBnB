import { Request, Response } from "express";
import * as express from "express";
import * as listingsData from "../data/listings";
import * as bookingsData from "../data/bookings";
import * as validation from "../validation";
import * as xss from "xss";
import * as multer from "multer";
const upload = multer({
  dest: "uploads/",
});
export const listingRoutes = express.Router();
import { getAllListings } from "../data";
import * as distance from "geo-distance";

listingRoutes.get("/page/:pagenum", async (req, res) => {
  let filterByQueryParams = req.query.filterBy
    ? new xss.FilterXSS().process(req.query.filterBy.toString()).trim()
    : null;
  try {
    // Declares a variable named pageNum, sets it equal to req.params.pagenum, and trims req.params.pagenum
    let pageNum = Number(
      new xss.FilterXSS().process(req.params.pagenum).trim()
    );
    // Checks if id is valid
    if (pageNum <= 0 || isNaN(pageNum)) {
      // Returns status code 400 with the error
      return res.status(400).json({ error: "Invalid page number." });
    }
    // Gets listings
    let listings = await listingsData.getListings(pageNum, filterByQueryParams);
    // Return the listings
    res.status(200).json(listings);
  } catch (e) {
    console.log(e);
    // Declares an object named returnJson
    let returnJson = {
      error: "Page Not found.",
    };
    // Returns status 404 and error
    res.status(404).json(returnJson);
  }
});

/**Getting listing and sorting from closest to furthest
 * Client send request to /search/location?lat=xxxx&lon=xxx
 */
listingRoutes.get("/search/location/:pagenum", async (req: Request, res: Response) => {
  console.log("GET /listings/search/location");
  console.log(req.params.pagenum);
  
  let pageNum = Number(
    new xss.FilterXSS().process(req.params.pagenum).trim()
  );
  if (pageNum < 0 || isNaN(pageNum)) {
    // Returns status code 400 with the error
    return res.status(400).json({ error: "Invalid page number." });
  }
  const location = {
    lat: parseFloat(req.query.lat.toString()),
    lon: parseFloat(req.query.lon.toString()),
  };
  const listings = await getAllListings();
  const sortedListings = listings.sort((a, b) => {
    const aDistance = distance
      .between(location, {
        lat: a.address.geolocation.latitude,
        lon: a.address.geolocation.longitude,
      })
      .human_readable().distance;
    const bDistance = distance
      .between(location, {
        lat: b.address.geolocation.latitude,
        lon: b.address.geolocation.longitude,
      })
      .human_readable().distance;
    return aDistance - bDistance;
  });
  if (sortedListings.length < pageNum * 9) {
    if (sortedListings.length < (pageNum - 1) * 9) {
      res.json([])
    } else {
      res.json(sortedListings.slice((pageNum-1) * 9, sortedListings.length));
    }
  } else {
    res.json(sortedListings.slice((pageNum-1) * 9, (pageNum*9)));
  }
});

listingRoutes.post(
  "/:listingId/review",
  async (req: Request, res: Response) => {
    console.log("POST /listings/:listingId/review");
    const listingId = new xss.FilterXSS().process(req.params.listingId).trim();
    const userId = new xss.FilterXSS().process(req.body.userId).trim();
    let rating = req.body.rating;
    let text = new xss.FilterXSS().process(req.body.text).trim();
    let date = new xss.FilterXSS().process(req.body.date).trim();

    try {
      validation.validateReview(text, date, rating);
      await validation.validUID(userId);
    } catch (e) {
      res.status(400).json({ message: e });
      return;
    }

    const getUserBookings = await bookingsData.getUserBookingsForGivenListingId(
      userId,
      listingId
    );
    if (getUserBookings.length === 0) {
      res
        .status(409)
        .json({ message: "User has not previously booked this listing" });
      return;
    }

    let hasPreviouslyBooked = false;
    getUserBookings.forEach((booking) => {
      // console.log(booking.startTimestamp.toDate().getTime());
      // console.log(new Date().getTime());
      if (booking.startTimestamp.toDate().getTime() < new Date().getTime()) {
        hasPreviouslyBooked = true;
      }
    });

    if (!hasPreviouslyBooked) {
      res.status(409).json({
        message:
          "User cannot review listing until on or after their start date.",
      });
      return;
    }

    const hasReviewed = await listingsData.hasUserReviewed(listingId, userId);
    if (hasReviewed) {
      res
        .status(400)
        .json({ message: "User has already reviewed this listing" });
      return;
    }

    const listing = await listingsData.getListing(listingId);
    if (listing.ownerId === userId) {
      res.status(400).json({ message: "Cannot review your own listing" });
      return;
    }

    try {
      await listingsData.addReview(listingId, userId, rating, text, date);
    } catch (e) {
      res.status(500).json({ message: e });
      return;
    }

    const updatedListing = await listingsData.getListing(listingId);

    res.json({ message: "Review added successfully", listing: updatedListing });
  }
);

listingRoutes.post(
  "/create",
  upload.array("imageArray[]"),
  async (req: Request, res: Response) => {
    console.log("POST /listings/create");
    const description = new xss.FilterXSS()
      .process(req.body.description)
      .trim();
    const price = parseFloat(req.body.price);
    const street = new xss.FilterXSS().process(req.body.street).trim();
    const city = new xss.FilterXSS().process(req.body.city).trim();
    const state = new xss.FilterXSS().process(req.body.state).trim();
    const zipcode = new xss.FilterXSS().process(req.body.zipcode).trim();
    const lat = parseFloat(req.body.lat);
    const lon = parseFloat(req.body.lon);
    const ownerId = new xss.FilterXSS().process(req.body.ownerId).trim();
    const imageArray = req.files;

  try {
    validation.validString(description);
    validation.validPrice(price);
    validation.validString(street);
    validation.validateCity(city);
    validation.validateState(state);
    validation.validateZip(zipcode);
    validation.validLatitude(lat);
    validation.validLongitude(lon);
    await validation.validUID(ownerId);
    validation.validateImages(imageArray);
  } catch (e) {
    return res.status(400).json({ message: e });
  }

  try {
    // data function call
    const newListingId = await listingsData.createListing(description, price, street, city, state, zipcode, lat, lon, ownerId, imageArray);
    const newListing = await listingsData.getListing(newListingId);
    return res.status(200).json({ message: 'Listing added successfully', listing: newListing })
  } catch (e) {
    if (e === 'Listing address already exists') return res.status(400).json({ message: e });
    return res.status(500).json({ message: e });
  }
});

listingRoutes.get("/:listingId", async (req: Request, res: Response) => {
  const listingId = new xss.FilterXSS().process(req.params.listingId).trim();

  try {
    validation.validString(listingId);
  } catch (e) {
    res.status(400).json({ message: e });
    return;
  }

  const listingFound = await listingsData.getListing(listingId);

  if (listingFound === null) {
    res.status(404).json({ message: "Listing not found" });
    return;
  }

  res.status(200).json(listingFound);
});

listingRoutes.put("/edit/:listingId", upload.array('imageArray[]'), async (req: Request, res: Response) => {
  console.log("PUT /listings/edit/:listingId");
  const listingId = new xss.FilterXSS().process(req.params.listingId).trim();
  const description = new xss.FilterXSS().process(req.body.description).trim();
  const price = parseFloat(req.body.price);
  const street = new xss.FilterXSS().process(req.body.street).trim();
  const city = new xss.FilterXSS().process(req.body.city).trim();
  const state = new xss.FilterXSS().process(req.body.state).trim();
  const zipcode = new xss.FilterXSS().process(req.body.zipcode).trim();
  const lat = parseFloat(req.body.lat);
  const lon = parseFloat(req.body.lon);
  const ownerId = new xss.FilterXSS().process(req.body.ownerId).trim();
  const imageArray = req.files;

  try {
    validation.validString(description);
    validation.validPrice(price);
    validation.validString(street);
    validation.validateCity(city);
    validation.validateState(state);
    validation.validateZip(zipcode);
    validation.validLatitude(lat);
    validation.validLongitude(lon);
    await validation.validUID(ownerId);
    // validation.validateImages(imageArray);
  } catch (e) {
    return res.status(400).json({ message: e })
  }

  try {
    const updatedListingId = await listingsData.editListing(listingId, description, price, street, city, state, zipcode, lat, lon, ownerId, imageArray);
    const updatedListing = await listingsData.getListing(updatedListingId);
    return res.status(200).json({ message: 'Listing updated successfully', listing: updatedListing })
  } catch (e) {
    if (e === 'Listing with listingId does not exist' || e === 'Listing address already exists') return res.status(400).json({ message: e });
    return res.status(500).json({ message: e });
  }
});

listingRoutes.get("/owner/:ownerId", async (req: Request, res: Response) => {
  const ownerId = new xss.FilterXSS().process(req.params.ownerId).trim();

  try {
    await validation.validUID(ownerId);
  } catch (e) {
    res.status(400).json({ message: e });
    return;
  }

  const listingsFound = await listingsData.getListingByOwnerId(ownerId);
  res.status(200).json(listingsFound);
});
