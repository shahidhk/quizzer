#! /usr/bin/env python3

import csv
import requests

filename='quiz_4.csv'

name = "Countries & Capitals"
start_at = "2020-04-02T14:00:00.000000+05:30"
end_at =   "2020-04-02T20:00:00.000000+05:30"

endpoint = 'http://localhost:8080/v1/graphql'

admin_secret = 'randomsecret'

MUTATION="""
mutation loadQuiz(
  $name: String!
  $start_at: timestamptz!
  $end_at: timestamptz!
  $questions: [questions_insert_input!]!
) {
  insert_quiz(objects:{
    name: $name
    start_at: $start_at
    end_at: $end_at
    questions: {
      data: $questions
    }
  }) {
    affected_rows
  }
}
"""

# questions: [
#   text
#   options:
#     data: [
#       text
#       is_correct
#     ]
  
questions = []

with open(filename, mode='r') as csv_file:
    csv_reader = csv.DictReader(csv_file)
    line_count = 0
    for row in csv_reader:
        if line_count == 0:
            print(f'Column names are {", ".join(row)}')
            line_count += 1
        line_count += 1

        question = {
          'text': row['question'],
          'options': {
            'data': [
              {
                'text': row['a'],
                'is_correct': 'a' == row['answer']
              },
              {
                'text': row['b'],
                'is_correct': 'b' == row['answer']
              },
              {
                'text': row['c'],
                'is_correct': 'c' == row['answer']
              },
              {
                'text': row['d'],
                'is_correct': 'd' == row['answer']
              }
            ]
          }
        }
        questions.append(question)
        print(f"====> {row['question']} -- {row[row['answer']]}")

    print(f'Processed {line_count} lines.')


variables = {
  'name': name,
  'start_at': start_at,
  'end_at': end_at,
  'questions': questions
}

payload = {
  'query': MUTATION,
  'variables': variables
}

r = requests.post(endpoint, json=payload, headers={'x-hasura-admin-secret':admin_secret})
print(r.status_code)
print(r.text)
