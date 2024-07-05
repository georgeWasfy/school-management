const { createUser, loginUser } = require("./user.service");

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
    this.tokenManager = managers.token;
    this.userExposed = ["post=signup", "post=login"];
  }

  async signup({ username, email, password, school, role, phoneNumber }) {
    const user = { username, email, password, school, role, phoneNumber };

    // Data validation
    let result = await this.validators.user.create(user);
    if (result) return result;

    // Creation Logic
    let createdUser = await createUser(user);
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
};
