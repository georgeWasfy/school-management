module.exports = ({ meta, config, managers }) => {
  const isSuperAdmin = (role) => {
    return role === "SUPERADMIN";
  };
  const isAdmin = (role) => {
    return role === "ADMIN";
  };
  return ({ req, res, next }) => {
    if (req.params.moduleName === "user") {
      return next();
    }
    if (!req.headers.token) {
      console.log("token required but not found");
      return managers.responseDispatcher.dispatch(res, {
        ok: false,
        code: 401,
        errors: "unauthorized",
      });
    }
    let decoded = null;
    try {
      decoded = managers.token.verifyLongToken({ token: req.headers.token });
      if (!decoded) {
        console.log("failed to decode-1");
        return managers.responseDispatcher.dispatch(res, {
          ok: false,
          code: 401,
          errors: "unauthorized",
        });
      }
    } catch (err) {
      console.log("failed to decode-2");
      return managers.responseDispatcher.dispatch(res, {
        ok: false,
        code: 401,
        errors: "unauthorized",
      });
    }
    switch (req.params.moduleName) {
      case "school":
        if (isSuperAdmin(decoded.userKey)) {
          return next(decoded);
        }
      case "classroom":
        if (isAdmin(decoded.userKey)) {
          return next(decoded);
        }
      case "student":
        if (isAdmin(decoded.userKey)) {
          return next(decoded);
        }
      default:
        break;
    }
    return managers.responseDispatcher.dispatch(res, {
      ok: false,
      code: 401,
      errors: "unauthorized",
    });
  };
};
