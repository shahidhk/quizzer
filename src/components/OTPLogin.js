import React, { useState } from "react";
import { Redirect, useLocation } from "react-router-dom";
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import '../App.css';
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Card } from '../components/AuthForm';
import { useAuth } from "../context/auth";
import logo from '../images/logo.png';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'

const OTPLogin = () => {
  const [otp , setOtp] = useState("");
  const [phone, setPhone] = useState();
  const [message, setMessage] = useState();
  const [enterOTPHidden, setEnterOTPHidden] = useState(true);
  const [verifyOTPHidden, setVerifyOTPHidden] = useState(true)
  const [requestOTPHidden, setRequestOTPHidden] = useState(false)

  const { isAuthenticated, error, requestOTP, verifyOTP, loading } = useAuth();
  let location = useLocation();

  const { from } = location.state || { from: { pathname: "/" } };


  if (isAuthenticated) {
    return <Redirect to={from} />;
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
          <h5 className="blue">Login with your number registered at <a rel="noopener noreferrer" href="https://profcon.in/registration/#/" target="_blank">profcon.in</a></h5>
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
                    min="0000"
                    max="9999"
                    onChange={e=> {
                      setOtp(e.target.value)
                    }}
                  />
                </Col>  
              </Form.Group>


              <Button hidden={requestOTPHidden} onClick={sendOTP}>{loading ? 'Requesting OTP...' : 'Request OTP'}</Button>
              <Button hidden={verifyOTPHidden} onClick={checkOTP}>{loading ? 'Verifying OTP...' : 'Verify OTP'}</Button>
            </Form>
            <br/>
            { error &&<div className="red">{error}</div> }
          </Card>
          <br/>

          {/* <h6>Register at <a href="https://profcon.in/registration/#/" target="_blank">profcon.in</a> to participate</h6> */}

        </Col>
      </Row>
    </Container>
  )
}

export default OTPLogin;