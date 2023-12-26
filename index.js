const express = require("express");
const morgan = require("morgan");
const expressRequestId = require("express-request-id")();
const cors = require("cors");
require("./src/services/db"); // init database
const { PORT } = require("./src/utils/config");
const logger = require("./src/utils/logger");

const app = express();

app.use((req, res, next) => {
  res.removeHeader("X-Powered-By");
  next();
});

app.use(expressRequestId);

morgan.token("requestId", request => request.id);

app.use(
  morgan(":requestId :method :url :status :response-time ms", {
    stream: {
      write: message => logger.http(message)
    }
  })
);

const rawBodySaver = (req, res, buf, encoding) => {
  if (buf && buf.length) {
    req.rawBody = buf.toString(encoding || "utf8");
  }
};

app.use(express.json({ verify: rawBodySaver, limit: "50mb" }));
app.use(
  express.urlencoded({ verify: rawBodySaver, extended: true, limit: "50mb" })
);
app.use(express.raw({ verify: rawBodySaver, type: "*/*", limit: "50mb" }));

const whitelist = [
  "http://localhost:3000",
  "https://localhost:3000",
  "https://d1zf20p8k1jjv8.cloudfront.net"
];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin
      // (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (whitelist.indexOf(origin) === -1) {
        return callback(
          new Error(
            "The CORS policy for this site does not allow access from the specified Origin."
          ),
          false
        );
      }

      return callback(null, true);
    },
    exposedHeaders: "x-access-token"
  })
);

const gyms = require("./src/controllers/v1/gyms");
const users = require("./src/controllers/v1/users");
const members = require("./src/controllers/v1/members");
const instructors = require("./src/controllers/v1/instructors");
const plans = require("./src/controllers/v1/plans");
const memberships = require("./src/controllers/v1/memberships");

// ROUTES
app.use("/v1/gyms", gyms);
app.use("/v1/users", users);
app.use("/v1/members", members);
app.use("/v1/instructors", instructors);
app.use("/v1/plans", plans);
app.use("/v1/memberships", memberships);

app.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "Howdy!!!" });
});

app.listen(PORT, () => {
  try {
    logger.info(`App is now running on port ${PORT}!!!`);
  } catch (error) {
    logger.error("Failed to start server -> error : ", error);
  }
});
