import React from 'react';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import win from '../images/win.png';
import { LinkContainer } from "react-router-bootstrap";
import Button from 'react-bootstrap/Button';
import '../App.css';

const Success = ({ score }) => (
  <Container fluid>
    <Row className="customCenter fullHeight">
      <Col className="customCenter contentContainer">
        <Image src={win} rounded className="imageWin" fluid />
        <h3 className="gold">Congratulations!</h3>
        <h5 className="m-t-1">Your score: {score}/5</h5>
        <p>
          You are eligible to win exciting prizes through random draw.
          Winners will be announced through the official
          &nbsp;<a href="https://facebook.com/wisdomstudents" rel="noopener noreferrer" target="_blank">Facebook</a> and
          &nbsp;<a href="https://instagram.com/wisdomstudents" rel="noopener noreferrer" target="_blank">Instagram</a> accounts of Wisdom Students.
        </p>
        <LinkContainer to="/">
          <Button>Go home</Button>
        </LinkContainer>
      </Col>
    </Row>
  </Container>
)

export default Success;