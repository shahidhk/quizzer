import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import fail from "../images/fail.jpg";
import { LinkContainer } from "react-router-bootstrap";
import Button from 'react-bootstrap/Button';
import "../App.css";

const Failure = ({ score }) => (
  <Container fluid>
    <Row className="customCenter fullHeight">
      <Col className="customCenter contentContainer">
        <Image src={fail} rounded className="imageFail" fluid />
        <h3 className="red">Sorry!</h3>
        <h5 className="m-t-1">Your score: {score}/5</h5>
        <p>
          You are not eligible for prizes. Try again next time?
          </p>
        <LinkContainer to="/">
          <Button>Go home</Button>
        </LinkContainer>
      </Col>
    </Row>
  </Container>
);

export default Failure;
