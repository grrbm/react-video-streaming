let mongoose = require("mongoose"),
  bcrypt = require("bcryptjs"),
  shortid = require("shortid"),
  Schema = mongoose.Schema;

let UserSchema = new Schema({
  username: String,
  email: String,
  password: String,
  stream_key: String,
});

// UserSchema.methods.generateStreamKey = () => {
//   return shortid.generate();
// };

module.exports = UserSchema;
