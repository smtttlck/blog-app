import { Link } from "react-router-dom"
import IBlog from "../types/BlogTypes"

interface IBigCardProps extends IBlog { };

const BigCard: React.FC<IBigCardProps> = ({ _id, authorId, title, text, picture_path, createdAt, updatedAt }) => {
    return (
        <div className="big-card card mb-3 col-9">
                <Link to={`/blog/${_id}`} className="big-card-img h-50 overflow-hidden">
                    <img 
                        src={picture_path !== "" ? picture_path : "/public/default-blog.jpg"} 
                        className="card-img-top h-100"
                        alt={title} 
                    />
                </Link>             

                <div className="card-body h-50">
                    <Link to={`/blog/${_id}`}>
                        <h3 className="card-title">{title}</h3>
                    </Link>
                    <p className="card-text fs-5">{text}</p>
                    <small className="card-text text-body-secondary position-absolute bottom-0 mb-2">{updatedAt.toString().split("T")[0]}</small>
                </div>
        </div>
    )
}

export default BigCard