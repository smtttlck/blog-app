import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";
import * as api from "../api/Api";
import IBlog from "../types/BlogTypes";
import List from "../components/List";
import Footer from "../components/Footer";

const User = () => {

    const user = useSelector((state: any) => state.user);

    const { id } = useParams<string>();

    const [count, setCount] = useState<number>();
    const [blogs, setBlogs] = useState<IBlog[] | null>(null);

    useEffect(() => {
        api.fetchData(`getBlog/count/${id}`, user.token, null, null)
            .then(data => setCount(data));

        api.fetchData(`getBlog/`, user.token, null, `?authorId=${id}&limit=${count}`)
            .then(data => setBlogs(data));

    }, [id])



    return (
        <main className="page">
            <Navbar />

            <div className="container">
                {(blogs && typeof blogs?.[0]?.authorId !== "string") &&
                    <div className="big-profile-picture text-center mt-3">
                        <img src={(blogs[0].authorId.picture_path && blogs[0].authorId.picture_path !== "") ? 
                            `http://localhost:3001/${blogs[0].authorId.picture_path.split("public\\")[1].split("\\").join('/')}` : 
                            "/public/default-user.png"} 
                        />
                        <h3>{`${count} Stories By ${blogs[0].authorId.username}`}</h3>
                    </div>
                }

                <hr />

                {blogs &&
                    <List
                        cardType="big"
                        datas={blogs}
                    />
                }

            </div>

            <Footer />

        </main >
    )
}

export default User