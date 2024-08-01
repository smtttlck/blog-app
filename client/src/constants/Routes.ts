import IRoute from "../types/RouteTypes";
import { Login, Home, Blog, Write, User, About, Profile, Explore } from "../pages/index";

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
    },
    {
        name: "User",
        path: "/user/:id",
        component: User,
        auth: true
    },
    {
        name: "About",
        path: "/about",
        component: About,
        auth: true
    },
    {
        name: "Profile",
        path: "/profile",
        component: Profile,
        auth: true
    },
    {
        name: "Explore",
        path: "/explore",
        component: Explore,
        auth: true
    }
]

export default routes;