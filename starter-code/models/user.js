const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name : String,
  email : String,
  password : String,
  summary : String,
  imageUrl : String,
  company : String,
  jobTitle : String,
});
//TIMESTAMP???
const User = mongoose.model('User', userSchema);
module.exports = User;
