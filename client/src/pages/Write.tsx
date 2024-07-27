import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";
import CreateBlog from "../components/CreateBlog";
import Footer from "../components/Footer";

const Write = () => {

    const navigate = useNavigate();

    const user = useSelector((state: any) => state.user);

    useEffect(() => {
        if (user.id === "")
            navigate("/login");
    }, [user])    


    return (
        <main className="page">
            <Navbar />

            <div className="container">
                
                <CreateBlog 
                    authorId={user.id}
                    token={user.token}
                />

            </div>

            <Footer />

        </main>
    )
}

export default Write