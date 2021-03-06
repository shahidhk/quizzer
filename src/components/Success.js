import React from 'react';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import win from '../images/win.png';
import { LinkContainer } from "react-router-bootstrap";
import Button from 'react-bootstrap/Button';
import '../App.css';
import { brand } from '../constants';

const Success = ({ score, max }) => (
  <Container fluid>
    <Row className="customCenter fullHeight">
      <Col className="customCenter contentContainer">
        <Image src={win} rounded className="imageWin" fluid />
        <h3 className="gold">Congratulations!</h3>
        <h5 className="m-t-1">Your score: {score}/{max}</h5>
        <p dangerouslySetInnerHTML={{ __html: brand.win_text}}></p>
        <LinkContainer to="/">
          <Button>Go home</Button>
        </LinkContainer>
      </Col>
    </Row>
  </Container>
)

export default Success;
