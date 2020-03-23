import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import fail from "../images/fail.jpg";
import { LinkContainer } from "react-router-bootstrap";
import Button from 'react-bootstrap/Button';
import "../App.css";
import { useQuery } from '@apollo/react-hooks';
import { useParams } from 'react-router-dom';
import gql from 'graphql-tag';

const GET_SCORE = gql`query getScore($quiz_id: uuid!) {
  scores: qberry_scores(where: {quiz_id: {_eq: $quiz_id}}) {
    score
  }
}`;

const Failure = () => {
  const { quizId } = useParams();
  const {data, loading, error} = useQuery(GET_SCORE, {variables: {quiz_id: quizId}});
  return (
    <Container fluid>
      <Row className="customCenter fullHeight">
        <Col className="customCenter contentContainer">
          <Image src={fail} rounded className="imageFail" fluid />
          <h3 className="red">Sorry!</h3>
          <h5 className="m-t-1">Your score:{' '}
            {loading && 'Loading...'}
            {error && error.message}
            {data && data.scores && data.scores.length > 0 && data.scores[0].score}
            /5
          </h5>
          <p>
            Try again next time?
          </p>
          <LinkContainer to="/">
            <Button>Go back</Button>
          </LinkContainer>
        </Col>
      </Row>
    </Container>
  );
}

export default Failure;
