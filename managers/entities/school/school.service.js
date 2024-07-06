const SchoolModel = require("./school.mongoModel");

const createSchool = async (school) => {
  try {
    const doc = await SchoolModel.create(school);
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

const updateSchool = async (id, school) => {
  Object.keys(school).forEach((key) =>
    school[key] === undefined ? delete school[key] : {}
  );
  try {
    const doc = await SchoolModel.updateOne(
      { _id: id },
      { $set: { ...school } }
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

const deleteSchool = async (id) => {
  try {
    const doc = await SchoolModel.deleteOne({ _id: id });
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

const getAllSchools = async (page, perPage) => {
  let limit = parseInt(perPage) || 10;
  let offset = (page - 1) * perPage || 0;

  try {
    const docCount = await SchoolModel.collection.countDocuments();

    const docs = await SchoolModel.find().skip(offset).limit(limit);
    const result = {
      paging: {
        totalCount: docCount,
        page: offset,
        perPage: limit,
      },
      data: docs,
    };
    return [null, result];
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
  createSchool,
  updateSchool,
  deleteSchool,
  getAllSchools,
};
