import * as express from 'express';
import { Request, Response } from 'express';
import {Routes} from './routes/index';

let totalRequest: number = 0;
let dict: object = {};

class App {
    public app: express.Application;
    public routePrv: Routes = new Routes();

    constructor() {
        this.app = express();
        this.config();
        this.routePrv.routes(this.app);
    }

    Logger = (req: Request, res: Response, next: Function) => {
        totalRequest++;
        dict[totalRequest] = req.url;
        console.log(`Request #${totalRequest}: ${req.url}`);
        next();
    }

    private config(): void {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));
        this.app.use(this.Logger);
    }
}

export default new App().app;