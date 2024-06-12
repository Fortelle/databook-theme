const get = function (key, def) {
  key = key.toLowerCase();
  if (localStorage.hasOwnProperty(key)) {
    try {
      let value = localStorage.getItem(key);
      let obj = JSON.parse(value);
      return obj;
    } catch (error) {
    }
  }
  return def;
};

const getAs = function (key, type) {
  let obj = get(key);
  let cls = new type();
  if (obj) {
    Object.assign(cls, obj);
  }
  return cls;
};

const set = function (key, value) {
  key = key.toLowerCase();
  let text = JSON.stringify(value);
  localStorage.setItem(key, text);
}

const remove = function (key) {
  key = key.toLowerCase();
  localStorage.removeItem(key);
}

export default {
  get,
  getAs,
  set,
  remove,
}
