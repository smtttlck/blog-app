import { useNavigate } from "react-router-dom";
import * as api from "../api/Api";

interface IModalProps {
    id: string;
    token: string;
}

const Modal: React.FC<IModalProps> = ({ id, token }) => {

    const navigate = useNavigate();

    const deleteHandler = (): void => {
        api.fetchData(`deleteBlog/${id}`, token, null, null)
            .then(() => navigate("/"));
    }

    return (
        <div className="modal fade" id="modal" tabIndex={-1} aria-labelledby="modalLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body text-center fs-5 my-3">
                        Are you sure you want this blog?
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button 
                            type="button" 
                            className="btn btn-danger"
                            data-bs-dismiss="modal"
                            onClick={() => deleteHandler()}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Modal