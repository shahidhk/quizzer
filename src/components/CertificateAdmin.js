import React, { useRef } from "react";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";

const CertificateAdmin = () => {
  const nameRef = useRef()
  const typeRef = useRef()
  const passwordRef = useRef()
  const canvasRef = useRef()
  const downloadBtnRef = useRef()
  const submitBtnRef = useRef()

  const imgProps = {
    second_class: {
      url: '/cert_1_29.jpg',
      x: 0.5,
      y: 0.61
    },
    first_class: {
      url: '/cert_30_39.jpg',
      x: 0.5,
      y: 0.61
    },
    distinction: {
      url: '/cert_40_50.jpg',
      x: 0.5,
      y: 0.61
    },
  }

  const getCertificate = (e) => {
    e.preventDefault()
    const ct = typeRef.current.value;
    if (passwordRef.current.value === 'saltmangotree') {
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
        context.fillText(name, canvas.width * imgProps[ct].x , canvas.height * imgProps[ct].y);

        downloadBtnRef.current.href = canvas.toDataURL("image/jpeg");
        downloadBtnRef.current.download = `QVP ${ct} certificate ${name}.jpg`;
        downloadBtnRef.current.innerHTML = 'Download Certificate';
      };
      img.src = imgProps[ct].url;
    } else {
      alert('invalid password')
    }

  }

  return (
    <Container fluid>
      <Row className="customCenter fullHeight">
        <Col sm={12} lg={5} >
          <h2>QVP Certificate Admin</h2>
          <br/>
          <Form onSubmit={getCertificate}>
            <Form.Group as={Row} controlId="formPlaintextPass">
              <Form.Label column sm="3">
                Password
              </Form.Label>
              <Col sm="9">
                <Form.Control ref={passwordRef} type="password" required />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="formGridType">
              <Form.Label column sm="3">Type</Form.Label>
              <Col sm="9">
                <Form.Control ref={typeRef} required name="type" defaultValue="second_class" as="select">
                  <option key={0} value="first_class">First Class</option>
                  <option key={1} value="second_class">Second Class</option>
                  <option key={2} value="distinction">Distinction</option>
                </Form.Control>
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="formPlaintextName">
              <Form.Label column sm="3">
                Name
              </Form.Label>
              <Col sm="9">
                <Form.Control ref={nameRef} type="text" required />
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

export default CertificateAdmin;
