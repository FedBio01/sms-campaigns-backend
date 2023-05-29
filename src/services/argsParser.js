const commander = require("commander");
function argParser() {
  const program = new commander.Command();

  program.option("-c, --config <value>", "configuration file path");

  program.parse(process.argv);

  const options = program.opts();
  console.log(`server started using configuration file: ${options.config}`);
  return options.config;
}
module.exports = argParser();
