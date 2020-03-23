import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import qberry from "../images/qberry.png"
import "../App.css";
import Button from "react-bootstrap/Button";
import ButtonToolbar from "react-bootstrap/ButtonToolbar";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import { useParams, useHistory } from 'react-router-dom';
import gql from 'graphql-tag';
import { useQuery, useLazyQuery, useMutation } from '@apollo/react-hooks';

const GET_QUESTIONS = gql`query getQuestionsForSession($quiz_id: uuid!) {
  questions: qberry_session_questions(where:{
    quiz_id: {_eq: $quiz_id}
  }) {
    question {
      id
      text
      options {
        id
        text
      }
    }
  }
}`;

const SUBMIT_ANSWERS = gql`mutation submitAnswer(
  $answers: [qberry_answers_insert_input!]!
) {
  answers: insert_qberry_answers(objects: $answers) {
    affected_rows
  }
}`;

const GET_SCORE = gql`query getScore($quiz_id: uuid!) {
  scores: qberry_scores(where: {quiz_id: {_eq: $quiz_id}}) {
    score
  }
}`;

const Quiz = () => {
  const { quizId } = useParams();
  let history = useHistory();
  const { data, loading, error } = useQuery(GET_QUESTIONS, { variables: { quiz_id: quizId } });
  const [answers, setAnswers] = useState({});
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [submitButtonText, setSubmitButtonText] = useState("Submit")
  const [getScore] = useLazyQuery(GET_SCORE, {
    onCompleted: (data) => {
      if (data && data.scores && data.scores.length >0) {
        console.log({getScoreData: data});
        const score = data.scores[0].score;
        if (score === 3) {
          history.push('/congrats');
        } else {
          history.push(`/sorry/${quizId}`)
        }
      } else {
        console.log({getScoreData: data});
        setSubmitButtonText('Error! Try again!');
      }
    },
    onError: (error) => {
      console.error('get score error', error);
      setSubmitButtonText('Error! Try again!')
    }
  });
  const [submitAnswers] = useMutation(SUBMIT_ANSWERS, {
    onCompleted: (data) => {
      console.log('mutation data', data);
      setSubmitButtonText('Done!');
      if (data && data.answers && data.answers.affected_rows > 0) {
        // submit happened, need to check score now
        setSubmitButtonText('Getting your score...');
        getScore({ variables: { quiz_id: quizId }});
      } else {
        console.log({submitAnswerData: data});
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
    return <div>{error}</div>
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
          <Image src={qberry} fluid />
        </Col>
        <Col csm={12} lg={7} className="customCenter contentContainer">
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

export default Quiz;
