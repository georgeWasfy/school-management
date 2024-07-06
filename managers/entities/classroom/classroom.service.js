const ClassroomModel = require("./classroom.mongoModel");
const StudentModel = require("../student/student.mongoModel");
const { isUserExist } = require("../user/user.service");

const createClassroom = async (adminId, classroom) => {
  const { students, ...rest } = classroom;
  const [err, admin] = await isUserExist(adminId);
  if (err) return [err, null];
  const isAllowedError = isAdminActionAllowed(
    admin.school?.toString() || undefined,
    classroom.school
  );
  if (isAllowedError) return [isAllowedError, null];
  try {
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

const updateClassroom = async (adminId, id, classroom) => {
  Object.keys(classroom).forEach((key) =>
    classroom[key] === undefined ? delete classroom[key] : {}
  );
  const [err, admin] = await isUserExist(adminId);
  if (err) return [err, null];
  const isAllowedError = isAdminActionAllowed(
    admin.school?.toString() || undefined,
    classroom.school
  );
  if (isAllowedError) return [isAllowedError, null];
  try {
    const doc = await ClassroomModel.updateOne(
      { _id: id },
      { $set: { ...classroom } }
    );
    return [err, doc];
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

const deleteClassroom = async (id) => {
  const [err, admin] = await isUserExist(adminId);
  if (err) return [err, null];

  const classroom = await ClassroomModel.findById(id);
  if (!classroom) {
    return [{ ok: false, code: 404, message: "Classroom Not Found" }, null];
  }
  const isAllowedError = isAdminActionAllowed(
    admin.school?.toString() || undefined,
    classroom.school
  );
  if (isAllowedError) return [isAllowedError, null];
  try {
    const doc = await ClassroomModel.deleteOne({ _id: id });
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

const getAllClassrooms = async (page, perPage) => {
  let limit = parseInt(perPage) || 10;
  let offset = (page - 1) * perPage || 0;
  try {
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

const updateClassroomStudents = async (adminId, id, studentsUpdateObj) => {
  Object.keys(studentsUpdateObj).forEach((key) =>
    studentsUpdateObj[key] === undefined ? delete studentsUpdateObj[key] : {}
  );
  let classroom = await ClassroomModel.findById(id);
  if (!classroom)
    return [{ ok: false, code: 404, message: "Classroom Not Found" }, null];

  const [err, admin] = await isUserExist(adminId);
  if (err) return [err, null];

  const isAllowedError = isAdminActionAllowed(
    admin.school?.toString() || undefined,
    classroom.school?.toString()
  );
  if (isAllowedError) return [isAllowedError, null];

  try {
    const enrolledStudents = classroom.students;
    let newClassroom;
    switch (studentsUpdateObj.action) {
      case "APPEND":
        newClassroom = {
          ...classroom._doc,
          students: [
            ...new Set([...enrolledStudents, ...studentsUpdateObj.students]),
          ],
        };
        break;
      case "REPLACE":
        newClassroom = {
          ...classroom._doc,
          students: studentsUpdateObj.students,
        };

        break;
      case "DELETE":
        newClassroom = {
          ...classroom._doc,
          students: enrolledStudents.filter(function (item) {
            return studentsUpdateObj.students.indexOf(item.toString()) < 0;
          }),
        };

        break;

      default:
        break;
    }
    const doc = await ClassroomModel.updateOne(
      { _id: id },
      { $set: { ...newClassroom } }
    );
    return [err, doc];
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

////////////////////HELPERS////////////////////////////////////////////
const isAdminActionAllowed = (adminSchoolId, classroomSchoolId) => {
  if (adminSchoolId === undefined) {
    return {
      ok: false,
      code: 400,
      message: "Admin Cant add classrooms as he is not assigned to a school",
    };
  }
  if (adminSchoolId !== classroomSchoolId) {
    return {
      ok: false,
      code: 400,
      message: "Admin isnt assigned to this school",
    };
  }
};
module.exports = {
  createClassroom,
  updateClassroom,
  deleteClassroom,
  getAllClassrooms,
  updateClassroomStudents,
};
