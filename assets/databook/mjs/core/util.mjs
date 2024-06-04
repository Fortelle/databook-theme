let sheet;

function addCSS(rule) {
  if (!sheet) {
    sheet = document.createElement("style");
    document.head.appendChild(sheet);
  }
  sheet.textContent += rule;
}

export default {
  addCSS,
}
