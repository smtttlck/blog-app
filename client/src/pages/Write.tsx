import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";
import CreateBlog from "../components/CreateBlog";

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

        </main>
    )
}

export default Write