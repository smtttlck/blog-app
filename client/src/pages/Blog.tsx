import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";
import * as api from "../api/Api";
import IBlog from "../types/BlogTypes";
import ShowBlog from "../components/ShowBlog";

const Blog = () => {

    const navigate = useNavigate();

    const user = useSelector((state: any) => state.user);

    const { id } = useParams();

    const [blog, setBlog] = useState<IBlog | null>(null);

    useEffect(() => {
        if (user.id === "")
            navigate("/login");
    }, [user])

    useEffect(() => {
        api.fetchData(`getBlog/${id}`, user.token, null, null)
            .then((data: IBlog) => setBlog(data));
    }, [id])

    console.log(blog); // sil   

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

        </main>
    )
}

export default Blog