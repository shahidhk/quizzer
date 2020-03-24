import React from 'react';
import gql from 'graphql-tag';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import Success from './Success';
import Failure from './Failure';

const GET_SCORE = gql`query getScore($quiz_id: uuid!) {
  scores: qberry_scores(where: {quiz_id: {_eq: $quiz_id}}) {
    score
  }
}`;

const Result = () => {
  const { quizId } = useParams();
  const {data, loading, error} = useQuery(GET_SCORE, {variables:{ quiz_id: quizId}});

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    console.error({loadQuestionError: error})
    return <div>Error! Please refresh!</div>
  }

  if (data && data.scores && data.scores.length >0) {
    const score = data.scores[0].score
    if (score === 5) {
      return <Success score={score} />
    } else {
      return <Failure score={score} />
    }
  }

  console.error({scoresData: data});

  return (
    <>
      Error! Please refresh!
    </>
  );
}

export default Result;