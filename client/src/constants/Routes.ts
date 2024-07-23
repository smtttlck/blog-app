import IRoute from "../types/RouteTypes";
import { Login, Home } from "../pages/index";
import Write from "../pages/Write";

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
    },
    {
        name: "Write",
        path: "/write",
        component: Write,
        auth: true
    }
]

export default routes;