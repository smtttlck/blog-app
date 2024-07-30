import { useNavigate } from "react-router-dom";
import * as api from "../api/Api";
import { useState } from "react";

interface IModalProps {
    id: string;
    token: string;
    option: string;
}

const Modal: React.FC<IModalProps> = ({ id, token, option }) => {

    const navigate = useNavigate();

    const [modalOption, setModalOption] = useState<string>(option)
    const [profilePicture, setProfilePicture] = useState<string>("");
    const [file, setFile] = useState<File | null>(null);

    const handleProfilePicChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setFile(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target?.result) {
                    setProfilePicture(e.target.result as string);
                }
            };
            reader.readAsDataURL(file);
        }
    };


    const deleteHandler = (): void => {
        api.fetchData(`deleteBlog/${id}`, token, null, null)
            .then(() => navigate("/"));
    }

    const updateHandler = (): void => {
        const data = { image: file }
        api.fetchData(`putUser/${id}`, token, data, null)
            .then(() => location.reload());
    }

    return (
        <div
            className={`modal fade ${modalOption === "newUser" ? "show d-block bg-dark bg-opacity-50" : " "}`}
            id="modal" tabIndex={-1} aria-labelledby="modalLabel" aria-hidden="true"
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <button
                            type="button" className="btn-close"
                            onClick={() => setModalOption("")}
                            data-bs-dismiss="modal" aria-label="Close"
                        />
                    </div>
                    {option === "deleteBlog" ? (
                        <>
                            <div className="modal-body text-center fs-5 my-3">
                                Are you sure you want to delete this blog?
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
                        </>
                    ) : (
                        <>
                            <div className="modal-body text-center fs-5 my-3">
                                <h5>Pick a profile picture</h5>
                                <input
                                    type="file"
                                    id="profile-picture-input"
                                    accept="image/*"
                                    hidden
                                    onChange={handleProfilePicChange}
                                />
                                <label htmlFor="profile-picture-input" className="profile-picture-label mt-2">
                                    <img
                                        id="profile-picture"
                                        alt="Profile Picture"
                                        src={profilePicture === "" ? "/public/default-user.png" : profilePicture}
                                    />
                                </label>
                            </div>
                            <div className="modal-footer flex-nowrap">
                                <button
                                    type="button"
                                    className={`btn btn-secondary w-${profilePicture === "" ? "100" : "50"}`}
                                    data-bs-dismiss="modal"
                                    onClick={() => setModalOption("")}
                                >
                                    Skip for now
                                </button>
                                {profilePicture !== "" &&
                                    <button
                                        type="button"
                                        className={`btn btn-success w-50`}
                                        data-bs-dismiss="modal"
                                        onClick={() => {
                                            updateHandler();
                                            setModalOption("");
                                        }}
                                    >
                                        Update photo
                                    </button>
                                }
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Modal