import IBlog from "../types/BlogTypes";
import { FaEdit as Edit, FaRegTrashAlt as Delete } from "react-icons/fa";
import Modal from "./Modal";
import { Link } from "react-router-dom";
import { dateToString, getUserIdFromToken, pathForPicture } from "../utils/helperFuncs";
import useShowBlog from "../hooks/useShowBlog";
import useAppSelector from "../hooks/useAppSelector";

interface IShowBlogProps extends IBlog { }

const ShowBlog: React.FC<IShowBlogProps> = ({ _id, authorId, createdAt, picture_path, text, title, updatedAt: _updatedAt }) => {
    const user = useAppSelector((state) => state.user);
    const currentUserId = user.id || getUserIdFromToken(user.token);
    const { operation, textRef, titleRef, toggleOperation, updateHandler } = useShowBlog({
        token: user.token,
        blogId: _id,
        defaultTitle: title,
        defaultText: text,
    });

    return (
        <>
            {(typeof authorId !== "string" && currentUserId === authorId._id) &&
                <Modal
                    id={_id}
                    token={user.token}
                    option="deleteBlog"
                />
            }
            <div className={`blog py-4 ${operation === "edit" ? "mb-5" : ""}`}>
                <div className="blog-img">
                    <img
                        className="img-fluids object-fit-scale"
                        src={picture_path === "" ? "/public/default-blog.jpg" : picture_path}
                        alt={title}
                    />
                </div>
                {(typeof authorId !== "string" && authorId._id === currentUserId) && (
                    <div className="blog-buttons fs-3 float-end">
                        <span
                            className="edit-button me-1"
                            title="Edit"
                            onClick={toggleOperation}
                        >
                            <Edit />
                        </span>
                        <span
                            className="delete-button"
                            title="Delete"
                            data-bs-toggle="modal" data-bs-target="#modal"
                        >
                            <Delete />
                        </span>
                    </div>
                )}
                <div className="blog-title d-flex justify-content-center">
                    {operation === "show" ?
                        <h1 className="fs-1">{title}</h1> :
                        <input
                            ref={titleRef} defaultValue={title}
                            className="form-check fs-1 border-0 p-0"
                            type="text" name="title"
                        />
                    }
                </div>
                <div className="blog-info d-flex justify-content-between">
                    <div className="author d-flex mb-3">
                        <Link to={typeof authorId !== "string" ? `/user/${authorId._id}` : ""}>
                            <div className="profile-picture me-3">
                                {typeof authorId !== "string" && authorId.picture_path === "" ?
                                    <span className="profile-picture">
                                        <img src="/public/default-user.png" />
                                    </span> :
                                    typeof authorId !== "string" && authorId.picture_path &&
                                    <span className="profile-picture">
                                        <img src={pathForPicture(authorId.picture_path)} />
                                    </span>
                                }
                            </div>
                        </Link>
                        <div className="user-info d-flex flex-column mt-1 fs-5">
                            {typeof authorId !== "string" && (<>
                                <Link to={typeof authorId !== "string" ? `/user/${authorId._id}` : ""}>
                                    <small className="username text-body-secondary"><b>{authorId.username}</b></small>
                                </Link>
                                <small className="updatedAt text-body-secondary">{authorId.email}</small>
                            </>)}
                        </div>
                    </div>
                    <p className="date fs-2">{dateToString(createdAt)}</p>
                </div>
                <div className="text text-break fs-4">
                    {operation === "show" ?
                        <p>{text}</p> :
                        <textarea
                            ref={textRef} defaultValue={text}
                            className="form-check fs-1 border-0 p-0 w-100"
                            name="text" rows={10} lang="en"
                        />
                    }
                </div>
                {operation === "edit" &&
                    <button
                        className="btn btn-primary float-end my-3"
                        onClick={updateHandler}
                    >
                        Update
                    </button>
                }
            </div>
        </>
    )
}

export default ShowBlog;