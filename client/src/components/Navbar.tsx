import { PiPencilLineBold as Logo } from "react-icons/pi";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { logout } from "../redux/features/user";

const Navbar: React.FC = () => {

    const location = useLocation();
    const pagePath: string = location.pathname.split('/')[1];

    const user = useSelector((state: any) => state.user);
    const dispatch = useDispatch();

    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary w-100">
            <div className="container-fluid">
                <span className="logo">
                    <Link to="/"><Logo /></Link>
                </span>
                <button
                    className="navbar-toggler" type="button"
                    data-bs-toggle="collapse" data-bs-target="#navbarText"
                    aria-controls="navbarText" aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarText">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link to="/" className={`nav-link ${(pagePath === "/" || pagePath === "") ? "active" : ""}`}>Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/write" className={`nav-link ${pagePath === "write" ? "active" : ""}`}>Write</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/about" className={`nav-link ${pagePath === "/about" ? "active" : ""}`}>About</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/profile" className={`nav-link ${pagePath === "/profile" ? "active" : ""}`}>Profile</Link>
                        </li>

                    </ul>
                    <span className="dropdown">
                        <span className="profile-button" data-bs-toggle="dropdown" aria-expanded="false">
                            <span className="profile-picture">
                                <img src={user.picture_path !== "" ? user.picture_path : "/public/default-user.png"} />
                            </span>
                        </span>
                        <ul className="dropdown-menu">
                            <li className="nav-item">
                                <Link to="/profile" className="dropdown-item">My Profile</Link>
                            </li>
                            <li
                                className="nav-item"
                                onClick={() => dispatch(logout())}
                            >
                                <Link to="/login" className="dropdown-item">Log out</Link>
                            </li>
                        </ul>
                    </span>
                </div>
            </div>
        </nav>
    )
}

export default Navbar