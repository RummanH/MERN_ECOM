const path = require('path');

const express = require('express');
const cors = require('cors');
const passport = require('passport');
const { Strategy } = require('passport-google-oauth20');
// const cookieSession = require('cookie-session');
const cookieParser = require('cookie-parser');

const apiV1Router = require('./routes/api.v1.router');
const { saveUser } = require('./models/users/users.model');
const globalErrorHandler = require('./controllers/error.controller');

const authOptions = {
  callbackURL: '/auth/google/callback',
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
};

async function verifyCallback(accessToken, refreshToken, profile, done) {
  await saveUser({
    name: profile.name.familyName,
    email: profile.emails[0].value,
    thumbnail: profile.photos[0].value,
  });
  done(null, profile);
}

// passport.serializeUser((user, done) => {
//   done(null, user);
// });

// passport.deserializeUser((obj, done) => {
//   done(null, obj);
// });

passport.use(new Strategy(authOptions, verifyCallback));

const app = express();
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);

// app.use(
//   cookieSession({
//     name: 'session',
//     maxAge: 1000 * 60 * 60 * 24 * 10,
//     keys: [process.env.COOKIE_KEY1, process.env.COOKIE_KEY2],
//   })
// );
app.use(passport.initialize());
// app.use(passport.session());

app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get(
  '/auth/google',
  passport.authenticate('google', {
    scope: ['email', 'profile'],
  })
);

app.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/api/v1/auth/failure',
    successRedirect: '/',
    session: false,
  }),
  (req, res, next) => {
    console.log('Google called us!');
  }
);
app.get('/auth/logout', (req, res) => {});

app.use('/api/v1', apiV1Router);

app.use('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.use(globalErrorHandler);

module.exports = app;
