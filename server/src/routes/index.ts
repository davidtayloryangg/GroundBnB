import {Users} from "./users"
export class Routes {
    public routes(app): void {
        app.use("/users", Users )
    }
}