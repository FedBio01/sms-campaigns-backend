const commander = require("commander");
function argParser() {
  const program = new commander.Command();

  program.option(
    "-c, --config <value>",
    "option with an explicitly passed value"
  );

  program.parse(process.argv);

  const options = program.opts();
  console.log(options);

  if (options.config === "test") {
    return "../configurations/configurationTest.json";
  }
  return "../configurations/configuration.json";
}
module.exports = argParser();
