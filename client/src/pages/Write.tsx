import Navbar from "../components/Navbar";
import CreateBlog from "../components/CreateBlog";
import Footer from "../components/Footer";
import useWritePage from "../hooks/useWritePage";

const Write = () => {
    const { authorId, token } = useWritePage();

    return (
        <main className="page">
            <Navbar />

            <div className="container">
                
                <CreateBlog 
                    authorId={authorId}
                    token={token}
                />

            </div>

            <Footer />

        </main>
    )
}

export default Write