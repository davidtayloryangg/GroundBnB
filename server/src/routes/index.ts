import {userRoutes} from "./users"
import {listingRoutes} from "./listings"
import * as express from "express";

export const routes = express.Router();

routes.use("/users", userRoutes);
routes.use("/listings", listingRoutes);
