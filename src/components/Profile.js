import React from "react";
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/react-hooks';
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import qberry from "../images/qberry.png"
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import { useHistory } from "react-router-dom";

const GET_USER_DETAILS = gql`query getUserDetails {
  users: qberry_users {
    id
    email
    mobile
    name
    class
    school
    address
  }
}`;

const UPDATE_USER_DETAILS = gql`mutation updateUserDetails(
    $id: String!
    $email: String
    $mobile: String!
    $name: String!
    $class: smallint!
    $school: String!
    $address: String!
  ) {
  users: update_qberry_users(_set: {
    name: $name
    class: $class
    email: $email
    mobile: $mobile
    address: $address
    school: $school
  }, where: {
    id: {_eq: $id}
  }) {
    affected_rows
    returning {
      name
      mobile
      class
      address
      email
      school
    }
  }
}`;

const Profile = () => {
  let history = useHistory();
  const { loading: queryLoading, error: queryError, data } = useQuery(
    GET_USER_DETAILS,
  );

  const [
    updateTodo,
    { loading: mutationLoading },
  ] = useMutation(UPDATE_USER_DETAILS, {
    onCompleted: (data) => {
      if (data && data.users.returning.length > 0) {
        const user = data.users.returning[0];
        if (user.name != null && user.class != null && user.mobile != null && user.school != null && user.address != null) {
          alert("Profile updated! Let's go back to quiz!");
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

  if (!(data && data.users && data.users.length > 0)) {
    console.log({ data })
    return <div>Unknown Error!</div>
  }

  let user = data.users[0];

  let userInput = {
    name: null,
    mobile: null,
    class: null,
    email: null,
    school: null,
    address: null
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateTodo({ variables: {
      id: user.id,
      mobile: userInput.mobile.value,
      name: userInput.name.value,
      class: userInput.class.value,
      email: userInput.email.value,
      school: userInput.school.value,
      address: userInput.address.value
    }})

  }

  return (
    <Container fluid>
      <Row className="customCenter fullHeight">
        <Col sm={12} lg={5} className="d-none d-lg-block">
          <Image src={qberry} rounded className="image" fluid />
        </Col>
        <Col sm={12} lg={7} className="customCenter contentContainer">
          <Card>
            <Card.Header as="h4">Profile</Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>

                <Form.Group controlId="formGridName">
                  <Form.Label>Name</Form.Label>
                  <Form.Control ref={node => {userInput.name = node}} required name="name" addressholder="You name" defaultValue={user.name}/>
                </Form.Group>

                <Form.Group controlId="formGridMobile">
                  <Form.Label>Mobile</Form.Label>
                  <Form.Control ref={node => {userInput.mobile = node}} required name="mobile" addressholder="" defaultValue={user.mobile} />
                </Form.Group>

                <Form.Group controlId="formGridEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control ref={node => {userInput.email = node}} name="email" addressholder="" defaultValue={user.email} />
                </Form.Group>

                <Form.Group controlId="formGridAddress">
                  <Form.Label>Address</Form.Label>
                  <Form.Control ref={node => {userInput.address= node}} required name="address" addressholder="You address" defaultValue={user.address}/>
                </Form.Group>

                <Form.Group controlId="formGridSchool">
                  <Form.Label>School</Form.Label>
                  <Form.Control ref={node => {userInput.school = node}} required name="school" addressholder="You school" defaultValue={user.school}/>
                </Form.Group>

                <Form.Group controlId="formGridClass">
                  <Form.Label>Class</Form.Label>
                  <Form.Control ref={node => {userInput.class= node}} required name="class" defaultValue={user.class} as="select" addressholder="Class (going-to)">
                    <option key={0} value={0}>{'--'}</option>
                    {[ ...Array(10).keys() ].map( (i) => (
                      <option key={i+1} value={i+1}>{i+1}</option>
                    ))}
                  </Form.Control>
                </Form.Group>


                <Button variant="primary" type="submit">
                  {!mutationLoading && 'Save'}
                  {mutationLoading && 'Saving...'}
                </Button>
              </Form>

            </Card.Body>
            <Button variant="secondary" onClick={() => history.push('')}>
              Go back to quiz
            </Button>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
