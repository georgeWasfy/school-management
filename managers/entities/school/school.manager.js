const {
  createSchool,
  updateSchool,
  deleteSchool,
  getAllSchools,
} = require("./school.service");
module.exports = class School {
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
    this.schoolsCollection = "schools";
    this.userExposed = [
      "post=create",
      "patch=update",
      "delete=delete",
      "get=list",
    ];
  }

  async create({ name, address, phoneNumber, noOfClassrooms, ...rest }) {
    const school = { name, address, phoneNumber, noOfClassrooms };

    // Data validation
    let result = await this.validators.school.create(school);
    if (result) return result;

    // Creation Logic
    let [err, createdSchool] = await createSchool(school);
    if (err) {
      return {
        selfHandleResponse: this.managers.responseDispatcher.dispatch(
          rest.res,
          err
        ),
      };
    }

    // Response
    return {
      school: createdSchool,
    };
  }

  async update({ name, address, phoneNumber, noOfClassrooms, ...rest }) {
    const query = rest.__query;
    const school = { name, address, phoneNumber, noOfClassrooms };
    if (!query.id) {
      throw new Error("A query param id must be provided");
    }
    // Data validation
    let result = await this.validators.school.update(school);
    if (result) return result;

    const [err, doc] = await updateSchool(query.id, school);
    if (err) {
      return {
        selfHandleResponse: this.managers.responseDispatcher.dispatch(
          rest.res,
          err
        ),
      };
    }
    // Response
    return {
      msg: "updated succesfully",
    };
  }

  async delete(req) {
    const query = req.__query;
    if (!query.id) {
      throw new Error("A query param id must be provided");
    }

    const [err, doc] = await deleteSchool(query.id);
    if (err) {
      return {
        selfHandleResponse: this.managers.responseDispatcher.dispatch(
          rest.res,
          err
        ),
      };
    }
    // Response
    return {
      msg: "deleted succesfully",
    };
  }

  async list(req) {
    const query = req.__query;
    let page = undefined;
    let perPage = undefined;
    if (query.page && query.perPage) {
      page = query.page;
      perPage = query.perPage;
    }
    let [err, allSchools] = await getAllSchools(page, perPage);
    if (err) {
      return {
        selfHandleResponse: this.managers.responseDispatcher.dispatch(
          rest.res,
          err
        ),
      };
    }
    // Response
    return {
      schools: { ...allSchools },
    };
  }
};
