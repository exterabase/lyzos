var titles = [
  "@",
  "@l",
  "@ly",
  "@lyz",
  "@lyzo",
  "@lyzos",
  "@lyzos♥︎",
  "@lyzos",
  "@lyzo",
  "@lyz",
  "@ly",
  "@l",
  "@",
];

function changeTitle() {
  var index = 0;

  setInterval(function() {
      document.title = titles[index];
      index = (index + 1) % titles.length;
  }, 1000);
}

changeTitle();
