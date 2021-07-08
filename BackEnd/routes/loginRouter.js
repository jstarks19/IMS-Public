const express = require("express");
const loginRouter = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

require('dotenv').config();





// POST /login
loginRouter.post("/", async (req, res) => {
  try {
    const user = await User.findOne({username: req.body.username}).lean();
    if (user) {
      const result = await bcrypt.compare(req.body.password, user.password);
      if (result) {
        req.session['clientId'] = user.id;
        res.send(req.session);
      } else {
        res.send('Not Authorized');
      }
    } else {
      res.send(`User ${req.body.username} does not exist`);
    }
  } catch (err) {
    console.log('error', err.name, err.stack, err.message);
    res.send('Error');
  }
    // const token = jwt.sign({id: user.username}, jwtSecret.secret);         
});


module.exports = loginRouter;
