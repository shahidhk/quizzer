import React, { useRef } from "react";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {Image as Im} from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import { gql } from "apollo-boost";
import { useApolloClient } from '@apollo/react-hooks';

const INSERT_PARTICIPANT = gql`
mutation insertParticipant(
  $name: String!
  $place: String!
  $mobile: String!
) {
  insert_paricipation_cert(objects:{
    mobile: $mobile
    place: $place
    name: $name 
  }) {
    affected_rows
  }
}`;

const Certificate = () => {
  const nameRef = useRef()
  const placeRef = useRef()
  const mobileRef = useRef()
  const canvasRef = useRef()
  const downloadBtnRef = useRef()
  const submitBtnRef = useRef()

  const client = useApolloClient();

  const getCertificate = (e) => {
    e.preventDefault()
    client.mutate({
      mutation: INSERT_PARTICIPANT,
      variables: {
        mobile: mobileRef.current.value,
        name: nameRef.current.value,
        place: placeRef.current.value,
      },
    }).then(data => {
      const name = nameRef.current.value;
      submitBtnRef.current.classList.add("btn-light")
      downloadBtnRef.current.classList.remove('btn-light')
      downloadBtnRef.current.classList.add('btn-success')
      downloadBtnRef.current.innerHTML = 'Generating Certificate...';
      let canvas = canvasRef.current;
      let context = canvas.getContext('2d');
      var img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0);
        context.fillStyle = "black";
        context.textBaseline = 'middle';
        context.textAlign = 'center';
        context.font = '35pt Elmessiri, "Times New Roman", Times, serif';
        context.fillText(name, canvas.width * 0.5, canvas.height * 0.53);

        downloadBtnRef.current.href = canvas.toDataURL("image/jpeg");
        downloadBtnRef.current.download = `Quran Time Participation Certificate ${name}.jpg`;
        downloadBtnRef.current.innerHTML = 'Download Certificate';
      };
      img.src = '/quran_quiz_participation_certificate.jpg';
    }).catch(error => {
      console.error({ error })
    })
  }

  return (
    <Container fluid>
      <span style={{fontFamily: 'Elmessiri', display: 'none'}}>Placeholder to load font</span>
      <Row className="customCenter fullHeight">
        <Col sm={12} lg={5} >
          <Im src="/logo.png" rounded style={{paddingBottom: '50px'}} fluid/>
          <br/>
          <Form onSubmit={getCertificate}>
            <Form.Group as={Row} controlId="formPlaintextName">
              <Form.Label column sm="3">
                Name
              </Form.Label>
              <Col sm="9">
                <Form.Control ref={nameRef} type="text" required />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="formPlaintextPlace">
              <Form.Label column sm="3">
                Place
              </Form.Label>
              <Col sm="9">
                <Form.Control ref={placeRef} type="text" required />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="formPlaintextMobile">
              <Form.Label column sm="3">
                Mobile no.
              </Form.Label>
              <Col sm="9" >
                <Form.Control ref={mobileRef} type="text" required/>
              </Col>
            </Form.Group>
            <Button type="submit" ref={submitBtnRef}>Get certificate</Button>
          </Form>
          <br/> <br/><a href="#" ref={downloadBtnRef} className="btn btn-light">Download Certificate</a> <br/> <br/>
        </Col>
        <Col sm={12} lg={7} className="d-none d-lg-block customCenter contentContainer">
          <canvas ref={canvasRef} className="responsive"/>
        </Col>
      </Row>
    </Container >
  );
};

export default Certificate;
