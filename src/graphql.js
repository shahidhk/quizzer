import gql from 'graphql-tag';

export const GET_USER_DETAILS = gql`query getUserDetails {
  users {
    id
    guardian_name
    mobile
    name
    class
    school
    address
    district
    area
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
    $mobile: String!
    $name: String!
    $guardian_name: String!
    $class: smallint!
    $school: String!
    $address: String!
    $district: String!
    $area: String!
  ) {
  users: insert_users(objects: {
    name: $name
    class: $class
    guardian_name: $guardian_name
    mobile: $mobile
    address: $address
    school: $school
    district: $district
    area: $area
  }, on_conflict: {
    constraint: users_pkey,
    update_columns: [
      address
      class
      mobile
      name
      school
      guardian_name
      district
      area
    ]
  }) {
    affected_rows
    returning {
      name
      mobile
      class
      address
      guardian_name
      school
      district
      area
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

