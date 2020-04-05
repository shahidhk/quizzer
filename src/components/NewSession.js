import React from "react";
import Button from "react-bootstrap/Button";
import { refreshSessionId } from '../localstorage';

const NewSession = () => {
  const clickHandler = () => {
    refreshSessionId();
    window.location = '/';
  };
  return <Button variant="info" size="sm" onClick={clickHandler}>Logout</Button>;
};

export default NewSession;
