import IBlog from "../types/BlogTypes"

interface ICardProps extends IBlog { };

const Card: React.FC<ICardProps> = ({ _id, authorId, title, text, picture_path, createdAt, updatedAt }) => {
    return (
        <div className="card mb-3 mx-auto">
            <div className="row g-0">
                <div className="card-image col-md-4">
                    <img
                        src={picture_path !== "" ? picture_path : "/public/default-blog.jpg"}
                        className="img-fluid h-100 rounded-start"
                        alt={title}
                    />
                </div>
                <div className="col-md-8">
                    <div className="card-body">
                        <h5 className="card-title">{title}</h5>
                        <p className="card-text">{text}</p>
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
                                <small className="updatedAt text-body-secondary">{updatedAt.toString().split("T")[0]}</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Card