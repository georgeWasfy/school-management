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
    let result = await this.validators.student.create(student);
    if (result) return result;

    // Creation Logic
    let createdStudent = await createStudent(adminId, student);
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
    let result = await this.validators.student.update(student);
    if (result) return result;

    const res = await updateStudent(adminId, query.id, student);

    // Response
    return {
      msg: res.msg || "updated succesfully",
    };
  }

  async delete(req) {
    const query = req.__query;
    const token = req.__token;
    const adminId = token.userId;
    if (!query.id) {
      throw new Error("A query param id must be provided");
    }

    const deleted = await deleteStudent(adminId, query.id);

    // Response
    return {
      msg: deleted.msg || "deleted succesfully",
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
      students: {...allStudent},
    };
  }
};
