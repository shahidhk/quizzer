import React from 'react';
import gql from 'graphql-tag';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import Success from './Success';
import Failure from './Failure';
import Neutral from './Neutral';

const GET_SCORE = gql`query getScore($quiz_id: uuid!) {
  quiz: quiz_by_pk (id: $quiz_id) {
    show_score
    scores {
      score
      max
    }
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

  if (data && data.quiz ) {
    if (data.quiz.show_score) {
      if(data.quiz.scores && data.quiz.scores.length >0) {
        const score = data.quiz.scores[0].score;
        const max = data.quiz.scores[0].max;
        if (score === max) {
          return <Success score={score} max={max} />
        } else {
          return <Failure score={score} max={max} />
        }
      }
    } else {
      // don't show score
      return <Neutral />

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
