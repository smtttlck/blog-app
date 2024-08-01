import { PiPencilLineBold as Logo, PiMagnifyingGlassBold as Search } from "react-icons/pi";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logout } from "../redux/features/user";
import { useRef } from "react";

const Navbar: React.FC = () => {

    const location = useLocation();
    const pagePath: string = location.pathname.split('/')[1];
    
    const navigate = useNavigate();

    const searchBarRef = useRef<HTMLInputElement>(null);

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
                            <Link to="/explore" className={`nav-link ${pagePath === "/explore" ? "active" : ""}`}>Explore</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/write" className={`nav-link ${pagePath === "write" ? "active" : ""}`}>Write</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/about" className={`nav-link ${pagePath === "/about" ? "active" : ""}`}>About</Link>
                        </li>
                    </ul>
                    <div className="search-bar input-group me-3">
                        <input 
                            ref={searchBarRef} type="text"
                            className="form-control"  placeholder="Search" 
                            aria-label="Search" aria-describedby="button-addon2" 
                        />
                        <button 
                            className="btn btn-outline-secondary" 
                            type="button" 
                            id="button-addon2"
                            onClick={() => navigate(`/explore?name=${searchBarRef.current?.value}`)}
                        >
                            <Search />
                        </button>
                    </div>
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