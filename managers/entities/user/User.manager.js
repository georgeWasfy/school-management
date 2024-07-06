const { createUser, loginUser, assignSchool } = require("./user.service");

module.exports = class UserManager {
  constructor({
    utils,
    cache,
    config,
    cortex,
    managers,
    validators,
    mongomodels,
  } = {}) {
    this.config = config;
    this.cortex = cortex;
    this.validators = validators;
    this.mongomodels = mongomodels;
    this.managers = managers;
    this.tokenManager = managers.token;
    this.userExposed = ["post=signup", "post=login", "post=assignSchool"];
  }

  async signup({
    username,
    email,
    password,
    school,
    role,
    phoneNumber,
    ...rest
  }) {
    const user = { username, email, password, school, role, phoneNumber };

    // Data validation
    let result = await this.validators.user.create(user);
    if (result) return result;

    // Creation Logic
    let [err, createdUser] = await createUser(user);
    if (err) {
      return {
        selfHandleResponse: this.managers.responseDispatcher.dispatch(
          rest.res,
          err
        ),
      };
    }
    let longToken = this.tokenManager.genLongToken({
      userId: createdUser._id,
      userKey: createdUser.role,
    });

    // Response
    return {
      user: createdUser,
      longToken,
    };
  }

  async login({ email, password }) {
    const user = { email, password };

    // Data validation
    let result = await this.validators.user.login(user);
    if (result) return result;

    // Creation Logic
    let userFound = await loginUser(user);
    if (!userFound) {
      return {
        msg: "Email or Password incorrect",
      };
    }
    let longToken = this.tokenManager.genLongToken({
      userId: userFound._id,
      userKey: userFound.role,
    });

    // Response
    return {
      user: userFound,
      longToken,
    };
  }

  async assignSchool({ user, school, ...rest }) {
    const body = { user, school };

    // Data validation
    let result = await this.validators.user.assignSchool(body);
    if (result) return result;

    // Creation Logic
    let [err, updatedUser] = await assignSchool(user, school);
    if (err) {
      return {
        selfHandleResponse: this.managers.responseDispatcher.dispatch(
          rest.res,
          err
        ),
      };
    }

    // Response
    return { msg: "Admin assigned to the school" };
  }
};
