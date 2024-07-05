module.exports = {
  create: [
    {
      model: "username",
      required: true,
      path: "username",
      label: "username",
    },
    {
      model: "email",
      required: true,
      path: "email",
      label: "email",
    },
    {
      model: "password",
      required: true,
      path: "password",
      label: "password",
    },
    {
      model: "role",
      required: true,
      path: "role",
      label: "role",
    },
    {
      model: "phoneNumber",
      required: true,
      path: "phoneNumber",
      label: "phoneNumber",
    },
  ],
  login: [
    {
      model: "email",
      required: true,
      path: "email",
      label: "email",
    },
    {
      model: "password",
      required: true,
      path: "password",
      label: "password",
    },
  ],
};
