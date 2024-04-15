import Header from "@/components/Header";
import "../styles/custom.scss";
import LoginForm from "@/components/LoginForm";
import { Container } from "react-bootstrap";

const Auth = () => {
  return (
    <div>
      <Header />
      <Container className="my-4">
        <h2 className="text-center">Welcome to MemoBoard</h2>
        <h3 className="text-center mb-4">To get started, please sign in</h3>
        <LoginForm />
      </Container>
    </div>
  );
};

export default Auth;
