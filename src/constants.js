const rules = `
<h4>Eligibility</h4>

<p>The Contestants should fulfil the following eligibility criteria:</p>

• Individual Participation is mandatory.<br/>
• The contestant should be a student of any recognised professional course.

<h4>Contest details:</h4>

• Winners will be selected through random draw from those who got all answers correct.<br/>
• Winners will be contacted by Qberry Team.<br/>
• Winners will be awarded exciting prizes.<br/>
• Winners have to prove their identity as professional student. (ID Cards mandatory)<br/>
`

export const brand = {
  title: 'Qberry | Profcon 2021',
  description: '',
  image_url: '/logo.png',
  navbar_logo_url: '/navbar_logo.png',
  rules: rules,
  neutral_text: `Winners will be announced later`,
  fail_text: 'Try later',
  win_text: `You won!`,
  sorry_text: `Sorry, there are no quizzes live right now. Check back later!`,
};

export const auth = {
  loginUrl: 'https://api.profcon.in/api/auth/token/'
}

export const api_url = 'https://profcon.hasura.app/v1/graphql';

