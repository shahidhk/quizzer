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
import { dontHaveCompleteProfile } from './Home';

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
        if (!dontHaveCompleteProfile(user)) {
          alert("Profile updated! Let's go to questions!");
          window.setTimeout(()=>{history.push('')}, 1000);
        } else {
          alert('Please fill mobile number, name, address, school and class!');
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
      email: null,
      course: null,
      campus: null,
      residential_address: null,
      gender: null,
      campus_district: null,
      year: null,
      residential_district: null,
      whatsapp_number: null,
    };
  } else {
    user = data.users[0];
  }

  let userInput = {
    name: null,
    email: null,
    course: null,
    campus: null,
    residential_address: null,
    gender: null,
    campus_district: null,
    year: null,
    residential_district: null,
    whatsapp_number: null,
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUser({ variables: {
      id: user.id,
      name: userInput.name.value,
      email: userInput.email.value,
      course: userInput.course.value,
      campus: userInput.campus.value,
      residential_address: userInput.residential_address.value,
      gender: userInput.gender.value,
      campus_district: userInput.campus_district.value,
      year: userInput.year.value,
      residential_district: userInput.residential_address.value,
      whatsapp_number: userInput.whatsapp_number.value,
    }})

  }

  return (
    <Container fluid>
      <Row className="customCenter fullHeight">
        <Col sm={12} lg={5} className="d-none d-lg-block">
          <Image src={brand.image_url} rounded className="image" fluid />
        </Col>
        <Col sm={12} lg={7} className="customCenter contentContainer">
          <Card>
            <Card.Header as="h4">Profile</Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>

                <Form.Group controlId="formGridMobile">
                  <Form.Label>Mobile</Form.Label>
                  <Form.Control disabled required name="mobile" defaultValue={user.mobile}/>
                </Form.Group>

                <Form.Group controlId="formGridName">
                  <Form.Label>Name</Form.Label>
                  <Form.Control ref={node => {userInput.name = node}} required name="name" defaultValue={user.name}/>
                </Form.Group>

                <Form.Group controlId="formGridEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control ref={node => {userInput.email = node}} required name="email" defaultValue={user.email}/>
                </Form.Group>

                <Form.Group controlId="formGridGender">
                  <Form.Label>Gender</Form.Label>
                  <Form.Control ref={node => {userInput.gender = node}} required name="gender" defaultValue={user.gender} as="select">
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </Form.Control>
                </Form.Group>

                <Form.Group controlId="formGridcampus">
                  <Form.Label>Campus</Form.Label>
                  <Form.Control ref={node => {userInput.campus = node}} required name="campus" defaultValue={user.campus}/>
                </Form.Group>

                <Form.Group controlId="formGridcampus_district">
                  <Form.Label>Campus District</Form.Label>
                  <Form.Control ref={node => {userInput.campus_district = node}} required name="campus_district" defaultValue={user.campus_district}/>
                </Form.Group>

                <Form.Group controlId="formGridcourse">
                  <Form.Label>Course</Form.Label>
                  <Form.Control ref={node => {userInput.course = node}} required name="course" defaultValue={user.course}/>
                </Form.Group>

                <Form.Group controlId="formGridyear">
                  <Form.Label>Year</Form.Label>
                  <Form.Control ref={node => {userInput.year = node}} required name="year" defaultValue={user.year}/>
                </Form.Group>

                <Form.Group controlId="formGridresidential_address">
                  <Form.Label>Residential Address</Form.Label>
                  <Form.Control ref={node => {userInput.residential_address = node}} required name="residential_address" defaultValue={user.residential_address}/>
                </Form.Group>

                <Form.Group controlId="formGridresidential_district">
                  <Form.Label>Residential District</Form.Label>
                  <Form.Control ref={node => {userInput.residential_district = node}} required name="residential_district" defaultValue={user.residential_district}/>
                </Form.Group>

                <Form.Group controlId="formGridwhatsapp_number">
                  <Form.Label>WhatsApp number</Form.Label>
                  <Form.Control ref={node => {userInput.whatsapp_number = node}} name="whatsapp_number" defaultValue={user.whatsapp_number}/>
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
