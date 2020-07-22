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

const districts = [
  'Kasargod',
  'Kannur',
  'Kozhikode',
  'Wayanad',
  'Malappuram',
  'Palakkad',
  'Thrissur',
  'Alappuzha',
  'Ernakulam',
  'Idukki',
  'Kottayam',
  'Pathanamthitta',
  'Kollam',
  'Thiruvananthapuram',
  'Outside Kerala'
]

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
        if (user.name != null && user.mobile != null && user.gender != null && user.class != null && user.school != null && user.district!= null && user.zone!= null) {
          alert("Profile updated! Let's go to questions!");
          window.setTimeout(()=>{history.push('')}, 1000);
        } else {
          alert('Please fill all fields!');
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
      gender: null,
      class: null,
      school: null,
      district: null,
      zone: null
    };
  } else {
    user = data.users[0];
  }

  let userInput = {
    name: null,
    mobile: null,
    gender: null,
    class: null,
    school: null,
    district: null,
    zone: null
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUser({ variables: {
      name: userInput.name.value,
      mobile: userInput.mobile.value,
      gender: userInput.gender.value,
      class: userInput.class.value,
      school: userInput.school.value,
      district: userInput.district.value,
      zone: userInput.zone.value
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
                  <Form.Label>WhatsApp number</Form.Label>
                  <Form.Control ref={node => {userInput.mobile = node}} required name="mobile" defaultValue={user.mobile} type="number"/>
                </Form.Group>

                <Form.Group controlId="formGridGender">
                  <Form.Label>Gender</Form.Label>
                  <Form.Control ref={node => {userInput.gender = node}} required name="text" defaultValue={user.gender} as="select">
                    <option key="m" value="male">Male</option>
                    <option key="f" value="female">Female</option>
                  </Form.Control>
                </Form.Group>

                <Form.Group controlId="formGridClass">
                  <Form.Label>Class</Form.Label>
                  <Form.Control ref={node => {userInput.class= node}} required name="class" defaultValue={user.class} as="select">
                    {[7,8,9,10,11,12].map((e) => <option key={e} value={e}>{e}th</option>)}
                  </Form.Control>
                </Form.Group>

                <Form.Group controlId="formGridSchool">
                  <Form.Label>School</Form.Label>
                  <Form.Control ref={node => {userInput.school= node}} required name="school" defaultValue={user.school}/>
                </Form.Group>

                <Form.Group controlId="formGridDistrict">
                  <Form.Label>District</Form.Label>
                  <Form.Control ref={node => {userInput.district= node}} required name="district" defaultValue={user.district} as="select">
                    {districts.map((d)=><option key={d} value={d}>{d}</option>)}
                  </Form.Control>
                </Form.Group>

                <Form.Group controlId="formGridZone">
                  <Form.Label>Zone/Place</Form.Label>
                  <Form.Control ref={node => {userInput.zone= node}} required name="zone" defaultValue={user.zone}/>
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
