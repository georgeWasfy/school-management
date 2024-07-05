const UserModel = require("./user.mongoModel");

const createUser = async (user) => {
  const newUser = new UserModel({
    username: user.username,
    email: user.email,
    school: user.school,
    role: user.role,
    phoneNumber: user.phoneNumber,
  });

  const hashedPassword = await newUser.createHash(user.password);
  newUser.password = hashedPassword;

  // Save newUser object to database
  const doc = await newUser.save();
  return doc;
};

const loginUser = async (user) => {
  const foundUser = await UserModel.findOne({ email: user.email });
  const isValid = await foundUser.validatePassword(user.password);
  if (!isValid) {
    return undefined;
  }
  return foundUser;
};

const isUserExist = async (userId) => {
  const admin = await UserModel.findById(userId);
  if (admin) {
    return [null, admin];
  }
  return [{ ok: false, code: 404, message: "User Not Found" }, null];
};
module.exports = {
  createUser,
  loginUser,
  isUserExist,
};
