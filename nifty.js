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


// == lib ==  //

const Fuse = require('fuse.js');

const lib =
exports.lib = {

  sort(items, query) {
    const sticky = items.filter(item => item.isSticky);
    const nonsticky = items.filter(item => !item.isSticky);

    const stickySorted = fuzzySort(sticky, 'searchText', query);
    const nonstickySorted = fuzzySort(nonsticky, 'searchText', query);

    return [].concat(stickySorted, nonstickySorted);
  },

  mkSimple({
    text,
    exec,
    icon,
    isSticky,
  }) {
    return lib.mkItem({
      displayText: text,
      searchText: text,
      exec,
      icon,
      isSticky,
    })
  },

  mkItem({
    displayText,
    searchText,
    exec,
    isSticky,
    icon
  }) {
    return {
      displayText,
      searchText,
      exec: exec || (() => {}),
      isSticky: isSticky || false,
      render({ document, isSelected }) {
        const $item = document.createElement('div');
        $item.classList.add('item');
        if (isSelected) $item.classList.add('selected');

        if (icon !== null && icon !== undefined) {
          const $icon = document.createElement('img');
          $item.append($icon);
          $icon.classList.add('item-icon');
          const blankImg = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
          $icon.src = icon ?? blankImg;
        }

        const $text = document.createElement('span');
        $item.append($text);
        $text.classList.add('item-text');
        if (displayText.trim() !== '')
          $text.innerText = displayText;
        else
          $text.innerHTML = '&nbsp;';

        return $item;
      },
    };
  },

};

function fuzzySort(items, key, query) {

  // sort
  const fuse = new Fuse(items, {
    keys: [key],
    minMatchCharLength: 0,
  });
  let result = fuse.search(query);
  result = result.map(el => el.item);

  // re-add removed items
  const keys = new Set(result.map(item => item[key]));
  for (const item of items) {
    if (!keys.has(item[key]))
      result.push(item);
  }

  return result;

}
