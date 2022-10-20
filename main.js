const plib = require('path');
const fs = require('fs');

function main() {

  // nwjs changes PWD. This is surprising, so change it back
  process.chdir(nw.App.startPath);

  // Invoke provided module
  const floc = parseArgs(nw.App.argv);
  require(floc);

}


const defaultConfigLoc = plib.resolve(__dirname, 'example/example.js');

function parseArgs(argv) {
  if (
    ![0, 1, 2].includes(argv.length)
    || argv.includes('-h')
    || argv.includes('--help')
  ) {
    help();
  }

  let configLoc = nw.App.argv[1];

  if (!configLoc) {
    console.info(`No config provided; defaulting to ${defaultConfigLoc}`);
    configLoc = defaultConfigLoc;
  }

  try {
    configLoc = plib.resolve(process.cwd(), configLoc);
  } catch (e) {
    abort(`Supplied argument '${configLoc}' must be a path`);
  }

  if (!fs.existsSync(configLoc))
    abort(`Supplied path '${configLoc}' does not exist`);

  return configLoc;
}

function help() {
  console.log(String.raw`

Nifty launcher

USAGE:


  nifty [<path-to-config>]

    Run Nifty with the specified configuration.

    If no configuration is provided, defaults to the following:

      ${defaultConfigLoc}

    This default configuration is a good kickoff point for creating
    your own custom config! Start with something like:

      $ cp -r ${plib.dirname(defaultConfigLoc)} ./.
      $ nifty ./${plib.join(plib.basename(plib.dirname(defaultConfigLoc)), plib.basename(defaultConfigLoc))}


  nifty [-h|--help]

    Show this help text


`);
  abort();
}

function abort(str) {
  str && console.error(str);
  nw.App.quit();
}


main();
