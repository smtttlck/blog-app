import { Link } from "react-router-dom"
import { dateToString, pathForPicture } from "../utils/helperFuncs"

interface ICommentCardProps {
    userId: string;
    username: string;
    picture_path?: string;
    createdAt: Date;
    text: string;
}

const CommentCard: React.FC<ICommentCardProps> = ({ userId, username, picture_path, createdAt, text }) => {
    return (
        <div className="comment d-flex border-top pt-2">
            <div className="profile-picture">
                <Link to={`/user/${userId}`}>
                    <span className="profile-picture me-2">
                        <img src={(picture_path === "") ? "/public/default-user.png" : pathForPicture(picture_path!)} />
                    </span>
                </Link>
            </div>
            <div className="text">
                <div className="info d-flex">
                    <h5 className="username me-2">{username}</h5>
                    <p className="comment-date">{dateToString(createdAt)}</p>
                </div>
                <div className="content">
                    <p className="comment-text">{text}</p>
                </div>
            </div>
        </div>
    )
}

export default CommentCard