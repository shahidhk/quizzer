import React from 'react';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import win from '../images/win.png';
import '../App.css';

const Success = () => (
  <Container fluid>
    <Row className="customCenter fullHeight">
      {/* <Col xs="12" lg="8" className="customCenter imgContainer">
        <Image src={qberry} fluid className="image" />
      </Col> */}
      <Col className="customCenter contentContainer">
        <Image src={win} rounded className="imageWin" />
        <h5 className="m-t-1">Your Score 5/5 </h5>
        <h3 className="gold">Congratulations..!</h3>
        <p>
          You are eligible to win <span className="bold">exclusive prizes* </span>
          10 Winners will be announced by
          30th January 2020
        </p>
      </Col>
    </Row>
  </Container>
)

export default Success;