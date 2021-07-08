const mongooose = require("mongoose");

const userSchema = new mongooose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
});


const User = new mongooose.model("User", userSchema);

module.exports = User;
