import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";
import * as api from "../api/Api";
import IBlog from "../types/BlogTypes";
import IUser from "../types/UserTypes";
import ShowBlog from "../components/ShowBlog";
import List from "../components/List";

const Blog = () => {

    const navigate = useNavigate();

    const user = useSelector((state: any) => state.user);

    const { id } = useParams<string>();

    const [blog, setBlog] = useState<IBlog | null>(null);
    const [otherBlogs, setOtherBlogs] = useState<IBlog[] | null>(null);

    useEffect(() => {
        if (user.id === "")
            navigate("/login");
    }, [user])

    useEffect(() => {
        api.fetchData(`getBlog/${id}`, user.token, null, null)
            .then((data: IBlog) => {
                setBlog(data);
                if (data.authorId && typeof data.authorId !== "string")
                    api.fetchData("getBlog/", user.token, null, `?authorId=${data.authorId._id}&excludeBlogId=${id}&limit=3`)
                        .then((data: IBlog[]) => setOtherBlogs(data));
            }); console.log("ooo: ", otherBlogs) // sil

    }, [id])

    return (
        <main className="page">
            <Navbar />

            <div className="container">

                {blog &&
                    <ShowBlog
                        _id={blog._id}
                        authorId={blog.authorId}
                        createdAt={blog.createdAt}
                        picture_path={blog.picture_path}
                        text={blog.text}
                        title={blog.title}
                        updatedAt={blog.updatedAt}
                    />
                }
            </div>

                <div className="other-blogs col-11 mx-auto pb-5">
                    {otherBlogs &&
                        <List
                            title="User's other blogs"
                            datas={otherBlogs}
                        />
                    }
                </div>


        </main>
    )
}

export default Blog