import IBlog from "../types/BlogTypes";
import Card from "./Card";

interface IListProps {
    title: string;
    datas: IBlog[];
}

const List: React.FC<IListProps> = ({ title, datas }) => {
    console.log(title, datas); // sil
    return (
        <div className="list">
            <h3>{title}</h3>
            <hr />
            <div className="cards d-flex flex-wrap justify-content-evenly">
                {datas.map((data: IBlog) => (
                    <Card 
                        key={data._id}
                        _id={data._id}
                        authorId={data.authorId}
                        title={data.title}
                        text={data.text}
                        picture_path={data.picture_path}
                        createdAt={data.createdAt}
                        updatedAt={data.updatedAt}
                    />
                ))}
            </div>
        </div>
    )
}

export default List