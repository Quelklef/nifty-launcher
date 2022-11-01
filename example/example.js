const plib = require('path');
const nifty = require('nifty');

const util = require('./util.js');

const pathEntries = Array.from(util.getPATH());

nifty.run(query => {

  let items = [];

  // Add a terminal launcher
  {
    const terminal = process.env.TERMINAL;
    items.push(nifty.lib.mkSimple({
      text: util.capitalize(terminal),
      exec: function() {
        // On select, run the "firefox" command
        util.exec(terminal);
      },
      icon: util.mkIcon('./icons/terminal.webp'),
    }));
  }

  // If query starts with '=', interpret it as a mathematical
  // expression and compute the result via `bc`.
  // On select, copy the result to clipboard
  if (query.startsWith('=')) {
    const expr = query.slice(1);
    let result;
    try {
      result = util.exec(`echo ${util.escapeForBash(expr)} | bc`, { capture: true });
    } catch (e) {
      // bad syntax, etc; ignore.
    }
    result = result ? (result + '') : '',
    items.push(nifty.lib.mkSimple({
      text: result,
      isSticky: true,
      exec: () => util.copyToClipboard(result),
    }));
  }

  // If query starts with '$', search PATH entries instead
  if (query.startsWith('$')) {
    query = query.slice(1);
    items = pathEntries.map(({ name, path }) =>
      nifty.lib.mkSimple({
        text: name,
        exec: () => util.exec(path),
      })
    );
  }

  // Sort the items according to the query
  items = nifty.lib.sort(items, query);

  // Show only the first six
  items = items.slice(0, 6);

  // Return!
  return items;

});
