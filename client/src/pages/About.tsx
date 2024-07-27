import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";
import AboutUs from "../components/AboutUs";
import Footer from "../components/Footer";

const About = () => {

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

                <AboutUs />

            </div>

            <Footer />

        </main>
    )
}

export default About