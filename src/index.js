const db = require("./services/DataBase");
const server = require("./services/Server");
const smsGate = require("./services/SmsGate");

const main = async () => {
  db.connection();
  // smsGate.connect();
  server.init();
};

main().catch((e) => {
  console.error(e);
  db.closeConnection();
});
