const jwtSecret = require('./jwt-config');
const bcrypt = require("bcryptjs");
const User = require("../models/User");



const passport = require('passport');
const localStrategy = require("passport-local").Strategy;
const JWTstrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJWT;



function initialize(passport) {

  const authenticateUser = (username, password, done) => {
    const user = getUser
  }
 
  passport.use( new localStrategy({ usernameField: 'username'}), authenticateUser);
  passport.serializeUser((user,done) => {

  });

  passport.serializeUser((user,done) => {

  });

}

const opts = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderWithScheme('JWT'),
  secretOrKey: jwtSecret.secret
}


