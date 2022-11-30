import { Request, Response } from "express";
import * as express from "express";
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
    }
);
