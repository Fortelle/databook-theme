let sheet;

function addCSS(rule) {
  if (!sheet) {
    sheet = document.createElement("style");
    document.head.appendChild(sheet);
  }
  sheet.textContent += rule;
}

function parseHTML(str) {
  if (!str) {
    return null;
  }
  const tmp = document.createElement(null);
  tmp.innerHTML = str;
  return tmp.childNodes;
};

function showToast(data) {
  if (typeof data === 'string') {
    data = {
      text: data,
      closeButton: true,
    };
  }

  const position = 'topright';
  const defaultDelay = 5000;

  let toastBoard = document.querySelector(`.l-toast__${position}`);
  if (toastBoard == null) {
    toastBoard = parseHTML(`<div class="l-toast l-toast__${position}"></div>`)[0];
    document.querySelector('.l-body').append(toastBoard);
  }

  let html = '<div class="c-toast">';
  if (data.icon) {
    html += `<div class="c-toast__icon"><i class=" fas fa-${data.icon} fa-fw"></i></div>`;
  }
  html += `<div class="c-toast__text">${data.text}</div>`;
  if (data.closeButton) {
    html += `<div class="c-toast__close"></div>`;
  }
  html += `</div>`;

  const toast = parseHTML(html)[0];
  if (data.id) {
    toast.id = data.id;
  }

  if (data.closeButton) {
    toast.querySelector('.c-toast__close').onclick = () => closeToast(toast);
  }

  if (data.autoClose) {
    const delay = data.autoClose === true ? defaultDelay : data.autoClose;
    setTimeout(() => closeToast(toast), delay);
  }

  toastBoard.append(toast);
};

function closeToast(toast) {
  if (!toast) {
    document.querySelectorAll(`.c-toast`).forEach(closeToast);
    return;
  }

  if (typeof toast === 'string') {
    toast = document.querySelector(`.c-toast[id="${toast}"]`);
  }
  if (!(toast instanceof HTMLElement)) {
    return;
  }
  if (toast.classList.contains('is-closing')) {
    return;
  }

  toast.classList.add('is-closing');
  setTimeout(() => {
    const toastBoard = toast.closest('.l-toast');
    toast.remove();
    if (toastBoard.children.length == 0) {
      toastBoard.remove();
    }
  }, 1000);
};

export default {
  addCSS,
  parseHTML,
  showToast,
  closeToast,
};