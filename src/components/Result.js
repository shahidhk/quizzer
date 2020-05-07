import React from 'react';
import gql from 'graphql-tag';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import Neutral from './Neutral';

const GET_SCORE = gql`query getScore($quiz_id: uuid!) {
  quiz: quiz_by_pk (id: $quiz_id) {
    show_score
    scores {
      score
      max
    }
  }
  users {
    name
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
    if(data.quiz.scores && data.quiz.scores.length >0) {
      const score = data.quiz.scores[0].score;
      const max = data.quiz.scores[0].max;
      const name = data.users[0].name;
      return <Neutral showScore={data.quiz.show_score} score={score} max={max} name={name} />
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
