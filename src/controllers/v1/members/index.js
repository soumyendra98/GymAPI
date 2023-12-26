const express = require("express");

const router = express.Router();

const ListUseCase = require("../../../domain/members/ListUseCase");
const InviteUseCase = require("../../../domain/members/InviteUseCase");
const AuthenticationMiddleware = require("../../../middlewares/auth");

router.get(
  "/",
  AuthenticationMiddleware.authenticate.bind(),
  async (request, response) => {
    return await new ListUseCase(request, response).execute();
  }
);

router.post(
  "/invite",
  AuthenticationMiddleware.authenticate.bind(),
  async (request, response) => {
    return await new InviteUseCase(request, response).execute();
  }
);

module.exports = router;
