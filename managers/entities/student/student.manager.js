const {
  createStudent,
  updateStudent,
  deleteStudent,
  getAllStudents,
} = require("./student.service");

module.exports = class StudentManager {
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
    this.managers = managers;
    this.userExposed = [
      "post=create",
      "patch=update",
      "delete=delete",
      "get=list",
    ];
  }

  async create({ name, email, school, ...rest }) {
    const token = rest.__token;
    const adminId = token.userId;
    const student = { name, email, school };

    // Data validation
    let validationResult = await this.validators.student.create(student);
    if (validationResult) return validationResult;

    // Creation Logic
    let [err, createdStudent] = await createStudent(adminId, student);
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
      student: createdStudent,
    };
  }

  async update({ name, email, school, ...rest }) {
    const query = rest.__query;
    const student = { name, email, school };
    const token = rest.__token;
    const adminId = token.userId;
    if (!query.id) {
      throw new Error("A query param id must be provided");
    }
    // Data validation
    let validationResult = await this.validators.student.update(student);
    if (validationResult) return validationResult;

    const [err, response] = await updateStudent(adminId, query.id, student);

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
    const token = req.__token;
    const adminId = token.userId;
    if (!query.id) {
      throw new Error("A query param id must be provided");
    }

    const [err, deleted] = await deleteStudent(adminId, query.id);
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
    let allStudent = await getAllStudents(page, perPage);

    // Response
    return {
      students: { ...allStudent },
    };
  }
};
