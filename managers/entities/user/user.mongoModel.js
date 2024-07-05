const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const validateEmail = function (email) {
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};
const usersSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 20,
  },
  role: {
    type: String,
    enum: ["ADMIN", "SUPERADMIN"],
    },
  password: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 300,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: "Email address is required",
    validate: [validateEmail, "Please fill a valid email address"],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address",
    ],
  },
  phoneNumber: {
    type: String,
    maxlength: 11,
    unique: true,
    required: true
  },
  school: {type: mongoose.Types.ObjectId, ref: "schools"}
});

// Method to generate a hash from plain text
usersSchema.methods.createHash = async function (plainTextPassword) {
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  return await bcrypt.hash(plainTextPassword, salt);
};

// Validating the candidate password with stored hash and hash function
usersSchema.methods.validatePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Create a Mongoose model based on the schema
const UserModel = mongoose.model("users", usersSchema);

// Export the model
module.exports = UserModel;
