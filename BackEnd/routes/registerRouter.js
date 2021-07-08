const express = require("express");
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const registerRouter = express.Router();



registerRouter.post("/", async (req, res) => {
    try {
        const user = await User.findOne({username: req.body.username});
        if (user) {
            res.send(`User ${req.body.username} already exists`);
        } else {
            const hashPass = await bcrypt.hash(req.body.password, 10);
            const newUser = new User({
                username: req.body.username,
                password: hashPass,
            })
            await newUser.save();
            res.send(`Successfully Registered User ${req.body.username}`);
        }
    } catch(err) {
        console.error(err);
        res.status(500);
    }
});

registerRouter.get("/", async (req, res) => {
    try {
        const users = await User.find({});
        res.send(users);
    } catch (err) {
        console.error(err);
        res.status(500);
    }
});


registerRouter.delete("/", async (req, res) => {
    try {
        await User.deleteMany({});
        res.send("success");
    } catch (err) {
        console.log(err);
        res.send("error", err);
    }
});

module.exports = registerRouter;
