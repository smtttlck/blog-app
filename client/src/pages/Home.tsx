import Navbar from "../components/Navbar";
import List from "../components/List";
import Footer from "../components/Footer";
import Modal from "../components/Modal";
import useHomePage from "../hooks/useHomePage";
import useAppSelector from "../hooks/useAppSelector";

const Home = () => {

    const user = useAppSelector((state) => state.user);
    
    const {
        isNewUser,
        newPosts,
        topPosts,
        isFetchingNewPosts,
        isFetchingTopPosts,
    } = useHomePage({
        token: user.token,
        userId: user.id,
    });

    return (
        <main className="page"> 
            <Navbar />

            {isNewUser && 
                <Modal
                    id={user.id}
                    token={user.token}
                    option="newUser"
                />
            }

            <div className="container">
                <div className="page-header my-5">
                    <h1 className="text-center">Welcome to the World of Blogging!</h1>
                    <p className="mt-3">Hello and welcome to the world of blogging! Here, you will find inspiring stories,
                        creative ideas, and tips that will add color to your life. Our goal is to offer you small escapes
                        from the hustle and bustle of daily life and ensure you learn something new every day. With our
                        articles in various categories, you can find content that suits you and discover new perspectives.
                        From travel to technology, health to personal development, we aim to touch the lives of our dear
                        readers with the wide range of articles we prepare. We wish you enjoyable reading!
                    </p>
                </div>
                <List
                    title="Latest Published"
                    datas={newPosts}
                    targetUrl="/explore?sort=createdAt"
                    isFetching={isFetchingNewPosts}
                />

                <List
                    title="Most Bookmarked"
                    datas={topPosts}
                    targetUrl="/explore?sort=bookmarkCounter"
                    isFetching={isFetchingTopPosts}
                />

            </div>

            <Footer />

        </main>
    )
}

export default Home