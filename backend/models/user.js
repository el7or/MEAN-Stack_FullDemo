const { Schema, model } = require('mongoose');
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    //required: true
  },
  description: {
    type: String,
    //required: true
  },
  roleId: {
    type: Schema.Types.ObjectId,
    ref: 'Role',
    //required: true
  },
  imageUrl: String,
  resetToken: String,
  resetTokenExpiration: Date
});

userSchema.plugin(uniqueValidator);

module.exports = model('User', userSchema);
