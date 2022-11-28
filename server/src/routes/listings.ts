import { Request, Response } from "express";
import * as express from "express";
export const listingRoutes = express.Router();
//import {getAllListing} from "../data"
import * as distance from "geo-distance"


/**Getting listing and sorting from closest to furthest 
 * Send request to /search/location?lat=xxxx&lon=xxx
*/
listingRoutes.get('/search/location', async (req: Request, res: Response) => {
    console.log("GET /listings/search/location");
    /** Send request to /search/location?lat=xxxx&lon=xxx */
    const location = { lat : req.query.lat, lon : req.query.lon}

    res.json({message: 'successfuly got listings'});
    }
);
