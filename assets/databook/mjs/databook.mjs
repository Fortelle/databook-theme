import component from './core/component.mjs';
import config from './core/config.mjs';
import loader from './core/loader.mjs';
import util from './core/util.mjs';

const databook = window.databook = {
  component,
  config,
  event: new EventTarget(),
  loader,
  util,
};

document.addEventListener("DOMContentLoaded", () => {
  config.load();

  window.dispatchEvent(new CustomEvent("databookloading"));
  databook.event.dispatchEvent(new CustomEvent("loaded"));
  window.dispatchEvent(new CustomEvent("databookloaded"));
});
