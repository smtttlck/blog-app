import IRoute from "../types/RouteTypes";
import { Login, Home, Blog } from "../pages/index";
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
    },
    {
        name: "Blog",
        path: "/blog/:id",
        component: Blog,
        auth: true
    }
]

export default routes;