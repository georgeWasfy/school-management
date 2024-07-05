module.exports = {
  create: [
    {
      model: "name",
      required: true,
      path: "name",
      label: "name",
    },
    {
      model: "email",
      required: true,
      path: "email",
      label: "email",
    },
    {
      model: "school",
      required: true,
      path: "school",
      label: "school",
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
      model: "email",
      required: false,
      path: "email",
      label: "email",
    },
    {
      model: "school",
      required: false,
      path: "school",
      label: "school",
    },
  ],
};
