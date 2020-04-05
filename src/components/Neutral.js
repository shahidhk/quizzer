import React from 'react';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import done from '../images/done.png';
import { LinkContainer } from "react-router-bootstrap";
import Button from 'react-bootstrap/Button';
import '../App.css';
import { brand } from '../constants';

const Neutral = () => (
  <Container fluid>
    <Row className="customCenter fullHeight">
      <Col className="customCenter contentContainer">
        <Image src={done} rounded className="imageDone" fluid />
        <p dangerouslySetInnerHTML={{ __html: brand.neutral_text}}></p>
        <LinkContainer to="/">
          <Button>Go home</Button>
        </LinkContainer>
      </Col>
    </Row>
  </Container>
)

export default Neutral;
