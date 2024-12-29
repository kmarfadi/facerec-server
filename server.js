const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const { handleRegister } = require('./controllers/signup');
const { handleSignin } = require('./controllers/signin');
const { handleProfile } = require('./controllers/profile');
const { handleImage } = require('./controllers/image');
const { detectFace } = require('./controllers/faceDetect');


// Update connection to use environment variable for database URL
const db = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL, // Set this in your environment variables
    ssl: {
      rejectUnauthorized: false,
    },
  },
});
const app = express();
app.use(bodyParser.json());
app.use(cors());

//////////////////////clarifai//////////////////////////////
app.post('/detect', detectFace);
//////////////////SIGN IN CHECKER//////////////////////////
app.post('/signin',  handleSignin(db, bcrypt) );
////////////////NEW USER SIGN UP////////////////////////////
app.post('/signup', handleRegister(db, bcrypt) );
////////////////USER LOADER/GETTER////////////////////////////
app.get('/profile/:id', handleProfile(db));
////////////////ENTRIES INCREMENTER////////////////////////////
app.put('/image', handleImage(db));
////////////////SERVER LISTENER////////////////////////////
app.listen(process.env.PORT || 3003, () => {
  console.log('Server running on port ');
});



/*

/ --> res = this is working ok
/signin --> POST = success/fail ok
/signup --> POST = user ok
/profile/:userID --> GET = user  ok
/image --> PUT --> user (for counting)  ok

*/ 