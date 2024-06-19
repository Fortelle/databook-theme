const getAbsoluteUrl = function (url) {
  if (url.startsWith(':npm_cdn')) {
    url = url.replace(':npm_cdn', databook.config.get('npm_cdn', ':npm_cdn'));
  }
  if (url.startsWith(':github_cdn')) {
    url = url.replace(':github_cdn', databook.config.get('github_cdn', ':github_cdn'));
  }
  return new URL(url, document.baseURI).href;
};

const getJson = async function (url, options) {
  return await fetch(url, options)
    .then(response => response.json());
};

const getJsons = async function (urlList, options) {
  return await Promise.all(urlList.map(url => getJson(url, options)));
};

const getScript = async function (url) {
  const absUrl = getAbsoluteUrl(url);
  return await import(absUrl);
};

const getScripts = async function (urlList) {
  return await Promise.all(urlList.map(getScript));
};

const getModule = async function (url) {
  const absUrl = getAbsoluteUrl(url);
  return await import(absUrl);
};

const getModules = async function (urlList) {
  return await Promise.all(urlList.map(getModule));
};

const getExtension = async function (name) {
  if (name in databook) {
    return databook[name];
  }

  const url = `/assets/databook/mjs/extensions/${name}.mjs`;
  const extension = (await import(url)).default;
  databook[name] = extension;
  return extension;
};

const getExtensions = async function (names) {
  return await Promise.all(names.map(getExtension));
};

const getCSS = async function (urlList) {
  if (typeof urlList === 'string') {
    urlList = [urlList];
  }
  urlList.forEach(url => {
    const absUrl = getAbsoluteUrl(url);
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = absUrl;
    document.head.appendChild(link);
  });
};

export default {
  getJson,
  getJsons,
  getScript,
  getScripts,
  getModule,
  getModules,
  getExtension,
  getExtensions,
  getCSS,
};