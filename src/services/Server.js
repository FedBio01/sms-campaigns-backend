const http = require("http");
const argParser = require("./argsParser");
const configuration = require(`${argParser}`);
const port = configuration["server-port"];
const express = require("express");

const errorHandler = require("../routing/middleware/errorHandler.js");
const requestLogger = require("../routing/middleware/requestLogger.js");
const bodyParser = require("body-parser");
const apiRouter = require("../routing");
const cors = require("cors");
class Server {
  constructor() {
    this.app = express();
  }
  init() {
    this.app.use(cors());
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(requestLogger);
    this.app.use("/api", apiRouter);
    this.app.use(errorHandler);
    const server = http.createServer(this.app);
    server.listen(port, () => {
      console.log(`server listening on http://localhost:${port}`);
    });
  }
}
module.exports = new Server();
