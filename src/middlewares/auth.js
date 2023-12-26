const UsersModel = require("../models/Users");
const { decodeJWT } = require("../utils/jwt");

class AuthenticationMiddleware {
  // eslint-disable-next-line
  async authenticate(request, response, next) {
    try {
      const token = request.headers["x-access-token"];

      if (!token) {
        // eslint-disable-next-line
        throw {
          status: 401,
          success: false,
          message: "Invalid Request."
        };
      }

      const decodedJWT = decodeJWT(token);

      if (!decodedJWT || !decodedJWT.userId) {
        // eslint-disable-next-line
        throw {
          status: 401,
          success: false,
          message: "Invalid Token."
        };
      }

      const user = await UsersModel.findById(decodedJWT.userId).populate(
        "gym member instructor"
      );

      if (!user) {
        // eslint-disable-next-line
        throw {
          status: 401,
          error: true,
          message: "Access denied. User does not exist."
        };
      }

      request.user = user;
      request.userId = user._id;

      next();
    } catch (error) {
      return response
        .status(error.status)
        .json({ message: error.message, error: error.error });
    }
  }
}

module.exports = new AuthenticationMiddleware();
