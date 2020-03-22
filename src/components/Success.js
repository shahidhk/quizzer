import React from 'react';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import qberry from '../images/qberry.png';
import '../App.css';

const Success = () => (
  <Container fluid >
    <Row  className="customCenter fullHeight">
      <Col xs={6} className="customCenter">
        <Image src={qberry} rounded />
      </Col >
      <Col className="customCenter">
        Success
      </Col>
    </Row>
  </Container>
)

export default Success;