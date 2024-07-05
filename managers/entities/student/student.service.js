const StudentModel = require("./student.mongoModel");
const UserModel = require("../user/user.mongoModel");

const createStudent = async (adminId, student) => {
  const admin = await UserModel.findById(adminId);
  if (admin.school === undefined) {
    return { msg: "Admin Cant add students as he is not assigned to a school" };
  }
  if (admin.school.toString() !== student.school) {
    return { msg: "Admin isnt assigned to this school" };
  }
  const doc = await StudentModel.create(student);
  return doc;
};

const updateStudent = async (adminId, id, student) => {
  Object.keys(student).forEach((key) =>
    student[key] === undefined ? delete student[key] : {}
  );
  const admin = await UserModel.findById(adminId);
  if (admin.school === undefined) {
    return { msg: "Admin Cant add students as he is not assigned to a school" };
  }
  if (admin.school.toString() !== student.school) {
    return { msg: "Admin isnt assigned to this school" };
  }
  const doc = await StudentModel.updateOne(
    { _id: id },
    { $set: { ...student } }
  );
  return doc;
};

const deleteStudent = async (adminId, id) => {
  const admin = await UserModel.findById(adminId);
  const student = await StudentModel.findById(id);
  if (admin.school === undefined) {
    return {
      msg: "Admin Cant delete students as he is not assigned to a school",
    };
  }
  if (admin.school.toString() !== student.school.toString()) {
    return { msg: "Admin isnt assigned to this school" };
  }
  const doc = await StudentModel.deleteOne({ _id: id });
  return doc;
};

const getAllStudents = async (page, perPage) => {
  let limit = parseInt(perPage) || 10;
  let offset = (page - 1) * perPage || 0;
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
};

module.exports = {
  createStudent,
  updateStudent,
  deleteStudent,
  getAllStudents,
};
