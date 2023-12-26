const express = require("express");

const router = express.Router();

const GetCurrentUserUseCase = require("../../../domain/users/GetCurrentUserUseCase");
const SignUpUseCase = require("../../../domain/users/SignUpUseCase");
const SignInUseCase = require("../../../domain/users/SignInUseCase");
const GetStatsUseCase = require("../../../domain/users/GetStatsUseCase");
const GetActivityUseCase = require("../../../domain/users/GetActivityUseCase");
const AuthenticationMiddleware = require("../../../middlewares/auth");

router.get(
  "/me",
  AuthenticationMiddleware.authenticate.bind(),
  async (request, response) => {
    return await new GetCurrentUserUseCase(request, response).execute();
  }
);

router.post("/signup", async (request, response) => {
  return await new SignUpUseCase(request, response).execute();
});

router.post("/signin", async (request, response) => {
  return await new SignInUseCase(request, response).execute();
});

router.get(
  "/stats",
  AuthenticationMiddleware.authenticate.bind(),
  async (request, response) => {
    return await new GetStatsUseCase(request, response).execute();
  }
);

router.get(
  "/activity",
  AuthenticationMiddleware.authenticate.bind(),
  async (request, response) => {
    return await new GetActivityUseCase(request, response).execute();
  }
);

module.exports = router;
