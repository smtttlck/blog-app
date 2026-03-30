import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import List from "../components/List";
import TabList from "../components/TabList";
import ProfileCard from "../components/ProfileCard";
import useProfilePage from "../hooks/useProfilePage";
import useAppSelector from "../hooks/useAppSelector";

const Profile = () => {

    const user = useAppSelector((state) => state.user);
    const {
        blogType,
        blogs,
        counters,
        isFetching,
        loaderRef,
        setBlogType,
    } = useProfilePage({
        token: user.token,
        userId: user.id,
        username: user.username,
    });

    return (
        <main className="page">
            <Navbar />

            <div className="container">

                <ProfileCard
                    username={user.username}
                    picture_path={user.picture_path || ""}
                    counters={counters}
                />

                <TabList 
                    blogType={blogType} setBlogType={setBlogType}
                />

                <List
                    datas={blogs}
                    isFetching={isFetching}
                />
                <div ref={loaderRef} />

            </div>

            <Footer />

        </main >
    )
}

export default Profile