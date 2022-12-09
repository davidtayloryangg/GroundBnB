import { Request, Response } from "express";
import * as express from "express";
export const userRoutes = express.Router();
import { createUser } from "../data";
import * as xss from "xss";
import * as validation from "../validation";

//for testing purposes
userRoutes.get("/", (req: Request, res: Response) => {
  console.log("GET /users");
  res.json({ message: "successfuly got users" });
});

/**Create a new user Account
 * Request Body: {userId: string, email: string, firstName: string, lastName: string,
 * birthDay: number, birthMonth: number, birthYear: number}
 */
userRoutes.post("/signup", async (req: Request, res: Response) => {
  console.log("POST /users/signup");
  let userId = new xss.FilterXSS().process(req.body.userId).trim();
  let email = new xss.FilterXSS().process(req.body.email).trim();
  let firstName = new xss.FilterXSS().process(req.body.firstName).trim();
  let lastName = new xss.FilterXSS().process(req.body.lastName).trim();

  try {
    email = validation.emailFilter(email);
    validation.validUID(userId);
    firstName = validation.stringFilter(firstName);
    lastName = validation.stringFilter(lastName);
  } catch (e) {
    return res.status(400).json({ error: e });
  }
  try {
    await createUser(userId, email, firstName, lastName);
  } catch (e) {
    return res.status(500).json({ error: e });
  }
  return res.status(200).json({ result: "success" });
});

/**Logs a user into the system
 * Request body parameters:
 * username: string, password: string
 */
userRoutes.post("/login", (req: Request, res: Response) => {
  console.log("POST /users/login");
  res.json({ message: "successfuly logged in" });
});

/**Logs out current logged in user session
 * Request body parameters:
 * username: string, password: string
 *  */
userRoutes.get("/logout", (req: Request, res: Response) => {
  console.log("GET /users/logout");
  res.json({ message: "successfuly logged out" });
});
