import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Modal from "react-bootstrap/Modal";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import "../App.css";
import Button from "react-bootstrap/Button";
import ButtonToolbar from "react-bootstrap/ButtonToolbar";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import { useParams, useHistory } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { brand } from '../constants';
import Timer from 'react-compound-timer';

import {
  GET_QUESTIONS,
  SUBMIT_ANSWERS,
} from '../graphql';

const Quiz = () => {
  const { quizId } = useParams();
  let history = useHistory();
  const { data, loading, error } = useQuery(GET_QUESTIONS, { variables: { quiz_id: quizId } });
  const [answers, setAnswers] = useState({});
  const [showTimesUpModal, setShowTimesUpModal] = useState(false);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [submitButtonText, setSubmitButtonText] = useState("Submit")
  const [submitAnswers] = useMutation(SUBMIT_ANSWERS, {
    onCompleted: (data) => {
      setSubmitButtonText('Done!');
      if (data && data.answers && data.answers.affected_rows > 0) {
        // submit happened, need to check score now
        setSubmitButtonText('Getting your score...');
        history.push(`/result/${quizId}`);
      } else {
        console.error({submitAnswerData: data});
        setSubmitButtonText('Error! Try again!');
      }
    },
    onError: (error) => {
      console.error('mutation error', error);
      setSubmitButtonText('Error! Try again!')
    },
  });


  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    console.error({loadQuestionError: error})
    return <div>Error! Please refresh!</div>
  }

  if (!(data && data.questions && data.questions.length > 0)) {
    return <div>Unknown state: {data}</div>
  }

  const showNextQuestion = (e) => {
    setCurrentQuestionIdx(currentQuestionIdx + 1);
  }

  const showPreviousQuestion = (e) => {
    setCurrentQuestionIdx(currentQuestionIdx - 1);
  }

  const totalQuestions= data.questions.length;

  const handleSubmitClick = (e) => {
    // build variables, execute mutations, handle response
    console.log({answers: Object.keys(answers).length, totalQuestions});
    if (Object.keys(answers).length !== totalQuestions) {
      alert('Answer all questions and try agian!');
      return
    }
    let answersInput = [];
    Object.keys(answers).forEach((k) => {
      answersInput.push({
        quiz_id: quizId,
        question_id: k,
        option_id: answers[k]
      });
    });
    setSubmitButtonText('Submitting...');
    submitAnswers({variables: {answers: answersInput}});
  }

  return (
    <Container fluid>
      <Row className="customCenter fullHeight">
        <Col sm={12} lg={5} className="d-none d-lg-block">
          <Image src={brand.image_url} fluid />
        </Col>
        <Col sm={12} lg={7} className="customCenter contentContainer">
          <TimerD showModal={setShowTimesUpModal} />
          <Card>
            <Card.Header as="h6">Question {currentQuestionIdx + 1}/{totalQuestions}</Card.Header>

            <Question question={data.questions[currentQuestionIdx].question} answers={answers} setAnswers={setAnswers} />

            <ButtonToolbar
              className="justify-content-between"
              aria-label="Toolbar with Button groups for next and previous"
              style={{ padding: '5px' }}
            >
              <Button disabled={currentQuestionIdx === 0} variant="outline-secondary" onClick={showPreviousQuestion}>&lt;</Button>
              {currentQuestionIdx === totalQuestions - 1 && (<Button variant="primary" onClick={handleSubmitClick}>{submitButtonText}</Button>)}
              <Button disabled={currentQuestionIdx === totalQuestions - 1} variant="outline-secondary" onClick={showNextQuestion}>&gt;</Button>
            </ButtonToolbar>
          </Card>
        </Col>
      </Row>
      <TimesUpModal show={showTimesUpModal} setShow={setShowTimesUpModal} />
    </Container>
  );
}

const Question = ({ question, answers, setAnswers }) => {
  const handleClick = (question_id, option_id) => {
    setAnswers({...answers, [question_id]: option_id});
  }
  return (
    <Card.Body>
      <Card.Title style={{ fontSize: '1.4em', padding: '20px' }}>{question.text}</Card.Title>
      <Card>
        <ListGroup variant="flush">
          {question.options.map((option) => (
            <ListGroup.Item
              style={{ cursor: 'pointer' }}
              key={option.id}
              onClick={(e)=>{
                handleClick(question.id, option.id);
              }}
              active={answers[question.id] === option.id}
            >{option.text}</ListGroup.Item>
          ))}
        </ListGroup>
      </Card>
    </Card.Body>
  );
}

const TimerD = ({ showModal }) => {
  return (<Timer
    initialTime={60*60*1000}
    lastUnit="m"
    direction="backward"
    checkpoints={[
      {
          time: 0,
          callback: () => { showModal(true); },
      },
  ]}
  >
    {() => (
      <div style={{fontSize: '1.4em', padding:'10px 10px', color: 'green'}}>
        <Timer.Minutes /> m &nbsp;
        <Timer.Seconds /> s
        remaining
      </div>
    )}
  </Timer>);
}


const TimesUpModal = ({show, setShow}) => {

  const handleClose = () => setShow(false);

  return (
    <>
      <Modal show={show} onHide={handleClose} size="sm">
        <Modal.Header closeButton>
          <Modal.Title>Time's Up!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>You have exhaused 1 hour allotted for the exam!</div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Quiz;