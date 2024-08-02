import { useSelector } from "react-redux";
import { IoSend as Send } from "react-icons/io5";
import { IComment } from "../types/BlogTypes";
import { Link } from "react-router-dom";
import { useRef } from "react";
import * as api from "../api/Api";
import { FaRegTrashAlt as Delete } from "react-icons/fa";

interface ICommentProps {
    blogId: string;
    comments: IComment[] | null;
    setComments: React.Dispatch<React.SetStateAction<IComment[] | null>>;
    newComment: boolean;
    setNewComment: React.Dispatch<React.SetStateAction<boolean>>;
}

const Comment: React.FC<ICommentProps> = ({ blogId, comments, setComments, newComment, setNewComment }) => {

    const user = useSelector((state: any) => state.user);

    const commentInputRef = useRef<HTMLTextAreaElement>(null);

    const sendComment = (): void => {
        if(commentInputRef.current){
            const comment = commentInputRef.current.value;
            api.fetchData("postComment/", user.token, { userId: user.id, blogId, text: comment }, null)
                .then(() => {
                    setNewComment(!newComment);
                    commentInputRef.current!.value = "";
                });
        }
    }

    return (
        <div className="comment-container w-100">
            <div className="send-comment d-flex">
                <span className="profile-picture me-2">
                    <img src={user.picture_path === "" ? "/public/default-user.png" : user.picture_path} />
                </span>
                <div className="comment-input w-100">
                    <textarea 
                        ref={commentInputRef}
                        className="form-control d-inline" 
                        placeholder="Write a comment" 
                    />
                </div>
                <div className="comment-button">
                    <button
                        className="btn p-0 ms-2 fs-3"
                        title="Send"
                        onClick={() => sendComment()}
                    >
                        <Send />
                    </button>
                </div>
            </div>
            <div className="comments my-2">
                <h4>{comments?.length} Comments</h4>
                {comments?.map(comment => (
                    <div className="comment d-flex border-top pt-2">
                        <div className="profile-picture">
                            <Link to={`/user/${typeof comment.userId !== "string" && comment.userId._id}`}>
                            <span className="profile-picture me-2">
                                <img src={(typeof comment.userId !== "string" && comment.userId.picture_path === "") ? 
                                    "/public/default-user.png" : 
                                    user.picture_path} 
                                />
                            </span>
                            </Link>
                        </div>
                        <div className="text">
                            <div className="info d-flex">
                                <h5 className="username me-2">{typeof comment.userId !== "string" && comment.userId.username}</h5>
                                <p className="comment-date">{comment.createdAt.toString().split("T")[0]}</p>
                            </div>
                            <div className="content">
                                <p className="comment-text">{comment.text}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Comment