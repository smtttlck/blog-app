import IBlog from "../types/BlogTypes";
import BigCard from "./BigCard";
import Card from "./Card";

interface IListProps {
    title: string;
    cardType?: string;
    datas: IBlog[];
}

const List: React.FC<IListProps> = ({ title, cardType = "small", datas }) => {
    return (
        <div className="list">
            <h3>{title}</h3>
            <hr />

            <div className="cards d-flex flex-wrap justify-content-evenly">
                {datas.map((data: IBlog) =>
                    cardType === "big" ?
                        (<BigCard 
                            key={data._id}
                            _id={data._id}
                            authorId={data.authorId}
                            title={data.title}
                            text={data.text}
                            picture_path={data.picture_path}
                            createdAt={data.createdAt}
                            updatedAt={data.updatedAt}                        
                        />) :
                        (<Card
                            key={data._id}
                            _id={data._id}
                            authorId={data.authorId}
                            title={data.title}
                            text={data.text}
                            picture_path={data.picture_path}
                            createdAt={data.createdAt}
                            updatedAt={data.updatedAt}
                        />)
                )}
            </div>


        </div>
    )
}

export default List