const express = require("express");

const router = express.Router();

const ListUseCase = require("../../../domain/gyms/ListUseCase");
const GetProfileUseCase = require("../../../domain/gyms/GetProfileUseCase");
const GetTeamUseCase = require("../../../domain/gyms/GetTeamUseCase");
const GetLocationsUseCase = require("../../../domain/gyms/GetLocationsUseCase");
const OnboardUseCase = require("../../../domain/gyms/OnboardUseCase");
const CreateGymActivityUseCase = require("../../../domain/gyms/CreateGymActivityUseCase");
const UpdateProfileUseCase = require("../../../domain/gyms/UpdateProfileUseCase");
const InviteAdminUseCase = require("../../../domain/gyms/InviteAdminUseCase");
const UpdateLocationsUseCase = require("../../../domain/gyms/UpdateLocationsUseCase");
const AuthenticationMiddleware = require("../../../middlewares/auth");

router.get("/", async (request, response) => {
  return await new ListUseCase(request, response).execute();
});

router.get(
  "/profile",
  AuthenticationMiddleware.authenticate.bind(),
  async (request, response) => {
    return await new GetProfileUseCase(request, response).execute();
  }
);

router.get(
  "/team",
  AuthenticationMiddleware.authenticate.bind(),
  async (request, response) => {
    return await new GetTeamUseCase(request, response).execute();
  }
);

router.get(
  "/locations",
  AuthenticationMiddleware.authenticate.bind(),
  async (request, response) => {
    return await new GetLocationsUseCase(request, response).execute();
  }
);

router.post("/onboard", async (request, response) => {
  return await new OnboardUseCase(request, response).execute();
});

router.post(
  "/activity",
  AuthenticationMiddleware.authenticate.bind(),
  async (request, response) => {
    return await new CreateGymActivityUseCase(request, response).execute();
  }
);

router.put(
  "/profile",
  AuthenticationMiddleware.authenticate.bind(),
  async (request, response) => {
    return await new UpdateProfileUseCase(request, response).execute();
  }
);

router.post(
  "/team/invite",
  AuthenticationMiddleware.authenticate.bind(),
  async (request, response) => {
    return await new InviteAdminUseCase(request, response).execute();
  }
);

router.put(
  "/locations",
  AuthenticationMiddleware.authenticate.bind(),
  async (request, response) => {
    return await new UpdateLocationsUseCase(request, response).execute();
  }
);

module.exports = router;
