import Form from "../components/Form"
import useLoginPage from "../hooks/useLoginPage";

const Login = () => {
  useLoginPage();

  return (
    <main className="login d-flex justify-content-center">
      <Form />
    </main>
  )
}

export default Login