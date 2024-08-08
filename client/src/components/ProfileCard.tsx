import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import * as api from "../api/Api";
import { useParams } from "react-router-dom";
import Loading from "./Loading";

interface IProfileCardProps {
    username: string;
    picture_path: string;
    isFollow?: boolean;
    setIsFollow?: React.Dispatch<React.SetStateAction<boolean>>;
    counters: any;
}

const ProfileCard: React.FC<IProfileCardProps> = ({ username, picture_path, isFollow, setIsFollow, counters }) => {

    const user = useSelector((state: any) => state.user);

    const { id } = useParams<string>();

    const [followingCount, setFollowingCount] = useState<number>(0);

    useEffect(() => {
        setFollowingCount(counters.followingCounter);
    }, [counters.followingCounter])


    const handlerFollow = (): void => {
        api.fetchData(`${isFollow ? "delete" : "post"}Follow`, user.token, { followerUserId: user.id, followingUserId: id }, null)
            .then(() => {
                setFollowingCount((isFollow) ? followingCount - 1 : followingCount + 1);
                if (setIsFollow)
                    setIsFollow(!isFollow);
            });
    }

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
                                    onClick={() => handlerFollow()}
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