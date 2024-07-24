import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";
import List from "../components/List";
import IBlog from "../types/BlogTypes";
import * as api from "../api/Api";

const Home = () => {

    const navigate = useNavigate();

    const user = useSelector((state: any) => state.user);

    const [newPosts, setNewPosts] = useState<IBlog[]>([]);
    const [topPosts, setTopPosts] = useState<IBlog[]>([]);

    useEffect(() => {
        if (user.id === "")
            navigate("/login");
    }, [user])

    useEffect(() => {
        // Latest Published
        api.fetchData("getBlog", user.token, null, "?sort=createdAt&sortType=DESC&limit=6")
            .then(data => setNewPosts(data));

        // Most Bookmarked
        api.fetchData("getBlog", user.token, null, "?limit=6")
            .then(data => setTopPosts(data)); // sonra bunu ayarla
    }, [])

    return (
        <main className="page">
            <Navbar />

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
                />

                <List
                    title="Most Bookmarked"
                    datas={topPosts}
                />

            </div>



        </main>
    )
}

export default Home