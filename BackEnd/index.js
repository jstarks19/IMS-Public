// Strict Mode
"use strict";
require('dotenv').config();

// Import
const express = require("express"); // HTTP Server
const mongoose = require("mongoose"); // Backend Database
const helmet = require("helmet"); // Silver Bullet (not really), for sanitizing/preventing malice
const config = require("config"); // Use configuration files
const cors = require("cors"); // Prevent Cross Origin Issues
const bcrypt = require("bcryptjs"); // encryption library for salting/hashing passwords 
const logger = require('morgan');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const User = require('./models/User');

// my utilities
// const clog = require('./my-logger');


// Create App
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ credentials: true, origin: true}));

app.use(logger('dev'));
app.use(helmet());




// Setting up database connection
mongoose
  .connect("mongodb://localhost:27017/IMS", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to Database: IMS");
  })
  .catch((err) => {
    console.log("Failed to Connect to Database");
    console.log(err);
  });



// Basic usage
app.use(session({
	secret: "local-secret",
	saveUninitialized: true,
	resave: false,
	proxy: true,
	cookie: {
		httpOnly: false,//true,
		secure: false,//true,
		maxAge: 1000 * 60 * 10
	},
	store: MongoStore.create({ mongoUrl: "mongodb://localhost:27017/IMS"}),
}));



// MIDDLEWARE


// ROUTES
const defaultRouter = require("./routes/defaultRouter");
// const loginRouter = require("./routes/loginRouter");
const registerRouter = require("./routes/registerRouter");
const { productRouter } = require("./routes/productRouter");
const { inventoryRouter } = require("./routes/inventoryRouter");
const { searchRouter } = require("./routes/searchRouter");



// Login Route
app.post("/login", async (req, res) => {

	clog('Logging In User', 0);
	
	try {
	  const user = await User.findOne({username: req.body.username}).lean();
	
	  clog(`${user && user.username}`, 1, "magenta");
	
	  if (user) {
		clog(`User found ... Comparing Passwords`, 1, "magenta");

		const result = await bcrypt.compare(req.body.password, user.password);
		if (result) {
			clog(`Password Matched`, 2, "green");
		  	req.session.clientId = user._id;

		  	req.session.save(() => {
				clog(`User ${user.username} Successfully Logged In`, 0);
				clog(`Session Issued`, 1, "magenta");
				clog(`Session ID: ${req.session.id}`, 2, "green");
				clog(`Session Client ID: ${req.session.clientId}`, 2, "green");
				clog('Session Cookie:', 2, "green");
				clog(req.session.cookie, 2);
				clog(`Session Cookie Max Age: ${req.session.cookie.maxAge}`, 2, "green");
			
				res.send(req.session);
		  	});
		  
		} else {
		  clog(`Password Did Not Match`, 2, "red");
		  res.status(401).send('Not Authorized');
		}
	  } else {
		clog(`User Does Not Exist`, 1, "red");
		res.status(404).send(`User ${req.body.username} does not exist`);
	  }



	} catch (err) {
	  console.log('error', err.name, err.stack, err.message);
	  res.send('Error');
	}
});

// Logout Route
app.get("/logout", async (req, res) => {
	req.session.destroy(err => {
		if(err) console.log(err);
		else {
			res.send('Logged Out Session Ended');
		}
	})
	  // const token = jwt.sign({id: user.username}, jwtSecret.secret);         
});
  

// // SESSION FILTER 
// app.use(async (req,res,next)=> {
	
// 	if (!req.session || !req.session.clientId) {
// 		const err = new Error("Session Expired or Does Not Exist");
// 		err.statusCode = 401;
// 		next(err);
// 	} else {
// 		const u = await User.findById(req.session.clientId);
// 		console.log(String(u._id) === req.session.clientId);
// 		if (String(u._id) === req.session.clientId) {
// 			next();
// 		} else {
// 			const err = new Error("Session is Invalid");
// 			err.statusCode = 401;
// 			next(err);
// 		}
// 	}	

// });

// app.use("/login", loginRouter);         // main login user routes  


// Adding my routers
app.use("/", defaultRouter);       		// default homepage
app.use("/register", registerRouter);   // main register user route
app.use("/products", productRouter);	// products api
app.use("/inventory", inventoryRouter);	// inventory api
app.use("/search", searchRouter);		// search api


// Default Route (Matches all others)
app.get("*", (req, res) => {
  res.send("404 - Unable to find requested page");
});

// Configure Port
const port = config.get("port") || 3000;

// Start Listening on the Port
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
