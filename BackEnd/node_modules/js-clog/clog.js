const colors = require('colors');
require('dotenv').config();

function clog(output, color = "blue") {
    if (process.env.LOGGING !== "disabled") {
        console.log(colors[color]('%s'), output);
    }
}

module.exports = clog;