import { useSelector } from "react-redux";
import IBlog from "../types/BlogTypes";
import Card from "./Card";
import Loading from "./Loading";

interface IListProps {
    title?: string;
    cardType?: string;
    datas: IBlog[];
}

const List: React.FC<IListProps> = ({ title, cardType = "small", datas }) => {

    const user = useSelector((state: any) => state.user);

    return (
        <div className="list">

            {title &&
                <>
                    <h3>{title}</h3>
                    <hr />
                </>
            }

            <div className={`${cardType === "big" ? "bigCards" : "cards"} d-flex flex-wrap justify-content-evenly`}>
                {datas.length > 0 ?
                    datas.map((data: IBlog) =>
                        <Card
                            key={data._id}
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