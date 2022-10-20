const plib = require('path');

exports.run =
function(client) {

  nw.Window.open('index.html', {
    id: "nifty",
    title: "Nifty!",
    always_on_top: true,
    transparent: true,
    frame: false,
    width: 800,
    height: 600,
    resizable: false,
  }, win => {

    win.window._client = client;

  });

}
