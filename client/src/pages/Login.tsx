import { useEffect } from "react"
import Form from "../components/Form"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom";

const Login = () => {

  const navigate = useNavigate();

  const user = useSelector((state: any) => state.user);

  useEffect(() => {
    if(user.id !== "")
      navigate("/");
  }, [])


  return (
    <main className="page d-flex justify-content-center">
      <Form />
    </main>
  )
}

export default Login