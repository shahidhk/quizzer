import React, { useState } from "react";
import { Redirect, useHistory, useLocation } from "react-router-dom";
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import '../App.css';
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { brand } from '../constants';
import { Card, Error } from '../components/AuthForm';
import { useAuth } from "../context/auth";
import logo from '../images/logo.png';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'

const OTPLogin = () => {
  const [otp , setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [country, setCountry] = useState("");
  const [phone, setPhone] = useState();
  const [message, setMessage] = useState();
  const [enterOTPHidden, setEnterOTPHidden] = useState(true);
  const [verifyOTPHidden, setVerifyOTPHidden] = useState(true)
  const [requestOTPHidden, setRequestOTPHidden] = useState(false)

  const { isAuthenticated, login, error, requestOTP, verifyOTP } = useAuth();
  let history = useHistory();
  let location = useLocation();

  const { from } = location.state || { from: { pathname: "/" } };


  if (isAuthenticated) {
    return <Redirect to={from} />;
  }

  const postLogin = () => {
    // login(username, password)
  }
  const checkOTP = () => {
    verifyOTP('+'+phone, otp)
  }

  const sendOTP = async () => {
    // make api call
    const resp = await requestOTP('+'+phone);
    if (resp) {
      setRequestOTPHidden(true)
      setVerifyOTPHidden(false)
      setEnterOTPHidden(false)
      
      console.log({phone})
      setMessage(resp.message)
  
      // if (phone.startsWith('91')) {
      //   setMessage('OTP has been sent to your phone by SMS')
      // } else {
      //   setMessage('OTP has been sent to your email')
      // }
    }
    
  }

  
  return (
    <Container fluid>
      <Row className="customCenter fullHeight">
        <Col lg="8" className="customCenter imgContainer d-none d-md-block">
          <Image src={logo} rounded className="image" />
        </Col>
        <Col className="customCenter contentContainer">
          <h3 className="blue">Login</h3>
          <Card>
            <Form>
              
              <Form.Group as={Row}>
                {/* <Form.Label column sm={2}>Mobile number</Form.Label> */}
                <Col >
                  <PhoneInput
                    placeholder="Mobile number"
                    value={phone}
                    onChange={setPhone}
                    autoFormat={false}
                    preferredCountries={['in']}
                  />
                </Col>  
              </Form.Group>

              {message && <div>{message}</div>}


              <Form.Group as={Row} hidden={enterOTPHidden}>
                {/* <Form.Label column sm={2}>Enter OTP</Form.Label> */}
                <Col sm={{ size: 'auto', offset: 1 }}>
                  <Form.Control
                    placeholder="Enter OTP"
                    required
                    name="otp"
                    type="number"
                    onChange={e=> {
                      setOtp(e.target.value)
                    }}
                  />
                </Col>  
              </Form.Group>


              <Button hidden={requestOTPHidden} onClick={sendOTP}>Request OTP</Button>
              <Button hidden={verifyOTPHidden} onClick={checkOTP}>Verify OTP</Button>
            </Form>
            { error &&<Error>{JSON.stringify(error)}</Error> }
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default OTPLogin;