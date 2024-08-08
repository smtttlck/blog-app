import { FaFacebook, FaTwitter, FaInstagram, FaGithub, FaLinkedin } from "react-icons/fa";

const Footer: React.FC = () => {
    return (
        <div className="footer d-flex flex-column align-items-center w-100 py-4">
            <section className="social-menu">
                <ul className="d-flex align-items-center w-50">
                    <li className="fs-3 mx-2">
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                            <FaFacebook />
                        </a>
                    </li>
                    <li className="fs-3 mx-2">
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                            <FaTwitter />
                        </a>
                    </li>
                    <li className="fs-3 mx-2">
                        <a href="https://www.instagram.com/smtttlck/" target="_blank" rel="noopener noreferrer">
                            <FaInstagram />
                        </a>
                    </li>
                    <li className="fs-3 mx-2">
                        <a href="https://github.com/smtttlck" target="_blank" rel="noopener noreferrer">
                            <FaGithub />
                        </a>
                    </li>
                    <li className="fs-3 mx-2">
                        <a href="https://www.linkedin.com/in/samet-tatl%C4%B1cak-b86278283/" target="_blank" rel="noopener noreferrer">
                            <FaLinkedin />
                        </a>
                    </li>
                </ul>
            </section>
            <section className="pages">
                <ul className="d-flex fs-5">
                    <li className="mx-2"><a href="/">Home</a></li>
                    <li className="mx-2"><a href="/explore">Explore</a></li>
                    <li className="mx-2"><a href="/write">Write</a></li>
                    <li className="mx-2"><a href="/about">About</a></li>
                </ul>
            </section>
            <div className="copyright">
                <p>&copy; 2024; Designed by <a href="https://github.com/smtttlck">smtttlck</a></p>
            </div>
        </div>
    )
}

export default Footer