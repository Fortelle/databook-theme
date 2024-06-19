const get = function (key, def) {
  key = key.toLowerCase();
  if (Object.hasOwn(localStorage, key)) {
    try {
      const value = localStorage.getItem(key);
      const obj = JSON.parse(value);
      return obj;
    } catch {}
  }
  return def;
};

const getAs = function (key, type) {
  const obj = get(key);
  const cls = new type();
  if (obj) {
    Object.assign(cls, obj);
  }
  return cls;
};

const set = function (key, value) {
  key = key.toLowerCase();
  const text = JSON.stringify(value);
  localStorage.setItem(key, text);
};

const remove = function (key) {
  key = key.toLowerCase();
  localStorage.removeItem(key);
};

export default {
  get,
  getAs,
  set,
  remove,
};
