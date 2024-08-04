import { useSelector } from "react-redux";

interface IProfileCardProps {
    username: string;
    picture_path: string;
    counters: any;
}

const ProfileCard: React.FC<IProfileCardProps> = ({ username, picture_path, counters }) => {

    const user = useSelector((state: any) => state.user);

    return (
        <div className="profile-card text-center fs-5">
            <div className="big-profile-picture mt-3">
                <img src={picture_path} />
            </div>
            <h3>{username}</h3>
            <div className="profile-info d-flex justify-content-center my-2">
                <p className="blog-count">{counters.blogCounter} Blog</p>            
                <p className="follower-count mx-5">{counters.followerCounter} Follower</p>            
                <p className="following-count">{counters.followingCounter} Following</p>            
            </div>

        </div>
    )
}

export default ProfileCard