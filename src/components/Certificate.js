import React, { useRef } from "react";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import { gql } from "apollo-boost";
import { useApolloClient } from '@apollo/react-hooks';

const GET_WINNER = gql`
  query getWinnerDetails($mobile: String!) {
 		winner(where: {mobile: {_ilike: $mobile}}) {
      mobile
      name
      place
    }
  }
`;

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
    const mobile = mobileRef.current.value
    client.query({
      query: GET_WINNER,
      variables: {
        mobile: `%${mobile.substr(mobile.length - 8)}`
      },
      fetchPolicy: 'network-only'
    }).then( data => {
      if (data.data.winner.length === 1) {
        // we have an item
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
          context.font = '35pt "Times New Roman", Times, serif';
          context.fillText(name, canvas.width * 0.35, canvas.height * 0.57);

          downloadBtnRef.current.href = canvas.toDataURL("image/jpeg");
          downloadBtnRef.current.download = `Quran Time Certificate ${name}.jpg`;
          downloadBtnRef.current.innerHTML = 'Download Certificate';
        };
        img.src = '/quran_quiz_certificate.jpg';

      } else {
        alert('not found')
      }
    }).catch( error => {
      console.error({ error })
    })
  }

  return (
    <Container fluid>
      <Row className="customCenter fullHeight">
        <Col sm={12} lg={5} >
          <h2>Quran Time Quiz Certificate</h2>
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
