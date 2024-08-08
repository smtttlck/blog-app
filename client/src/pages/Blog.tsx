import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";
import * as api from "../api/Api";
import IBlog, { IComment } from "../types/BlogTypes";
import ShowBlog from "../components/ShowBlog";
import List from "../components/List";
import Footer from "../components/Footer";
import CommentBox from "../components/CommentBox";

const Blog = () => {

    const user = useSelector((state: any) => state.user);

    const { id } = useParams<string>();

    const [blog, setBlog] = useState<IBlog | null>(null);
    const [otherBlogs, setOtherBlogs] = useState<IBlog[] | null>(null);
    const [comments, setComments] = useState<IComment[] | null>(null);
    const [newComment, setNewComment] = useState<boolean>(false);


    useEffect(() => {
        api.fetchData(`getBlog/${id}`, user.token, null, null)
            .then((data: IBlog) => {
                setBlog(data);
                if (data.authorId && typeof data.authorId !== "string")
                    api.fetchData("getBlog/", user.token, null, `?authorId=${data.authorId._id}&excludeBlogId=${id}&sort=bookmarkCounter&sortType=DESC&limit=3`)
                        .then((data: IBlog[]) => setOtherBlogs(data));
                window.scrollTo(0, 0);
                document.title = data.title;
        });
    }, [id])

    useEffect(() => {
        api.fetchData(`getComment/${id}`, user.token, null, null)
            .then(data => setComments(data));
    }, [id, newComment])

    return (
        <main className="page">
            <Navbar />

            <div className="container">

                {blog &&
                    <>
                        <ShowBlog
                            _id={blog._id}
                            authorId={blog.authorId}
                            createdAt={blog.createdAt}
                            picture_path={blog.picture_path}
                            text={blog.text}
                            title={blog.title}
                            updatedAt={blog.updatedAt}
                        />
                        <CommentBox 
                            blogId={blog._id}
                            comments={comments} setComments={setComments}
                            newComment={newComment} setNewComment={setNewComment}
                        />
                    </>
                }
            </div>

                <div className="other-blogs col-11 mx-auto pb-5">
                    {(otherBlogs && otherBlogs.length > 0) &&
                        <List
                            title="User's other blogs"
                            datas={otherBlogs}
                            targetUrl={`/user/${(blog && typeof blog.authorId !== "string") && blog.authorId._id}`}
                            isFetching={true}
                        />
                    }
                </div>

            <Footer />

        </main>
    )
}

export default Blog