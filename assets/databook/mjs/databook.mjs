import component from './core/component.mjs';
import config from './core/config.mjs';
import loader from './core/loader.mjs';
import localStorage from './core/localstorage.mjs';
import util from './core/util.mjs';

const databook = window.databook = {
  component,
  config,
  event: new EventTarget(),
  loader,
  localStorage,
  util,

  get isDebug() {
    return document.documentElement.classList.contains('is-debug');
  },

  set isDebug(bool) {
    document.documentElement.classList.toggle('is-debug', bool);
  },

  debug(message, ...details) {
    if (!this.isDebug) {
      return;
    }

    util.showToast({
      icon: 'flask',
      text: message,
      autoClose: 1000,
    });

    console.log(message, ...details);
  },
};

document.addEventListener("DOMContentLoaded", () => {
  config.load();

  window.dispatchEvent(new CustomEvent("databookloading"));
  databook.event.dispatchEvent(new CustomEvent("loaded"));
  window.dispatchEvent(new CustomEvent("databookloaded"));
});

export default databook;