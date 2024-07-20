import IRoute from "../types/RouteTypes";
import { Login, Home } from "../pages/index";

const routes: IRoute[] = [
    {
        name: "Login",
        path: "/login",
        component: Login,
        auth: false
    },
    {
        name: "Home",
        path: "/",
        component: Home,
        auth: true
    }
]

export default routes;