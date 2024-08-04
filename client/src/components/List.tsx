import { useSelector } from "react-redux";
import IBlog from "../types/BlogTypes";
import Card from "./Card";
import Loading from "./Loading";
import { useNavigate } from "react-router-dom";

interface IListProps {
    title?: string;
    cardType?: string;
    targetUrl?: string;
    datas: IBlog[];
}

const List: React.FC<IListProps> = ({ title, cardType, targetUrl, datas }) => {

    const user = useSelector((state: any) => state.user);

    const navigate = useNavigate();

    return (
        <div className="list my-2">

            {(title && targetUrl) &&
                <>
                    <div className="list-header d-flex justify-content-between">
                        <h3>{title}</h3>
                        <button
                            className="btn btn-dark"
                            type="button"
                            onClick={() => navigate(targetUrl)}
                        >
                            Show More
                        </button>
                    </div>
                    <hr />
                </>
            }

            <div className={`${cardType === "big" ? "bigCards" : "cards"} d-flex flex-wrap justify-content-evenly`}>
                {datas.length > 0 ?
                    datas.map((data: IBlog, index: number) =>
                        <Card
                            key={`card-${index}`}
                            userId={user.id}
                            _id={data._id}
                            authorId={data.authorId}
                            title={data.title}
                            text={data.text}
                            picture_path={data.picture_path}
                            createdAt={data.createdAt}
                            updatedAt={data.updatedAt}
                            isBookmarked={data.isBookmarked}
                            commentCounter={data.commentCounter}
                        />
                    ) : <Loading />
                }
            </div>


        </div>
    )
}

export default List