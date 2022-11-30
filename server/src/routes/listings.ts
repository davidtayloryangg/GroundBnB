import { Request, Response } from "express";
import * as express from "express";
import * as listingsData from "../data/listings";
import * as validation from "../validation";
import * as xss from "xss";
export const listingRoutes = express.Router();
import {getAllListings} from "../data"
import * as distance from "geo-distance"


/**Getting listing and sorting from closest to furthest 
 * Client send request to /search/location?lat=xxxx&lon=xxx
*/
listingRoutes.get('/search/location', async (req: Request, res: Response) => {
    console.log("GET /listings/search/location");
    const location = { lat : parseFloat(req.query.lat.toString()), lon : parseFloat(req.query.lon.toString())}
    const listings = await getAllListings();
    const sortedListings = listings.sort((a,b) => {
        const aDistance = distance.between(location, {lat: a.address.geolocation.latitude, lon: a.address.geolocation.longitude}).human_readable().distance;
        const bDistance = distance.between(location, {lat: b.address.geolocation.latitude, lon: b.address.geolocation.longitude}).human_readable().distance;
        return aDistance - bDistance;
    });
    res.json(sortedListings);
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

    const hasReviewed = await listingsData.hasUserReviewed(listingId, userId);
    if (hasReviewed) {
      res
        .status(400)
        .json({ message: "User has already reviewed this listing" });
      return;
    }

    const listing = await listingsData.getListing(listingId);
    if (listing.owner === userId) {
      res.status(400).json({ message: "Cannot review your own listing" });
      return;
    }

    await listingsData.addReview(listingId, userId, rating, text, date);

    const updatedListing = await listingsData.getListing(listingId);

    res.json({ message: "Review added successfully", listing: updatedListing });
  }
);
