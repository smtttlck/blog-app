import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";
import * as api from "../api/Api";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import IBlog from "../types/BlogTypes";
import List from "../components/List";

const Profile = () => {

    const user = useSelector((state: any) => state.user);

    const [blogType, setBlogType] = useState<"blogs" | "bookmarks">("blogs");
    const [blogs, setBlogs] = useState<IBlog[]>([]);

    useEffect(() => {
        let queryString: string;
        if (blogType === "blogs")
            queryString = `?authorId=${user.id}&limit=6`;
        else if (blogType === "bookmarks")
            queryString = `?userId=${user.id}&onlyBookmarks=true&limit=6`;
        api.fetchData("getBlog/", user.token, null, queryString!)
            .then(data => setBlogs(data));
    }, [blogType])

    return (
        <main className="page">
            <Navbar />

            <div className="container">

                <div className="big-profile-picture text-center mt-3">
                    <img src={user.picture_path} />
                    <h3>{user.username}</h3>
                </div>

                <div className="tablist d-flex justify-content-center my-2">
                    <ul className="list-group list-group-horizontal">
                        <li
                            className={`list-group-item w-auto list-group-item-action ${blogType == "blogs" ? "list-group-item-success" : ""}`}
                            onClick={() => setBlogType("blogs")}
                        >
                            Blogs
                        </li>
                        <li
                            className={`list-group-item w-auto list-group-item-action ${blogType == "bookmarks" ? "list-group-item-success" : ""}`}
                            onClick={() => setBlogType("bookmarks")}
                        >
                            Bookmarks
                        </li>
                    </ul>
                </div>

                <List
                    datas={blogs}
                />

            </div>

            <Footer />

        </main >
    )
}

export default Profile