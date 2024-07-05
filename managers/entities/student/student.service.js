const StudentModel = require("./student.mongoModel");
const { isUserExist } = require("../user/user.service");

const createStudent = async (adminId, student) => {
  const [err, admin] = await isUserExist(adminId);
  if (err) return [err, null];

  if (admin.school === undefined) {
    return [
      {
        ok: false,
        code: 400,
        message: "Admin Cant add students as he is not assigned to a school",
      },
      null,
    ];
  }
  if (admin.school.toString() !== student.school) {
    return [
      {
        ok: false,
        code: 400,
        message: "Admin isnt assigned to this school",
      },
      null,
    ];
  }
  try {
    const doc = await StudentModel.create(student);
    return [null, doc];
  } catch (error) {
    return [
      {
        ok: false,
        code: 400,
        message: error,
      },
      null,
    ];
  }
};

const updateStudent = async (adminId, id, student) => {
  Object.keys(student).forEach((key) =>
    student[key] === undefined ? delete student[key] : {}
  );
  const [err, admin] = await isUserExist(adminId);
  if (err) return [err, null];

  if (admin.school === undefined) {
    return [
      {
        ok: false,
        code: 400,
        message: "Admin Cant add students as he is not assigned to a school",
      },
      null,
    ];
  }
  if (admin.school.toString() !== student.school) {
    return [
      {
        ok: false,
        code: 400,
        message: "Admin isnt assigned to this school",
      },
      null,
    ];
  }
  try {
    const doc = await StudentModel.updateOne(
      { _id: id },
      { $set: { ...student } }
    );
    return [null, doc];
  } catch (error) {
    return [
      {
        ok: false,
        code: 400,
        message: error,
      },
      null,
    ];
  }
};

const deleteStudent = async (adminId, id) => {
  const [err, admin] = await isUserExist(adminId);
  if (err) return [err, null];

  const student = await StudentModel.findById(id);
  if (!student) {
    return [
      {
        ok: false,
        code: 404,
        message: "Student Not Found",
      },
      null,
    ];
  }
  if (admin.school === undefined) {
    return [
      {
        ok: false,
        code: 400,
        message: "Admin Cant delete students as he is not assigned to a school",
      },
      null,
    ];
  }
  if (admin.school.toString() !== student.school.toString()) {
    return [
      {
        ok: false,
        code: 400,
        message: "Admin isnt assigned to this school",
      },
      null,
    ];
  }
  try {
    const doc = await StudentModel.deleteOne({ _id: id });
    return [null, doc];
  } catch (error) {
    return [
      {
        ok: false,
        code: 400,
        message: error,
      },
      null,
    ];
  }
};

const getAllStudents = async (page, perPage) => {
  let limit = parseInt(perPage) || 10;
  let offset = (page - 1) * perPage || 0;
  try {
    const docCount = await StudentModel.collection.countDocuments();

    const docs = await StudentModel.find().skip(offset).limit(limit);
    return {
      paging: {
        totalCount: docCount,
        page: offset,
        perPage: limit,
      },
      data: docs,
    };
  } catch (error) {
    return [
      {
        ok: false,
        code: 400,
        message: error,
      },
      null,
    ];
  }
};

module.exports = {
  createStudent,
  updateStudent,
  deleteStudent,
  getAllStudents,
};
