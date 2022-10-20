
const plib = require('path');

// nwjs changes PWD. This is surprising, so change it back
process.chdir(nw.App.startPath);

// Invoke provided module
let floc = nw.App.argv[1];
if (!floc) throw Error('Expected a path');
floc = plib.resolve(process.cwd(), floc);
require(floc);

