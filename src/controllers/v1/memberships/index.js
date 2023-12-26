const express = require("express");

const router = express.Router();

const ListUseCase = require("../../../domain/memberships/ListUseCase");
const GetMembershipUseCase = require("../../../domain/memberships/GetMembershipUseCase");
const GetMembershipActivityUseCase = require("../../../domain/memberships/GetMembershipActivityUseCase");
const CreateMembershipActivityUseCase = require("../../../domain/memberships/CreateMembershipActivityUseCase");
const UpdateMembershipActivityUseCase = require("../../../domain/memberships/UpdateMembershipActivityUseCase");
const EnrollUseCase = require("../../../domain/memberships/EnrollUseCase");
const AuthenticationMiddleware = require("../../../middlewares/auth");

router.get(
  "/",
  AuthenticationMiddleware.authenticate.bind(),
  async (request, response) => {
    return await new ListUseCase(request, response).execute();
  }
);

router.get(
  "/:id",
  AuthenticationMiddleware.authenticate.bind(),
  async (request, response) => {
    return await new GetMembershipUseCase(request, response).execute();
  }
);

router.get(
  "/activity/:id",
  AuthenticationMiddleware.authenticate.bind(),
  async (request, response) => {
    return await new GetMembershipActivityUseCase(request, response).execute();
  }
);

router.post(
  "/activity",
  AuthenticationMiddleware.authenticate.bind(),
  async (request, response) => {
    return await new CreateMembershipActivityUseCase(
      request,
      response
    ).execute();
  }
);

router.put(
  "/activity",
  AuthenticationMiddleware.authenticate.bind(),
  async (request, response) => {
    return await new UpdateMembershipActivityUseCase(
      request,
      response
    ).execute();
  }
);

router.post(
  "/enroll",
  AuthenticationMiddleware.authenticate.bind(),
  async (request, response) => {
    return await new EnrollUseCase(request, response).execute();
  }
);

module.exports = router;
