const proc = require('child_process');
const plig = require('path');

/*

Execute a program or bash command

Four ways to call it:

  // Run a bash command and detach it
  exec('google-chrome 2>&1 1>$HOME/chrome-log');

  // Run a bash command and capture stdout as a string
  const stdout = exec('echo test', { capture: true })

  // Execute a utility and detach it
  exec(['/usr/bin/alacritty', '--config-file', '/home/me/alacritty.yaml'])

  // Execute a utility and capture stdout as a string
  const stdout = exec(
    ['/usr/bin/env', 'bash', '-c', 'echo test'],
    { capture: true },
  )

*/
exports.exec = function(theseArg, theseOpts = {}) {

  const thoseArgs = (
    typeof theseArg === 'string'
      ? ['/usr/bin/env', ['bash', '-i', '-c', theseArg]]
      : [theseArg]
  );

  if (theseOpts.capture) {
    return proc.spawnSync(...thoseArgs).stdout.toString();
  } else {
    proc.spawn(
      ...thoseArgs,
      {
        detached: true,
        stdio: ['ignore', 'inherit', 'inherit'],
      }
    ).unref();
  }

}


/* Use the NWjs API to copy some text to the system clipboard */
exports.copyToClipboard =
function(text) {
  nw.Clipboard.get().set(text);
}


/* Turn a local path into a file URI */
exports.mkIcon =
function(fname) {
  return 'file://' + plib.resolve(__dirname, fname);
}
