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
    this.tokenManager = managers.token;
    this.schoolsCollection = "schools";
    this.userExposed = [
      "post=create",
      "patch=update",
      "delete=delete",
      "get=list",
    ];
  }

  async create({ name, address, phoneNumber, noOfClassrooms }) {
    const school = { name, address, phoneNumber, noOfClassrooms };

    // Data validation
    let result = await this.validators.school.create(school);
    if (result) return result;

    // Creation Logic
    let createdSchool = await createSchool(school);

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

    await updateSchool(query.id, school);

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

    await deleteSchool(query.id);

    // Response
    return {
      msg: "deleted succesfully",
    };
  }

  async list(req) {
    const query = req.__query;
    let page = undefined
    let perPage = undefined
    if (query.page && query.perPage) {
      page = query.page
      perPage = query.perPage
    }
    let allSchools = await getAllSchools(page, perPage);

    // Response
    return {
      schools: { ...allSchools },
    };
  }
};
