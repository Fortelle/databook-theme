let sheet;

function addCSS(rule) {
  if (!sheet) {
    sheet = document.createElement("style");
    document.head.appendChild(sheet);
  }
  sheet.textContent += rule;
}

const parseHTML = function (str) {
  if (!str) {
    return null;
  }
  var tmp = document.createElement(null);
  tmp.innerHTML = str;
  return [...tmp.children];
};

export default {
  addCSS,
  parseHTML,
}
