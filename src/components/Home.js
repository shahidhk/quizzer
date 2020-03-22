import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import qberry from "../images/qberry.png";
import "../App.css";
import Button from "react-bootstrap/Button";
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { useAuth0 } from "../react-auth0-spa";

import { useHistory } from "react-router-dom";

const GET_QUIZ  = gql`query getQuiz {
  quiz: qberry_quiz {
    id
    name
  }
}`;

const Home = () => {
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  return (
    <Container fluid>
      <Row className="customCenter fullHeight">
        <Col xs="12" lg="8" className="customCenter imgContainer">
          <Image src={qberry} rounded className="image" />
        </Col>
        <Col className="customCenter contentContainer">
          <h3 className="blue">LilBerry Quiz</h3>
          <p>
            What does Lorem ipsum dolor mean Lorem ipsum dolor sit amet . The
            graphic and typographic operators know this well, in real- ity all the
            professions dealing with the universe of communi- cation have a stable
            relationship with these words, but what is it? Lorem ipsum is a dummy
            text without any sense.
          </p>
          <div >
            {!isAuthenticated && (
              <Button onClick={() => loginWithRedirect({})}>Log In</Button>
            )}
            {isAuthenticated && ( <LiveQuiz />)}
          </div>
        </Col>
      </Row>
    </Container>
  );
}

const LiveQuiz = () => {
  const { loading, error, data } = useQuery(GET_QUIZ);
  if (loading) {
    return <div>Loading quiz...</div>;
  }

  if (error) {
    console.error(error);
    return <div>Error!</div>;
  }

  if (data && data.quiz && data.quiz.length > 0) {
    // we have live quiz
    const quiz = data.quiz[0]
    return (<div>
      <div style={{paddingBottom: '10px', fontWeight: '400'}}>
        Today's Quiz: {quiz.name}
      </div>
      <StartQuizButton quizId={quiz.id} />
    </div>);

  }

  if (data && data.quiz && data.quiz.length === 0) {
    // we don't have a quiz
    return <div>Sorry, there are no quizzes live right now. Check back later!</div>
  }
}

const START_QUIZ = gql`mutation startQuiz($quiz_id: uuid!) {
  quiz: insert_qberry_sessions(objects:{
    quiz_id: $quiz_id
  }) {
    affected_rows
    returning {
      questions {
        question {
          id
          text
          options {
            id
            text
          }
        }
      }
    }
  }
}`;

const StartQuizButton = ({ quizId }) => {
  const history = useHistory()

  const [ startQuiz, { loading, error, data } ] = useMutation(START_QUIZ, {
    onCompleted: () => {
      console.log('mutation completed');
      history.push(`/quiz/${quizId}`)
    },
    onError: (error) => {
      console.error(error);
    }
  }); 

  const handleClick = (e) => {
    e.preventDefault();
    startQuiz({variables: { quiz_id: quizId }})
  }

  if (loading) {
    return (<Button variant="primary">Loading...</Button>);
  }

  if (error) {
    console.log(error);
    if (error.graphQLErrors && error.graphQLErrors[0].extensions.code === "constraint-violation") {
      // session already started
      history.push(`/quiz/${quizId}`)
      return (<Button variant="success">Quiz Started!</Button>);
    } 
    return (<Button variant="danger">Error! Try again!</Button>);
  }

  return (
    <Button variant="primary" onClick={handleClick}>Start</Button>
  );

}

export default Home;
