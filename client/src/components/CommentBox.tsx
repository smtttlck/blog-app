import { useSelector } from "react-redux";
import { IoSend as Send } from "react-icons/io5";
import { IComment } from "../types/BlogTypes";
import { useRef } from "react";
import * as api from "../api/Api";
import CommentCard from "./CommentCard";

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
        if (commentInputRef.current) {
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
                {comments?.map((comment, index) => {
                    if (typeof comment.userId !== "string")
                        return (
                            <CommentCard
                                key={`comment-${index}`}
                                userId={comment.userId._id}
                                username={comment.userId.username}
                                picture_path={comment.userId.picture_path}
                                createdAt={comment.createdAt}
                                text={comment.text}
                            />
                        )
                })}
            </div>
        </div>
    )
}

export default Comment