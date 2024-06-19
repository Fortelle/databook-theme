const configs = {};

const get = function (key, def = '') {
  return configs[key.toLowerCase()] ?? def;
};

const set = function (key, value) {
  configs[key.toLowerCase()] = value;
};

const load = function () {
  if (window.databookConfig === null || typeof window.databookConfig !== 'object') {
    return;
  }
  for (const [key, value] of Object.entries(window.databookConfig)) {
    set(key, value);
  }
};

export default {
  get,
  set,
  load,
};