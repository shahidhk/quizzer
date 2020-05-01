import React, {useState} from "react";
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
import { brand, districts } from '../constants';

const Profile = () => {
  const [areas, setAreas] = useState([]);
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
        if (user.name != null && user.guardian_name != null && user.mobile != null && user.school != null && user.address != null && user.district != null && user.area != null) {
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
      class: null,
      guardian_name: null,
      school: null,
      address: null,
      district: null,
      area: null,
    };
  } else {
    user = data.users[0];
  }

  let userInput = {
    name: null,
    mobile: null,
    class: null,
    guardian_name: null,
    school: null,
    address: null,
    district: null,
    area: null,
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUser({ variables: {
      mobile: userInput.mobile.value,
      name: userInput.name.value,
      class: userInput.class.value,
      guardian_name: userInput.guardian_name.value,
      school: userInput.school.value,
      address: userInput.address.value,
      district: userInput.district.value,
      area: userInput.area.value,
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

                <Form.Group controlId="formGridName">
                  <Form.Label>പേര്</Form.Label>
                  <Form.Control ref={node => {userInput.name = node}} required name="name" defaultValue={user.name}/>
                </Form.Group>

                <Form.Group controlId="formGridGuardianName">
                  <Form.Label>രക്ഷിതാവിന്റെ പേര്</Form.Label>
                  <Form.Control ref={node => {userInput.guardian_name = node}} required name="guardian_name" defaultValue={user.guardian_name}/>
                </Form.Group>

                <Form.Group controlId="formGridMobile">
                  <Form.Label>ഫോൺ നമ്പർ</Form.Label>
                  <Form.Control ref={node => {userInput.mobile = node}} required name="mobile" defaultValue={user.mobile} />
                </Form.Group>

                <Form.Group controlId="formGridAddress">
                  <Form.Label>സ്ഥലം</Form.Label>
                  <Form.Control ref={node => {userInput.address= node}} required name="address" defaultValue={user.address}/>
                </Form.Group>

                <Form.Group controlId="formGridDistrict">
                  <Form.Label>ജില്ല</Form.Label>
                  <Form.Control ref={node => {userInput.district = node}} required name="district" defaultValue={user.district} as="select" onChange={(e)=>{
                    setAreas(districts[districts.findIndex(f=>f.name === e.target.value)].areas);
                  }}>
                    <option key={0} value={0}>{'--'}</option>
                    {districts.map((d, i)=>(
                      <option key={i+1} value={d.name}>{d.name}</option>
                    ))}
                  </Form.Control>
                </Form.Group>

                <Form.Group controlId="formGridArea">
                  <Form.Label>ഏരിയ</Form.Label>
                  <Form.Control ref={node => {userInput.area= node}} required name="area" defaultValue={user.area} as="select" >
                    <option key={0} value={0}>{'--'}</option>
                    {areas.map((a, i)=>(
                      <option key={i+1} value={a}>{a}</option>
                    ))}
                  </Form.Control>
                </Form.Group>

                <Form.Group controlId="formGridSchool">
                  <Form.Label>സ്കൂൾ</Form.Label>
                  <Form.Control ref={node => {userInput.school = node}} required name="school" defaultValue={user.school}/>
                </Form.Group>

                <Form.Group controlId="formGridClass">
                  <Form.Label>ക്ലാസ്</Form.Label>
                  <Form.Control ref={node => {userInput.class= node}} required name="class" defaultValue={user.class} as="select">
                    <option key={0} value={0}>{'--'}</option>
                    {[ 3,4,5,6 ].map( (i) => (
                      <option key={i} value={i}>{i}</option>
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
              Go to questions
            </Button>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
