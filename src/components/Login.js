import React from 'react';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import qberry from '../images/qberry.png';
import '../App.css';
import Button from "react-bootstrap/Button";

const Login = () => (
  <Container fluid>
    <Row className="customCenter fullHeight">
      <Col xs="12" lg="8" className="customCenter imgContainer">
        <Image src={qberry} rounded className="image" />
      </Col>
      <Col className="customCenter contentContainer">
        <h3 className="blue">Lorem ipsum</h3>
        <p>
          What does Lorem ipsum dolor mean Lorem ipsum dolor sit amet . The
          graphic and typographic operators know this well, in real- ity all the
          professions dealing with the universe of communi- cation have a stable
          relationship with these words, but what is it? Lorem ipsum is a dummy
          text without any sense.
        </p>
        <Button variant="primary">Enter</Button>
      </Col>
    </Row>
  </Container>
)

export default Login;