import { Request, Response } from "express";
import * as express from "express";
export const userRoutes =express.Router();

userRoutes.get('/', (req: Request, res: Response) => {
    console.log("GET /users");
    
    res.json({message: 'successfuly got users'});
    });

// export class Users {
//     public routes(app): void {
//         app.route('/')
//             .get((req: Request, res: Response) => {
//                 console.log("GET request received at /users");
//                 res.json({ message: "GET request received at /users" });
//             })
//     }
// }