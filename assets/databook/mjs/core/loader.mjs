import config from './config.mjs';

const cacheinfo_key = "cacheinfo";
const cacheinfo = JSON.parse(localStorage.getItem(cacheinfo_key) ?? "{}");

function compareVersions(version1, version2) {
  let v1parts = version1.split('.');
  let v2parts = version2.split('.');
  let length = Math.max(v1parts.length, v2parts.length);
  for (var i = 0; i < length; i++) {
    let diff = ~~v1parts[i] - ~~v2parts[i];
    if (diff) {
      return Math.sign(diff);
    }
  }
  return 0;
}

function checkCache(info, options) {
  if (info == null) return false;

  if (options.forceRefresh) return false;

  if (info.lifetime || options.lifetime) {
    let lifetime = Math.min.apply(null, [info.lifetime, options.lifetime].filter(Number));
    if (info.cachedtime + lifetime > Date.now()) return false;
  }

  if (options.version && compareVersions(options.version, info.version ?? '0') > 0) return false;

  return true;
}

const getAbsoluteUrl = function (url) {
  return new URL(url, document.baseURI).href;
};

const getJSON = async function (url) {
  let absUrl = getAbsoluteUrl(url);
  return fetch(absUrl, { mode: 'no-cors' })
    .then(response => response.json());
}

const getJSONs = async function (urlList) {
  return await Promise.all(urlList.map(getJSON));
}

const getCachedJSON = async function (url, options = {}) {
  let absUrl = getAbsoluteUrl(url);
  let info = cacheinfo[absUrl];
  let sitetime = new Date(config.get('generatedDate')).getTime();
  let useCache = checkCache(info, options);

  if (useCache) {
    let text = localStorage.getItem(absUrl);
    if (info.compressed == 'lz-string') {
      text = LZString.decompress(text);
    }
    try {
      let json = JSON.parse(text);
      return json;
    } catch (e) {
      throw e;
    }
  }

  let response = await fetch(absUrl, { mode: 'no-cors' });
  if (!response.ok) {
    throw new TypeError(`Failed to fetch url "${absUrl}" (${response.status} ${response.statusText}).`);
  }

  let text = await response.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch (error) {
    throw new TypeError(`Failed to parse json.`);
  }

  cacheinfo[absUrl] = {
    filetime: sitetime,
    cachedtime: Date.now(),
    compressed: 'lz-string',
  };
  if (options.version) cacheinfo[absUrl].version = options.version;
  text = LZString.compress(text);
  localStorage.setItem(absUrl, text);
  localStorage.setItem(cacheinfo_key, JSON.stringify(cacheinfo));
  
  return json;
}

const getCachedJSONs = async function (urlList) {
  return await Promise.all(urlList.map(getCachedJSON));
}

const getScript = async function (url) {
  let absUrl = getAbsoluteUrl(url);
  return import(absUrl);
}

const getScripts = async function (urlList) {
  return await Promise.all(urlList.map(getScript));
}

const getModule = async function (url) {
  return import(url);
}

const getModules = async function (urlList) {
  return await Promise.all(urlList.map(getModule));
}

const getCSS = async function (urlList) {
  urlList.forEach(url => {
    let absUrl = getAbsoluteUrl(url);
    let link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = absUrl;
    document.head.appendChild(link);
  });
}

// todo: post
const post = async function post(url, data, init) {

}

export default {
  getJSON,
  getJSONs,
  getCachedJSON,
  getCachedJSONs,
  getScript,
  getScripts,
  getModule,
  getModules,
  getCSS,
}
