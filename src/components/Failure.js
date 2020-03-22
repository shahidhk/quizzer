import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import qberry from "../images/qberry.png";
import fail from "../images/fail.jpg";
import "../App.css";

const Failure = () => (
  <Container fluid>
    <Row className="customCenter fullHeight">
      {/* <Col xs="12" lg="8" className="customCenter imgContainer">
        <Image src={qberry} fluid className="image" />
      </Col> */}
      <Col className="customCenter contentContainer">
        <Image src={fail} rounded className="imageFail" />
        <h3 className="red" style={{ fontSize: 100 }}>SORRY!</h3>
        <h5 className="m-t-1">Your Score 4/5 </h5>
        <p>
          You are not eligible to win <span className="bold"> exclusive prizes* <br /> Try Next Time <br /></span> 10 Winners
          will be announced by 30th January 2020
        </p>
      </Col>
    </Row>
  </Container>
);

export default Failure;
