import React, { useState } from "react";
import { Redirect, useHistory, useLocation } from "react-router-dom";
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import '../App.css';
// import Button from "react-bootstrap/Button";
import { brand } from '../constants';
import { Card, Error , Form, Input, Button } from '../components/AuthForm';
import { useAuth } from "../context/auth";
import logo from '../images/logo.png';

const Login = () => {
  const [username , setUserName] = useState("");
  const [password, setPassword] = useState("");

  const { isAuthenticated, login, error } = useAuth();
  let history = useHistory();
  let location = useLocation();

  const { from } = location.state || { from: { pathname: "/" } };


  if (isAuthenticated) {
    return <Redirect to={from} />;
  }

  const postLogin = () => {
    login(username, password)
  }


  return (
    <Container fluid>
      <Row className="customCenter fullHeight">
        <Col xs="12" lg="8" className="customCenter imgContainer">
          <Image src={logo} rounded className="image" />
        </Col>
        <Col className="customCenter contentContainer">
          <h3 className="blue">Login</h3>
          <Card>
            <Form>
              <Input
                type="username" value={username}
                onChange={e => {
                  setUserName(e.target.value);
                }}
                placeholder="email"
              />
              <Input
                type="password"
                value={password}
                onChange={e => {
                  setPassword(e.target.value);
                }}
                placeholder="password"
              />
              <Button onClick={postLogin}>Sign In</Button>
            </Form>
            { error &&<Error>{JSON.stringify(error)}</Error> }
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default Login;