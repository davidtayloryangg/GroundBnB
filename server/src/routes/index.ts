import {userRoutes} from "./users"
import * as express from "express";

export const routes = express.Router();

routes.use("/users", userRoutes);
