import React from 'react';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import done from '../images/done.png';
import '../App.css';
import { brand } from '../constants';

const Neutral = ({score, max, name, showScore}) => (
  <Container fluid>
    <Row className="customCenter fullHeight">
      <Col className="customCenter contentContainer">
        <Image src={done} rounded className="imageDone" fluid />
        { showScore && <h5 className="m-t-1">Your score: {score}/{max}</h5> }
        <p dangerouslySetInnerHTML={{ __html: brand.neutral_text}}></p>
      </Col>
    </Row>
  </Container>
)

export default Neutral;
