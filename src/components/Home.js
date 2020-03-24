import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import qberry from "../images/qberry.png";
import "../App.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Tabs from "react-bootstrap/Tabs";
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { useAuth0 } from "../react-auth0-spa";
import { useHistory } from "react-router-dom";

const GET_USER_DETAILS = gql`query getUserDetails {
  users: qberry_users {
    mobile
    name
    class
    school
    address
  }
}`;

const GET_QUIZ  = gql`query getQuiz {
  quiz: qberry_quiz {
    id
    name
    scores {
      score
    }
  }
}`;

const Home = () => {
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const { data, loading, error } = useQuery(GET_USER_DETAILS, {fetchPolicy: 'network-only'});
  let history = useHistory();

  if (loading) {
    return <div>Loading...</div>
  }

  if (error && isAuthenticated) {
    console.error({ getUserProfileError: error });
    return <div>Error! Please refresh!</div>
  }

  if (data && data.users && data.users.length > 0) {
    const user = data.users[0];
    if ((user.name == null || user.class == null || user.mobile == null || user.school == null || user.address == null) && isAuthenticated) {
      window.setTimeout(()=>{
        history.push('/profile');
      }, 1000)
      return (<div>Redirecting to profile... <a href="/profile">Click here</a> if you're redirectd automatically.</div>);
    }
  }

  return (
    <Container fluid>
      <Row className="customCenter fullHeight">
        <Col xs="12" lg="8" className="customCenter imgContainer">
          <Image src={qberry} rounded className="image" />
        </Col>
        <Col className="customCenter contentContainer">
          <h3 className="blue">LilBerry Quiz</h3>
          <p>
            A summer time online quiz for kids. Let's learn online in this vacation.
            Wisdom Students presents LilBerry online quiz contests for better learning and fun.
            LilBerry competitions will be held twice in a week between 2pm and 8pm IST.
            The quiz is open to students who are in 10th Standard or below.
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
    const quiz = data.quiz[0]
    let score = undefined;

    const getScoreButton = () => {
      if (quiz.scores && quiz.scores.length > 0) {
        score = quiz.scores[0].score;
        return (<Button>Your score is {score}/5</Button>);
      }
    }
    return (<div>
      <div style={{paddingBottom: '10px'}}>
        <span>Today's Quiz:</span><br />
        <span style={{ fontWeight: '400', fontSize: '1.5em'}}>{quiz.name}</span>
      </div>
      {getScoreButton()}
      {score === undefined && (<StartQuizButton quizId={quiz.id} />)}
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
  }
}`;

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
      <Button variant="success" size="lg" onClick={handleClick}>Start</Button>
      <RulesModal show={showRulesModal} setShow={setShowRulesModal} startQuiz={startQuizFn} />
      <br/ >
      <div style={{paddingTop: '20px', cursor: 'pointer'}} onClick={() => setShowRulesModal(true)}>
        <span><u>Rules</u></span>
      </div>
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
          <Modal.Title>LilBerry Quiz: Terms & Conditions</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example">
            <Tabs.Tab eventKey="malayalam" title="Malayalam" active>
              <p>SummeRise (സമ്മറൈസ്), അവധിക്കാല പരിപാടികളുടെ ഭാഗമായി വിസ്ഡം സ്റ്റുഡന്റ്സ് സംസ്ഥാന സമിതിയാണ് LilBerry എന്ന ഈ ഓൺലൈൻ ക്വിസ് മത്സരം സംഘടിപ്പിക്കുന്നത്. ഇത് ഇന്ത്യയിലും വിദേശത്തും സാധുതയുള്ളതാണ്.</p>

              <h4>യോഗ്യത</h4>

              <p>താഴെ പറയുന്ന യോഗ്യതാ മാനദണ്ഡങ്ങൾ ഉള്ളവർക്ക് മാത്രമേ മത്സരത്തിൽ പങ്കെടുക്കാവൂ</p>
              <ul>
                <li>നിങ്ങൾ ഒരു വ്യക്തിഗത പങ്കാളിയായിരിക്കണം.</li>
                <li>നിങ്ങൾ പത്താം ക്ലാസിലോ അതിൽ താഴെയോ പഠിക്കുന്ന വിദ്യാർത്ഥിയായിരിക്കണം.</li>
              </ul>

              <h4>മത്സരത്തിന്റെ വിശദമായ വിവരങ്ങൾ :</h4>

              <h5>എങ്ങനെ മത്സരത്തിൽ പ്രവേശിക്കാം?</h5>

              <ul>
                <li>മാർച്ച് 24 മുതൽ വരുന്ന എല്ലാ തിങ്കൾ, വ്യാഴം ദിവസങ്ങളിലും മത്സരം ഉണ്ടായിരിക്കും.</li>
                <li>സമയപരിധിക്കുള്ളിൽ ( ഉച്ചകഴിഞ്ഞ് 2 മുതൽ രാത്രി 8 വരെ [IST] ) നേരത്തെ പറഞ്ഞ, യോഗ്യതയുള്ള ആർക്കും, കൃത്യം രണ്ട് മണിക്ക് പുറത്ത് വരുന്ന ലിങ്കിലൂടെ മത്സരത്തിൽ പങ്കെടുക്കാം.</li>
                <li>5 ചോദ്യങ്ങളായിരിക്കും ഉണ്ടാവുക. ഓരോ ചോദ്യത്തിനും 4 ഓപ്ഷൻസ് വീതം ഉണ്ടായിരിക്കും.</li>
                <li>5 ചോദ്യങ്ങൾ‌ക്കും ശരിയായ ഉത്തരം നൽ‌കുന്ന ഒന്നിലധികം പേർ ഉണ്ടെങ്കിൽ, random draw - ലൂടെ വിജയികളെ തിരഞ്ഞെടുക്കും.</li>
                <li>തിരഞ്ഞെടുത്ത വിജയികൾക്ക് ആകർഷകമായ സമ്മാനങ്ങൾ ഉണ്ടായിരിക്കും.</li>
                <li>വിജയികളാവുന്നവർ വിദ്യാർത്ഥി എന്ന നിലയിലുള്ള അവരുടെ ഐഡന്റിറ്റി തെളിയിക്കേണ്ടതാണ്.</li>
              </ul>
            </Tabs.Tab>
            <Tabs.Tab eventKey="english" title="English">
              <p>The contest is organised by WISDOM STUDENTS State Committee, as a part of SummeRise, vacation programs and it is valid with in India and abroad</p>

              <h4>Eligibility</h4>

              <p>The following eligibility criteria is strictly done for entering to the contest.</p>

              <ul>
                <li>You should be an individual participant.</li>
                <li>You should be a student studying in 10th Standard or below.</li>
              </ul>

              <h4>Contest Details</h4>

              <ul>
                <li>The contest will start from March 24 from 2pm to 8pm IST, on every Thursdays and Mondays</li>
                <li>Contestant can participate by giving their mobile number.</li>
                <li>If all the 5 questions of case are answered correctly, contestant will be selected to random draw.</li>
                <li>Winners will be selected through random draw.</li>
                <li>Winners have to prove their identity as student.</li>
              </ul>
            </Tabs.Tab>
          </Tabs>
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
