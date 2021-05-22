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
mutation updateCert(
  $userId: String!
  $mobile: String!
) {
  update_qvp_certificate(
    where: {user_id: {_eq: $userId}}
    _set: {mobile: $mobile}
  ) {
    affected_rows
    returning {
      grade
    }
  }
}`;

const Certificate = () => {
  const nameRef = useRef()
  const placeRef = useRef()
  const mobileRef = useRef()
  const idRef = useRef()
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
        userId: idRef.current.value,
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
        context.font = '25pt Elmessiri, "Times New Roman", Times, serif';
        context.fillText(name, canvas.width * 0.5, canvas.height * 0.61);

        downloadBtnRef.current.href = canvas.toDataURL("image/jpeg");
        downloadBtnRef.current.download = `QVP Certificate ${name}.jpg`;
        downloadBtnRef.current.innerHTML = 'Download Certificate';
      };
      if (data.data.update_qvp_certificate.affected_rows !== 1) {
        downloadBtnRef.current.innerHTML = 'Error! Please check the User ID';
        return
      }
      var imageSrc = ''
      const grade = data.data.update_qvp_certificate.returning[0].grade
      if (grade === 0 ) {
        downloadBtnRef.current.innerHTML = 'Sorry! You are not eligible!';
      } else if (grade >= 1 && grade <= 29) {
        imageSrc = 'cert_1_29.jpg'
      } else if (grade >= 30 && grade <= 39) {
        imageSrc = 'cert_30_39.jpg'
      } else if (grade >= 40 && grade <=50) {
        imageSrc = 'cert_40_50.jpg'
      }

      img.src = imageSrc;
    }).catch(error => {
      downloadBtnRef.current.innerHTML = 'Error! Please try again!';

      console.error({ error })
    })
  }

  return (
    <Container fluid>
      <span style={{fontFamily: 'Elmessiri', display: 'none'}}>Placeholder to load font</span>
      <Row className="customCenter fullHeight">
        <Col sm={12} lg={4} >
          {/* <Im src="/logo.png" rounded style={{paddingBottom: '50px'}} fluid/>
          <br/> */}
          <h3>QVP Certificate</h3><br />
          <Form onSubmit={getCertificate}>
            <Form.Group as={Row} controlId="formPlaintextName">
              <Form.Label column sm="3">
                Name
              </Form.Label>
              <Col sm="9">
                <Form.Control ref={nameRef} type="text" required />
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="formPlaintextID">
              <Form.Label column sm="3">
                User ID
              </Form.Label>
              <Col sm="9">
                <Form.Control ref={idRef} type="text" required />
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
        <Col sm={12} lg={8} className="d-none d-lg-block customCenter contentContainer">
          <canvas ref={canvasRef} className="responsive"/>
        </Col>
      </Row>
    </Container >
  );
};

export default Certificate;
