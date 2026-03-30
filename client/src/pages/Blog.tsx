import Navbar from "../components/Navbar";
import ShowBlog from "../components/ShowBlog";
import List from "../components/List";
import Footer from "../components/Footer";
import CommentBox from "../components/CommentBox";
import useBlogPage from "../hooks/useBlogPage";
import useAppSelector from "../hooks/useAppSelector";

const Blog = () => {

    const user = useAppSelector((state) => state.user);
    const {
        blog,
        comments,
        newComment,
        otherBlogs,
        otherBlogsTargetUrl,
        setNewComment,
    } = useBlogPage({
        token: user.token,
        userId: user.id,
    });

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
                            comments={comments}
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
                            targetUrl={otherBlogsTargetUrl}
                            isFetching={true}
                        />
                    }
                </div>

            <Footer />

        </main>
    )
}

export default Blog