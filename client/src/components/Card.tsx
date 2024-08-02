import { Link } from "react-router-dom"
import IBlog from "../types/BlogTypes"
import { FaRegBookmark as UnBookmared, FaBookmark as Bookmared, FaRegComment as Comment } from "react-icons/fa";
import { useState } from "react";
import * as api from "../api/Api";
import { useSelector } from "react-redux";

interface ICardProps extends IBlog {
    userId: string;
};

const Card: React.FC<ICardProps> = ({ _id, authorId, title, text, picture_path, updatedAt, userId, isBookmarked, commentCounter }) => {
    
    const user = useSelector((state: any) => state.user);

    const [bookmark, setBookmark] = useState<boolean>(isBookmarked!);

    const handleBookmark = (): void => {
        api.fetchData(`${bookmark ? "delete" : "post"}Bookmark`, user.token, { userId, blogId: _id }, null)
            .then(() => setBookmark(!bookmark));
    }

    return (
        <div className="card mb-3">
            <div className="row g-0">
                <div className="card-image border-end col-4">
                    <Link to={`/blog/${_id}`}>
                        <img
                            src={picture_path !== "" ? picture_path : "/public/default-blog.jpg"}
                            className="img-fluid w-100 h-100 rounded-start"
                            alt={title}
                        />
                    </Link>
                </div>
                <div className="col-8">
                    <div className="card-body">
                        <Link to={`/blog/${_id}`}>
                            <h5 className="card-title">{title}</h5>
                            <p className="card-text">{text}</p>
                        </Link>
                        <Link to={`/user/${typeof authorId !== "string" && authorId._id}`}>
                            <div className="author d-flex position-absolute bottom-0 mb-3">
                                <div className="profile-picture me-3">
                                    {typeof authorId !== "string" && authorId.picture_path === "" ?
                                        <span className="profile-picture">
                                            <img src="/public/default-user.png" />
                                        </span> :
                                        typeof authorId !== "string" && authorId.picture_path &&
                                        <span className="profile-picture">
                                            <img src={`http://localhost:3001/${authorId.picture_path.split("public\\")[1].split("\\").join('/')}`} />
                                        </span>
                                    }
                                </div>
                                <div className="user-info d-flex flex-column my-auto">
                                    {typeof authorId !== "string" && <small className="username text-body-secondary"><b>{authorId.username}</b></small>}
                                    <small className="subText text-body-secondary">
                                        <span className="updatedAt">{updatedAt.toString().split("T")[0]}</span> ·
                                        <span className="comment-counter">
                                            <span className="icon ms-2 me-1 fs-5"><Comment /></span>
                                            <b>{commentCounter}</b>
                                        </span>
                                    </small>
                                </div>
                            </div>
                        </Link>
                    </div>
                    <span 
                        className="bookmark d-flex position-absolute bottom-0 end-0 m-3 fs-4"
                        onClick={() => handleBookmark()}
                    >
                        {bookmark ? <Bookmared /> : <UnBookmared />}
                    </span>
                </div>
            </div>
        </div>
    )
}

export default Card