import { useEffect, useState } from "react"
import IUser from "../types/UserTypes"
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Home = () => {

    const navigate = useNavigate();

    const [user, setUser] = useState<IUser | null>(null)

    interface IToken {
        user: IUser;
        exp: number;
      }

    useEffect(() => {
        if (!localStorage.getItem("authToken"))
            navigate("/login");
        else {
            if(!localStorage.getItem("user")){
                const token = jwtDecode<IToken>(localStorage.getItem("authToken") as string);
                localStorage.setItem("user", JSON.stringify(token.user));
            }
            setUser(JSON.parse(localStorage.getItem("user") as string));
        }
              
    }, [])


    return (
        <div>
            <h1>HOME</h1>
            {user?.username}
        </div>
    )
}

export default Home