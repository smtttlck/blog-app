import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";
import List from "../components/List";
import IBlog from "../types/BlogTypes";
import * as api from "../api/Api";
import Footer from "../components/Footer";
import Modal from "../components/Modal";

const Home = () => {

    const user = useSelector((state: any) => state.user);

    const [isNewUser, setIsNewUser] = useState<boolean>(false);
    const [newPosts, setNewPosts] = useState<IBlog[]>([]);
    const [topPosts, setTopPosts] = useState<IBlog[]>([]);

    useEffect(() => {
        document.title = "Blog App";

        if(localStorage.getItem("newUser")) {
            setIsNewUser(true);
            localStorage.removeItem("newUser");
        }

        // Latest Published
        api.fetchData("getBlog", user.token, null, `?sort=createdAt&sortType=DESC&limit=6&userId=${user.id}`)
            .then(data => setNewPosts(data));

        // Most Bookmarked
        api.fetchData("getBlog", user.token, null, `?sort=bookmarkCounter&sortType=DESC&limit=6&userId=${user.id}`)
            .then(data => setTopPosts(data));
    }, [])

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
                    isFetching={true}
                />

                <List
                    title="Most Bookmarked"
                    datas={topPosts}
                    targetUrl="/explore?sort=bookmarkCounter"
                    isFetching={true}
                />

            </div>

            <Footer />

        </main>
    )
}

export default Home