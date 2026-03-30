import { ProfileBlogType } from "../types/ProfileTypes";

interface ITabListProps {
    blogType: ProfileBlogType;
    setBlogType: React.Dispatch<React.SetStateAction<ProfileBlogType>>;
}

const TabList: React.FC<ITabListProps> = ({ blogType, setBlogType }) => {

    const types: ProfileBlogType[] = ["blogs", "bookmarks", "comments"];

    return (
        <div className="tablist d-flex justify-content-center mt-3 mb-4">
            <ul className="list-group list-group-horizontal">
                {types.map((type) => (
                    <li
                        key={type}
                        className={`list-group-item w-auto list-group-item-action ${blogType === type ? "list-group-item-success" : ""}`}
                        onClick={() => setBlogType(type)}
                    >
                        {type.slice(0, 1).toUpperCase()+type.slice(1)}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default TabList