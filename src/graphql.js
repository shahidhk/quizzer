import gql from 'graphql-tag';

export const GET_USER_DETAILS = gql`query getUserDetails {
  users {
    id
    email
    mobile
    name
    course_occupation 
    address
  }
}`;

export const GET_QUIZ = gql`query getQuiz {
  quiz {
    id
    name
    show_score
    scores {
      score
      max
    }
  }
}`;

export const UPDATE_USER_DETAILS = gql`mutation upsertUserDetails(
    $email: String
    $mobile: String!
    $name: String!
    $course_occupation: String!
    $address: String!
  ) {
  users: insert_users(objects: {
    name: $name
    email: $email
    mobile: $mobile
    address: $address
    course_occupation: $course_occupation
  }, on_conflict: {
    constraint: users_pkey,
    update_columns: [
      address
      email
      mobile
      name
      course_occupation
    ]
  }) {
    affected_rows
    returning {
      name
      mobile
      address
      email
      course_occupation
    }
  }
}`;


export const START_QUIZ = gql`mutation startQuiz($quiz_id: uuid!) {
  quiz: insert_sessions(objects:{
    quiz_id: $quiz_id
  }) {
    affected_rows
  }
}`;

export const GET_QUESTIONS = gql`query getQuestionsForSession($quiz_id: uuid!) {
  questions: session_questions(where:{
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

export const SUBMIT_ANSWERS = gql`mutation submitAnswer(
  $answers: [answers_insert_input!]!
) {
  answers: insert_answers(objects: $answers) {
    affected_rows
  }
}`;

