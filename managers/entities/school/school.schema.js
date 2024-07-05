module.exports = {
  create: [
    {
      model: "name",
      required: true,
      path: "name",
      label: "name",
    },
    {
      model: "address",
      required: true,
      path: "address",
      label: "address",
    },
    {
      model: "phoneNumber",
      required: true,
      path: "phoneNumber",
      label: "phoneNumber",
    },
    {
      model: "noOfClassrooms",
      required: true,
      path: "noOfClassrooms",
      label: "noOfClassrooms",
    },
  ],

  update: [
    {
      model: "name",
      required: false,
      path: "name",
      label: "name",
    },
    {
      model: "address",
      required: false,
      path: "address",
      label: "address",
    },
    {
      model: "phoneNumber",
      required: false,
      path: "phoneNumber",
      label: "phoneNumber",
    },
    {
      model: "noOfClassrooms",
      required: false,
      path: "noOfClassrooms",
      label: "noOfClassrooms",
    },
  ],
};
