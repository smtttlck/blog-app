import { useEffect, useState } from "react";
import * as followService from "../services/followService";

interface IUseProfileCardParams {
    token: string;
    currentUserId: string;
    targetUserId?: string;
    isFollow?: boolean;
    setIsFollow?: React.Dispatch<React.SetStateAction<boolean>>;
    followingCounter: number;
}

const useProfileCard = ({
    currentUserId,
    followingCounter,
    isFollow,
    setIsFollow,
    targetUserId,
    token,
}: IUseProfileCardParams) => {

    // state variable to keep track of the number of followers the target user has
    const [followingCount, setFollowingCount] = useState<number>(0);

    // update the following count whenever the followingCounter prop changes
    useEffect(() => {
        setFollowingCount(followingCounter);
    }, [followingCounter]);

    // function to handle follow/unfollow action, which toggles the follow status and updates the following count accordingly
    const handleFollow = () => {
        if (!targetUserId || isFollow === undefined) {
            return;
        }

        followService.toggleFollow(token, currentUserId, targetUserId, isFollow)
            .then(() => {
                setFollowingCount((prevCount) => (isFollow ? prevCount - 1 : prevCount + 1));

                if (setIsFollow) {
                    setIsFollow(!isFollow);
                }
            });
    };

    return {
        followingCount,
        handleFollow,
    };
};

export default useProfileCard;