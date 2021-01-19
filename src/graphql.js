import gql from 'graphql-tag';

export const GET_USER_DETAILS = gql`query getUserDetails {
  users: auth_user {
    id
    email
    first_name
  }
}`;

export const GET_QUIZ = gql`query getQuiz {
  quiz: qberry_quiz {
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
    $class: smallint!
    $school: String!
    $address: String!
  ) {
  users: insert_users(objects: {
    name: $name
    class: $class
    email: $email
    mobile: $mobile
    address: $address
    school: $school
  }, on_conflict: {
    constraint: users_pkey,
    update_columns: [
      address
      class
      email
      mobile
      name
      school
    ]
  }) {
    affected_rows
    returning {
      name
      mobile
      class
      address
      email
      school
    }
  }
}`;


export const START_QUIZ = gql`mutation startQuiz($quiz_id: uuid!) {
  quiz: insert_qberry_sessions(objects:{
    quiz_id: $quiz_id
  }) {
    affected_rows
  }
}`;

export const GET_QUESTIONS = gql`query getQuestionsForSession($quiz_id: uuid!) {
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

export const SUBMIT_ANSWERS = gql`mutation submitAnswer(
  $answers: [qberry_answers_insert_input!]!
) {
  answers: insert_qberry_answers(objects: $answers) {
    affected_rows
  }
}`;

export const GET_SCORE = gql`query getScore($quiz_id: uuid!) {
  quiz: qberry_quiz_by_pk (id: $quiz_id) {
    show_score
    scores {
      score
      max
    }
  }
}`;