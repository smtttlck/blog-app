import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import List from "../components/List";
import Footer from "../components/Footer";
import ProfileCard from "../components/ProfileCard";
import useUserPage from "../hooks/useUserPage";
import useAppSelector from "../hooks/useAppSelector";

const User = () => {

    const user = useAppSelector((state) => state.user);

    const { id } = useParams<string>();
    const {
        blogs,
        counters,
        isFetching,
        isFollow,
        loaderRef,
        setIsFollow,
        userInfo,
    } = useUserPage({
        token: user.token,
        currentUserId: user.id,
        profileUserId: id,
    });

    return (
        <main className="page">
            <Navbar />

            <div className="container">

                <ProfileCard
                    username={userInfo.username}
                    picture_path={userInfo.picture_path}
                    isFollow={isFollow}
                    setIsFollow={setIsFollow}
                    counters={counters}
                />

                <hr />

                {blogs &&
                    <>
                        <List
                            cardType="big"
                            datas={blogs}
                            isFetching={isFetching}
                        />
                        <div ref={loaderRef} />
                    </>
                }

            </div>

            <Footer />

        </main >
    )
}

export default User