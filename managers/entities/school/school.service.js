const SchoolModel = require("./school.mongoModel");

const createSchool = async (school) => {
  const doc = await SchoolModel.create(school);
  return doc;
};

const updateSchool = async (id, school) => {
  Object.keys(school).forEach((key) =>
    school[key] === undefined ? delete school[key] : {}
  );
  const doc = await SchoolModel.updateOne({ _id: id }, { $set: { ...school } });
  return doc;
};

const deleteSchool = async (id) => {
  const doc = await SchoolModel.deleteOne({ _id: id });
  return doc;
};

const getAllSchools = async (page, perPage) => {
  let limit = parseInt(perPage) || 10;
  let offset = (page - 1) * perPage || 0;

  const docCount = await SchoolModel.collection.countDocuments();

  const docs = await SchoolModel.find().skip(offset).limit(limit);
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
  createSchool,
  updateSchool,
  deleteSchool,
  getAllSchools,
};
