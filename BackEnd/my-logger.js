const colors = require('colors');
require('dotenv').config();

function clog(output, level = 0,  color = "blue") {
    let tabString = "";
    for (let i = level; i > 0; i--) {
        tabString += '\t';
    }
    if (process.env.LOGGING !== "disabled") {
        console.log(tabString + colors[color]('%s'), output);
    }
}

module.exports = clog;