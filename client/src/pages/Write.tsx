import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";
import CreateBlog from "../components/CreateBlog";
import Footer from "../components/Footer";

const Write = () => {

    const user = useSelector((state: any) => state.user);

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