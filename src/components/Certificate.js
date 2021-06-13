import React, { useRef } from "react";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
// import {Image as Im} from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";


const Certificate = () => {
  const nameRef = useRef()

  const canvasRef = useRef()
  const downloadBtnRef = useRef()
  const submitBtnRef = useRef()


  const getCertificate = (e) => {
    e.preventDefault()

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
      context.font = '35pt Arizonia, "Times New Roman", Times, serif';
      context.fillText(name, canvas.width * 0.53, canvas.height * 0.5);

      downloadBtnRef.current.href = canvas.toDataURL("image/jpeg");
      downloadBtnRef.current.download = `Summerise 2021 Certificate ${name}.jpg`;
      downloadBtnRef.current.innerHTML = 'Download Certificate';
    };

    img.src = 'certificate.jpg';

  }

  return (
    <Container fluid>
      <span style={{fontFamily: 'Elmessiri', display: 'none'}}>Placeholder to load font</span>
      <Row className="customCenter fullHeight">
        <Col sm={12} lg={4} >
          {/* <Im src="/logo.png" rounded style={{paddingBottom: '50px'}} fluid/>
          <br/> */}
          <h3>Summerise Certificate</h3><br />
          <Form onSubmit={getCertificate}>
            <Form.Group as={Row} controlId="formPlaintextName">
              <Form.Label column sm="3">
                Name
              </Form.Label>
              <Col sm="9">
                <Form.Control ref={nameRef} type="text" required onChange={getCertificate}/>
              </Col>
            </Form.Group>
            
            <Button type="submit" ref={submitBtnRef} hidden>Get certificate</Button>
          </Form>
          <br/> <br/><a href="#" ref={downloadBtnRef} className="btn btn-light">Download Certificate</a> <br/> <br/>
        </Col>
        <Col sm={12} lg={8} className="d-none d-lg-block customCenter contentContainer" width="1500px">
          <canvas ref={canvasRef} className="responsive"/>
        </Col>
      </Row>
    </Container >
  );
};

export default Certificate;