import { useParams } from "react-router-dom";
import Loading from "./Loading";
import { IProfileCounters } from "../types/ProfileTypes";
import useProfileCard from "../hooks/useProfileCard";
import useAppSelector from "../hooks/useAppSelector";

interface IProfileCardProps {
    username: string;
    picture_path: string;
    isFollow?: boolean;
    setIsFollow?: React.Dispatch<React.SetStateAction<boolean>>;
    counters: IProfileCounters;
}

const ProfileCard: React.FC<IProfileCardProps> = ({ username, picture_path, isFollow, setIsFollow, counters }) => {
    const user = useAppSelector((state) => state.user);

    const { id } = useParams<string>();
    const { followingCount, handleFollow } = useProfileCard({
        token: user.token,
        currentUserId: user.id,
        targetUserId: id,
        isFollow,
        setIsFollow,
        followingCounter: counters.followingCounter,
    });

    return (
        <div className="profile-card fs-5 d-flex justify-content-center">
            {(username) ? (
                <>
                    <div className="big-profile-picture mt-3">
                        <img src={(picture_path && picture_path !== "") ? picture_path : "/public/default-user.png"} />
                    </div>
                    <div className="profile-info m-3">
                        <div className="info-header d-flex">
                            <h3 className="username">{username}</h3>
                            {(username !== user.username) && (
                                <button
                                    className="follow-button btn ms-2"
                                    onClick={handleFollow}
                                >
                                    {isFollow ? "Unfollow" : "Follow"}
                                </button>
                            )}
                        </div>
                        <div className="profile-counters d-flex justify-content-center mt-2">
                            <p className="blog-count"><b>{counters.blogCounter}</b> Blog</p>
                            <p className="follower-count mx-3"><b>{followingCount}</b> Follower</p>
                            <p className="following-count"><b>{counters.followerCounter}</b> Following</p>
                        </div>
                    </div>
                </>
            ) : <Loading />
            }
        </div>
    )
}

export default ProfileCard