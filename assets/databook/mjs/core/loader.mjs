const getAbsoluteUrl = function (url) {
  if (url.startsWith(':npm_cdn') && databookConfig.npm_cdn) {
    url = url.replace(':npm_cdn', databookConfig.npm_cdn);
  }
  return new URL(url, document.baseURI).href;
};

const getJson = async function (url, options) {
  return await fetch(url, options)
    .then(response => response.json());
}

const getJsons = async function (urlList, options) {
  return await Promise.all(urlList.map(url => getJson(url, options)));
}

const getScript = async function (url) {
  let absUrl = getAbsoluteUrl(url);
  return await import(absUrl);
}

const getScripts = async function (urlList) {
  return await Promise.all(urlList.map(getScript));
}

const getModule = async function (url) {
  let absUrl = getAbsoluteUrl(url);
  return await import(absUrl);
}

const getModules = async function (urlList) {
  return await Promise.all(urlList.map(getModule));
}

const getCSS = async function (urlList) {
  if (typeof urlList === 'string') {
    urlList = [urlList];
  }
  urlList.forEach(url => {
    let absUrl = getAbsoluteUrl(url);
    let link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = absUrl;
    document.head.appendChild(link);
  });
}

export default {
  getJson,
  getJsons,
  getScript,
  getScripts,
  getModule,
  getModules,
  getCSS,
}
