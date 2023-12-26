const express = require("express");

const router = express.Router();

const ListUseCase = require("../../../domain/plans/ListUseCase");
const GetPlanUseCase = require("../../../domain/plans/GetPlanUseCase");
const CreateUseCase = require("../../../domain/plans/CreateUseCase");
const UpdateUseCase = require("../../../domain/plans/UpdateUseCase");
const DeleteUseCase = require("../../../domain/plans/DeleteUseCase");
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
    return await new GetPlanUseCase(request, response).execute();
  }
);

router.post(
  "/",
  AuthenticationMiddleware.authenticate.bind(),
  async (request, response) => {
    return await new CreateUseCase(request, response).execute();
  }
);

router.put(
  "/",
  AuthenticationMiddleware.authenticate.bind(),
  async (request, response) => {
    return await new UpdateUseCase(request, response).execute();
  }
);

router.delete(
  "/",
  AuthenticationMiddleware.authenticate.bind(),
  async (request, response) => {
    return await new DeleteUseCase(request, response).execute();
  }
);

module.exports = router;
