const express = require("express");
const defaultRouter = express.Router();



defaultRouter.get("/", (req,res) => {
    res.render('index');
});



module.exports = defaultRouter;
