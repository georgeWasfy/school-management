const UserModel = require("./user.mongoModel");
const mongoose = require("mongoose");
const createUser = async (user) => {
  const newUser = new UserModel({
    username: user.username,
    email: user.email,
    school: user.school,
    role: user.role,
    phoneNumber: user.phoneNumber,
  });

  try {
    const hashedPassword = await newUser.createHash(user.password);
    newUser.password = hashedPassword;

    // Save newUser object to database
    const doc = await newUser.save();
    return [null, doc];
  } catch (error) {
    return [{ ok: false, code: 400, message: error }, null];
  }
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

const assignSchool = async (adminId, school) => {
  const [err, admin] = await isUserExist(adminId);
  if (err) {
    return [err, null];
  }
  try {
    const updated = await UserModel.updateOne(
      { _id: adminId },
      { $set: { school } }
    );
    if (updated) {
      return [null, updated];
    }
  } catch (error) {
    console.log("🚀 ~ assignSchool ~ error:", error);
    return [{ ok: false, code: 400, message: error }, null];
  }
};

module.exports = {
  createUser,
  loginUser,
  isUserExist,
  assignSchool,
};
