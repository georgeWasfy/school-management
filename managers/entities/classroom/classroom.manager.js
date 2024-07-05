const {
  createClassroom,
  updateClassroom,
  deleteClassroom,
  getAllClassrooms,
} = require("./classroom.service");

module.exports = class ClassroomManager {
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

  async create({ name, capacity, school, students, ...rest }) {
    const token = rest.__token;
    const adminId = token.userId;
    const classroom = { name, capacity, school, students };

    // Data validation
    let result = await this.validators.classroom.create(classroom);
    if (result) return result;

    // Creation Logic
    let [err, createdClassroom] = await createClassroom(adminId, classroom);
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
      classroom: createdClassroom,
    };
  }

  async update({ name, capacity, school, students, ...rest }) {
    const query = rest.__query;
    const classroom = { name, capacity, school, students };
    const token = rest.__token;
    const adminId = token.userId;
    if (!query.id) {
      throw new Error("Classroom Id must be provided");
    }
    // Data validation
    let validationResult = await this.validators.classroom.update(classroom);
    if (validationResult) return validationResult;

    const [err, result] = await updateClassroom(adminId, query.id, classroom);
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

  async delete({ req, ...rest }) {
    const query = req.__query;
    const token = req.__token;
    const adminId = token.userId;
    if (!query.id) {
      throw new Error("Classroom Id must be provided");
    }

    const [err, deleted] = await deleteClassroom(adminId, query.id);
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
    let allClassrooms = await getAllClassrooms(page, perPage);

    // Response
    return {
      classrooms: { ...allClassrooms },
    };
  }
};
