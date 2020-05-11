var jwt = require('jsonwebtoken');
const http = require('http');
const { GraphQLClient } = require('graphql-request')

const JWT_SECRET = process.env.SMS_JWT_SECRET;
const SMS_SECRET = process.env.SMS_API_SECRET;

const HASURA_ENDPOINT = process.env.HASURA_ENDPOINT;
const HASURA_SECRET = process.env.HASURA_SECRET;

const SMS_SENDER_ID = 'PRFCON';

const subject = 'urn:Auth0'
const audience = 'urn:QberrySmsGateway'

const TOKEN_SCHEME = 'Bearer ';

const updateUserOtp = `mutation updateUserOtp($otp: String!, $mobile: String!) {
  insert_users(
    objects:{
      mobile: $mobile
      otp: $otp
    }
    on_conflict: {
      constraint: users_mobile_key
      update_columns: [otp]
    }
  ) {
    affected_rows
  }
}`;

module.exports = (req, res) => {
  try {
    const authz = req.headers.authorization;
    if (authz != undefined && authz.startsWith(TOKEN_SCHEME)) {
      var decoded = jwt.verify(authz.split(TOKEN_SCHEME)[1], JWT_SECRET);
      if (decoded.sub != subject && decoded.aud != audience) {
        console.error('Unauthorized: ', JSON.stringify(decoded.gateway_authentication));
        res.status(401).send('Unauthorized');
        return;
      }
    } else {
      console.log('authz: ', authz);
      res.status(401).send('Malformed authz header');
      return;
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
    return;
  }

  const updateOtp = {
    hostname: 'albayan-api.shahidh.in'
  }

  const { recipient, body } = req.body;

  console.log('recipient: ', recipient);
  console.log('body: ', body);

  const client = new GraphQLClient(HASURA_ENDPOINT, {
    headers: {
      'x-hasura-admin-secret': HASURA_SECRET,
    },
  });

  client.request(updateUserOtp, { otp: body, mobile: `${recipient.replace('+91', '')}` }).then((data) => {
    const getOpts = {
      hostname: 'msgbox.theparentalert.com',
      port: 80,
      path: `/api/sms/format/xml/key/${SMS_SECRET}/method/MT/mobile/${recipient.replace('+91', '')}/sender/${SMS_SENDER_ID}/route/TL/text/${body.split(' ').join('+')}`,
      method: 'GET'
    }

    const r = http.request(getOpts, s => {
      console.log(`statusCode: ${s.statusCode}`)

      s.on('data', d => {
        process.stdout.write(d)
        res.status(200).send('Done!');
        return;
      })
    })

    r.on('error', error => {
      console.error('sms api error: ', error);
      res.status(500).send('Internal server error');
      return;
    })

    r.end()
  }).catch(err => {
    console.log(err.response.errors) // GraphQL response errors
    console.log(err.response.data) // Response data if available
  })

}

/*
  request body:
  {
    "recipient": "+1 399 999",
    "body": "Your verification code is: 12345",
    "sender": "+1 234 567"
  }
*/