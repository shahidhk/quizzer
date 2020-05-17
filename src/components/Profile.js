import React from "react";
import { useQuery, useMutation } from '@apollo/react-hooks';
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import { useHistory } from "react-router-dom";

import { GET_USER_DETAILS, UPDATE_USER_DETAILS } from '../graphql';
import { brand } from '../constants';

const Profile = () => {
  let history = useHistory();
  const { loading: queryLoading, error: queryError, data } = useQuery(
    GET_USER_DETAILS,
  );

  const [
    updateUser,
    { loading: mutationLoading },
  ] = useMutation(UPDATE_USER_DETAILS, {
    onCompleted: (data) => {
      if (data && data.users.returning.length > 0) {
        const user = data.users.returning[0];
        if (user.name != null && user.mobile != null && user.course_occupation != null && user.address != null) {
          alert("Profile updated! Let's go to questions!");
          window.setTimeout(()=>{history.push('')}, 1000);
        } else {
          alert('Please fill mobile number, name, address, course_occupation and class!');
        }
      }
    },
    onError: (error) => {
      console.error({updateProfileError: error})
      alert('Updating profile failed! Try again!')
    }
  });

  if (queryLoading) {
    return <div>Loading...</div>;
  }

  if (queryError) {
    console.error({queryError})
    return <div>Error! {queryError.message}</div>
  }

  let user;

  if (!(data && data.users && data.users.length > 0)) {
    user = {
      name: null,
      mobile: null,
      email: null,
      course_occupation: null,
      address: null
    };
  } else {
    user = data.users[0];
  }

  let userInput = {
    name: null,
    mobile: null,
    email: null,
    course_occupation: null,
    address: null
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUser({ variables: {
      mobile: userInput.mobile.value,
      name: userInput.name.value,
      email: userInput.email.value,
      course_occupation: userInput.course_occupation.value,
      address: userInput.address.value
    }})

  }

  return (
    <Container fluid>
      <Row className="customCenter fullHeight">
        <Col sm={12} lg={7} className="d-none d-lg-block">
          <Image src={brand.image_url} rounded className="image" fluid />
        </Col>
        <Col sm={12} lg={5} className="customCenter contentContainer">
          <Card>
            <Card.Header as="h4">Profile</Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>

                <Form.Group controlId="formGridName">
                  <Form.Label>Name</Form.Label>
                  <Form.Control ref={node => {userInput.name = node}} required name="name" defaultValue={user.name}/>
                </Form.Group>

                <Form.Group controlId="formGridMobile">
                  <Form.Label>Mobile</Form.Label>
                  <Form.Control ref={node => {userInput.mobile = node}} required name="mobile" defaultValue={user.mobile} />
                </Form.Group>

                <Form.Group controlId="formGridEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control ref={node => {userInput.email = node}} type="email" required name="email" defaultValue={user.email} />
                </Form.Group>

                <Form.Group controlId="formGridAddress">
                  <Form.Label>Place</Form.Label>
                  <Form.Control ref={node => {userInput.address= node}} required name="address" defaultValue={user.address}/>
                </Form.Group>

                <Form.Group controlId="formGridSchool">
                  <Form.Label>Course/Occupation</Form.Label>
                  <Form.Control ref={node => {userInput.course_occupation = node}} required name="course_occupation" defaultValue={user.course_occupation}/>
                </Form.Group>

                <Button variant="primary" type="submit">
                  {!mutationLoading && 'Save'}
                  {mutationLoading && 'Saving...'}
                </Button>
              </Form>

            </Card.Body>
            <Button variant="secondary" onClick={() => history.push('')}>
              Go to questions
            </Button>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
