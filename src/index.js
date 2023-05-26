const bodyParser = require("body-parser");
const express = require("express");
const http = require("http");
const api = require("./routing");
const crtPath = require("./services/authorize");
const configuration = require("../configurations/configuration.json");
const loggers = require("./services/loggers");
const db = require("./services/DataBase");

const port = configuration["server-port"];
const app = express();
const server = http.createServer(app);

const main = async () => {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(loggers.requestLogger);

  db.connection();

  app.use("/api", api);
  app.use(loggers.errorLogger);

  server.listen(port, () => {
    console.log(`server listening on http://localhost:${port}`);
  });
};
main().catch((e) => {
  console.error(e);
  db.closeConnection();
});
