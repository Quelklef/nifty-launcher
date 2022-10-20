const plib = require('path');
const nifty = require('nifty');

const util = require('./util.js');

nifty.run(query => {

  // Our job is to build the list of search results
  // Call it 'items'
  let items = [];

  // First, we'll populate it with some standard items

  // A firefox launcher
  items.push(nifty.lib.mkSimple({
    text: 'Firefox',
    exec: function() {
      // On select, run the "firefox" command
      util.exec('firefox');
    },
    icon: util.mkIcon('./icons/firefox.png'),
  }));

  // A chrome launcher, too; why not?
  items.push(nifty.lib.mkSimple({
    text: 'Google Chrome',
    exec: function() {
      util.exec('google-chrome');
    },
    icon: util.mkIcon('./icons/chrome.png'),
  }));

  // A few dummy items
  const N = query === "!" ? 100 : "1";
  for (let n = 1; n <= N; n++) {
    items.push(nifty.lib.mkSimple({
      text: `Dummy item ${n}`,
      exec: function() {
        throw Error('oopsies');
      },
    }));
  }

  // If the query starts with an equals, we'll interpret
  // it as a javascript expression to evaluate.
  // Occasionally handy to, perhaps, quickly calculate sums
  if (query.startsWith('=')) {
    const expr = query.slice(1);

    let result;
    try {
      result = eval(expr);
    } catch (e) {
      // Will happen under normal circumstances, eg if
      // the user types '=5+' on the way to typing '=5+3'.
      // As such, ignore an error.
    }

    items.push(nifty.lib.mkSimple({
      text: result ? ('= ' + result) : '',
      isSticky: true,
    }));
  }

  // Sort the items according to the query
  items = nifty.lib.sort(items, query);

  // Show only the first six
  items = items.slice(0, 6);

  // Return!
  return items;

});
