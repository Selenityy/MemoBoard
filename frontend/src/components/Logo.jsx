import Image from "next/image";
import { Row, Col } from "react-bootstrap";
import "../styles/main.scss";

const Logo = () => {
  return (
    <Row className="align-items-center gx-1 gx-sm-2">
      <Col xs="auto">
        <div className="logo-container">
          <Image
            src="/images/logo2.png"
            width={50}
            height={50}
            alt="Logo of MemoBoard"
            className="img-fluid "
          />
        </div>
      </Col>
      <Col>
        <h1 className="logo-title">MemoBoard</h1>
      </Col>
    </Row>
  );
};

export default Logo;
