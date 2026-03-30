import { useRef } from "react";
import * as commentService from "../services/commentService";

interface IUseCommentBoxParams {
    blogId: string;
    token: string;
    userId: string;
    newComment: boolean;
    setNewComment: React.Dispatch<React.SetStateAction<boolean>>;
}

const useCommentBox = ({ blogId, token, userId, newComment, setNewComment }: IUseCommentBoxParams) => {

    // ref for the comment input textarea
    const commentInputRef = useRef<HTMLTextAreaElement>(null);

    // function to send a new comment
    const sendComment = (): void => {
        const text = commentInputRef.current?.value.trim();

        if (!text) {
            return;
        }

        commentService.addComment(token, userId, blogId, text)
            .then(() => {
                setNewComment(!newComment);

                if (commentInputRef.current) {
                    commentInputRef.current.value = "";
                }
            });
    };

    return {
        commentInputRef,
        sendComment,
    };
};

export default useCommentBox;