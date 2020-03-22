import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import qberry from "../images/qberry.png"
import "../App.css";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";

const Question = () => (
  <Container fluid>
    <Row className="customCenter fullHeight">

      <Col xs={6} md={6}>
        <Image src={qberry} fluid />
      </Col>
      <Col className="customCenter contentContainer">
        <Card xs={6} lg={6}>
          <Card.Header as="h5">Question 1</Card.Header>
          <Card.Body>
            <Card.Title>Special title treatment</Card.Title>
          </Card.Body>
          <Form>
            <fieldset>
              <Form.Group as={Row} className="p-l-5">
                <Col className="alLeft">
                  <Form.Check
                    type="radio"
                    className="radioAtt"
                    label="first radio"
                    name="formHorizontalRadios"
                    id="formHorizontalRadios1"
                  />
                  <Form.Check
                    type="radio"
                    className="radioAtt"
                    label="second radio"
                    name="formHorizontalRadios"
                    id="formHorizontalRadios2"
                  />
                  <Form.Check
                    type="radio"
                    className="radioAtt"
                    label="third radio"
                    name="formHorizontalRadios"
                    id="formHorizontalRadios3"
                  />
                  <Form.Check
                    type="radio"
                    className="radioAtt"
                    label="fourth radio"
                    name="formHorizontalRadios"
                    id="formHorizontalRadios4"
                  />
                </Col>
              </Form.Group>
            </fieldset>
          </Form>
        </Card>
        
        <Button variant="primary" className="m-t-1">Enter</Button>
      </Col>
    </Row>
  </Container>
);

export default Question;
