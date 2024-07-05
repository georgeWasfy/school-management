const ClassroomModel = require("./classroom.mongoModel");
const StudentModel = require("../student/student.mongoModel");
const { isUserExist } = require("../user/user.service");

const createClassroom = async (adminId, classroom) => {
  const { students, ...rest } = classroom;
  const [err, admin] = await isUserExist(adminId);
  if (err) return [err, null];
  if (admin.school === undefined) {
    return [
      {
        ok: false,
        code: 400,
        message: "Admin Cant add classrooms as he is not assigned to a school",
      },
      null,
    ];
  }
  if (admin.school.toString() !== classroom.school) {
    return [
      {
        ok: false,
        code: 400,
        message: "Admin isnt assigned to this school",
      },
      null,
    ];
  }
  const doc = await ClassroomModel.create(rest);
  if (students && students.length) {
    let existingStudents = await StudentModel.distinct("_id", {
      _id: { $in: students },
      school: rest.school,
    });
    if (students.length === existingStudents.length) {
      const updated = await ClassroomModel.updateOne(
        { _id: doc._id },
        { $set: { students } }
      );
      if (updated.modifiedCount) doc.students = students;
    }
  }

  return [null, doc];
};

const updateClassroom = async (adminId, id, classroom) => {
  Object.keys(classroom).forEach((key) =>
    classroom[key] === undefined ? delete classroom[key] : {}
  );
  const [err, admin] = await isUserExist(adminId);
  if (err) return [err, null];

  if (admin.school === undefined) {
    return [
      {
        ok: false,
        code: 400,
        message: "Admin Cant add classrooms as he is not assigned to a school",
      },
      null,
    ];
  }
  if (admin.school.toString() !== classroom.school) {
    return [
      {
        ok: false,
        code: 400,
        message: "Admin isnt assigned to this school",
      },
      null,
    ];
  }
  const doc = await ClassroomModel.updateOne(
    { _id: id },
    { $set: { ...classroom } }
  );
  return [err, doc];
};

const deleteClassroom = async (id) => {
  const [err, admin] = await isUserExist(adminId);
  if (err) return [err, null];

  const classroom = await ClassroomModel.findById(id);
  if (!classroom)
    return { ok: false, code: 404, message: "Classroom Not Found" };
  if (admin.school === undefined) {
    return [
      {
        ok: false,
        code: 400,
        message:
          "Admin Cant delete classroom as he is not assigned to a school",
      },
      null,
    ];
  }
  if (admin.school.toString() !== classroom.school.toString()) {
    return [
      {
        ok: false,
        code: 400,
        message: "Admin isnt assigned to this school",
      },
      null,
    ];
  }
  const doc = await ClassroomModel.deleteOne({ _id: id });
  return [null, doc];
};

const getAllClassrooms = async (page, perPage) => {
  let limit = parseInt(perPage) || 10;
  let offset = (page - 1) * perPage || 0;
  const docCount = await ClassroomModel.collection.countDocuments();

  const docs = await ClassroomModel.find().skip(offset).limit(limit);
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
  createClassroom,
  updateClassroom,
  deleteClassroom,
  getAllClassrooms,
};
