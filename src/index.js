const db = require("./services/DataBase");
const server = require("./services/Server");

const main = async () => {
  db.connection();
  server.init();
};

main().catch((e) => {
  console.error(e);
  db.closeConnection();
});
