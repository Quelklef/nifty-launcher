const items = [];
exports.items = items;

const proc = require('child_process');
const plib = require('path');

// Run a bash command
function exec(str) {
  const child = proc.spawn(
    '/usr/bin/env',
    ['bash', '-c', str],
    {
      detached: true,
      stdio: 'ignore',
    }
  );
  child.unref();
}

items.push({
  text: 'Firefox',
  exec: function() {
    exec('firefox');
  },
  icon: 'file://' + plib.resolve(__dirname, './icons/firefox.png'),
});

items.push({
  text: 'Chrome',
  exec: function() {
    exec('google-chrome-stable');
  },
  icon: 'file://' + plib.resolve(__dirname, './icons/chrome.png'),
});
