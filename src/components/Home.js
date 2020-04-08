import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import "../App.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useQuery, useMutation } from '@apollo/react-hooks';
import { useHistory } from "react-router-dom";
import { brand } from '../constants';

import {
  GET_USER_DETAILS,
  GET_QUIZ,
  START_QUIZ,
} from '../graphql';

const Home = () => {
  const { data, loading, error } = useQuery(GET_USER_DETAILS, {fetchPolicy: 'network-only'});
  let history = useHistory();

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    console.error({ error })
    return <div>Error! Please refresh!</div>
  }

  let hasProfile = false;
  if (data && data.users.length > 0) {
    hasProfile = true;
  }

  const handleStart = () => {
    history.push('profile');
  }

  return (
    <Container fluid>
      <Row className="customCenter fullHeight">
        <Col xs="12" lg="8" className="customCenter imgContainer">
          <Image src={brand.image_url} rounded className="image" />
        </Col>
        <Col className="customCenter contentContainer">
          <h3 className="blue">{brand.title}</h3>
          <p>{brand.description}</p>
          { !hasProfile && (<Button onClick={handleStart}>Start</Button>) }
          { hasProfile && (<LiveQuiz />) }
        </Col>
      </Row>
    </Container>
  );
}

const LiveQuiz = () => {
  const { loading, error, data } = useQuery(GET_QUIZ, { fetchPolicy: 'network-only'});
  if (loading) {
    return <div>Loading quiz...</div>;
  }

  if (error) {
    console.error(error);
    return <div>Error!</div>;
  }

  if (data && data.quiz && data.quiz.length > 0) {
    // we have live quiz

    const getScoreButton = (quiz) => {
      if (quiz.scores && quiz.scores.length > 0) {
        const score = quiz.scores[0].score;
        const max = quiz.scores[0].max;
        if (quiz.show_score) return <Button size="sm">Your score is {score}/{max}</Button>;
        return (<Button size="sm">You have submitted answers!</Button>)
      }
      // no scores for this quiz
      return <StartQuizButton quizId={quiz.id} />
    }
    return (
      <div>
        {data.quiz.map((quiz) => {
          return (<>
            <div style={{paddingBottom: '10px', paddingTop: '10px'}}>
              <div style={{ fontWeight: '400', fontSize: '1.4em'}}>{quiz.name}</div>
            </div>
            {getScoreButton(quiz)}
          </>)
        })}
      </div>
    );

  }

  if (data && data.quiz && data.quiz.length === 0) {
    // we don't have a quiz
    return <div>Exam will start at 2pm on April 8th 2020. Check back later!</div>
  }
}

const StartQuizButton = ({ quizId }) => {
  const history = useHistory()

  const [showRulesModal, setShowRulesModal] = useState(false);

  const [ startQuiz, { loading, error } ] = useMutation(START_QUIZ, {
    onCompleted: (data) => {
      console.log('mutation completed');
      if (data && data.quiz && data.quiz.affected_rows > 0) {
        history.push(`/quiz/${quizId}`)
      } else {
        console.log('unknown error', data);
      }
    },
    onError: (error) => {
      console.error(error);
    }
  });

  const handleClick = (e) => {
    e.preventDefault();
    const rulesAgreed = localStorage.getItem('rulesAgreed') === 'true';
    if (rulesAgreed) {
      startQuizFn();
    } else {
      setShowRulesModal(true);
    }
  }

  const startQuizFn = () => {
    startQuiz({ variables: { quiz_id: quizId } })
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
    <>
      <Button variant="success" size="sm" onClick={handleClick}>Start</Button>
      <RulesModal show={showRulesModal} setShow={setShowRulesModal} startQuiz={startQuizFn} />
    </>
  );

}

const RulesModal = ({show, setShow, startQuiz}) => {

  const handleContinue = () => {
    localStorage.setItem('rulesAgreed', true);
    setShow(false);
    startQuiz();
  };
  const handleClose = () => setShow(false);

  return (
    <>
      <Modal show={show} onHide={handleClose} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>{brand.title}: Terms & Conditions</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div dangerouslySetInnerHTML={{__html: brand.rules}}></div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleContinue}>
            Agree
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Home;
