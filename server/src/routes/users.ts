import { Request, Response } from "express";

export class Users {
    public routes(app): void {
        app.route('/')
            .get((req: Request, res: Response) => {
                res.status(200).send({
                    message: 'GET request successfulll!!!!'
                })
            })
            .post((req: Request, res: Response) => {
                res.status(200).send({
                    message: 'POST request successfulll!!!!'
                })
            })
    }
}