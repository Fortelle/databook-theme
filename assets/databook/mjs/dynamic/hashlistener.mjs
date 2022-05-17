const reg_exp = /^#(?:!{0,1}\/{0,1}(?<path>.*?)\/*){0,1}(?:\?(?<query>.+)){0,1}$/;

let changeCallback;

const listen = async function (callback) {
  changeCallback = callback;

  let data = readHash();
  await changeCallback(data);

  window.addEventListener('hashchange', onHashChange);
  window.addEventListener("popstate", onPopState);
}

const onHashChange = function (e) {
  window.history.replaceState({}, '');
}

const onPopState = async function (e) {
  let data = readHash();
  data.isHistory = !!(e?.state);
  data.isChanged = true;

  await changeCallback(data);
}

const readHash = function() {
  let hash = window.location.hash;
  let match = hash.match(reg_exp);

  let path = match?.groups.path ?? null;
  let query = match?.groups.query ? Object.fromEntries(new URLSearchParams(match.groups.query)) : null;

  let data = {
    path,
    query,
    isEmpty: !path && !query,
  };

  return data;
};

export default {
  listen,
};
