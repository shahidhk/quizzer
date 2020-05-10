import gql from 'graphql-tag';

export const GET_USER_DETAILS = gql`query getUserDetails {
  users {
    id
    mobile
    name
    email
    course
    campus
    residential_address
    gender
    campus_district
    year
    residential_district
    whatsapp_number
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
    $id: String!
    $name: String!
    $email: String!
    $course: String!
    $campus: String!
    $residential_address: String!
    $gender: String!
    $campus_district: String!
    $year: String!
    $residential_district: String!
    $whatsapp_number: String!
  ) {
  users: update_users(
    where: { id: { _eq: $id }}
    _set: {
      name: $name
      email: $email
      course: $course
      campus: $campus
      residential_address: $residential_address
      gender: $gender
      campus_district: $campus_district
      year: $year
      residential_district: $residential_address
      whatsapp_number: $whatsapp_number
    }
  ) {
    affected_rows
    returning {
      id
      mobile
      name
      email
      course
      campus
      residential_address
      gender
      campus_district
      year
      residential_district
      whatsapp_number
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

