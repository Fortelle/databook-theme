import sidebar from './sidebar.mjs';
import hashlistener from './hashlistener.mjs';
import article from './article.mjs';

let oldPath;

const onHashChange = async function (info) {
  
  dynamic.location = {
    page: info.path,
    query: info.query,
  };

  if (info.isChanged && info.isEmpty) {
    window.location.reload();
    return;
  } else if (!info.isEmpty) {
    if (oldPath != info.path) {
      sidebar.activeItem('#!/' + info.path);
      await article.load(info.path, true);
      oldPath = info.path;
    }
    article.change(info.query);
  }

  if (!info.isHistory) {
    window.scrollTo(0, 0);
  }

};

const goto = function (data) {
  let page = data.page ?? dynamic.location.page;
  let hashString = `#!/${page}`;
  if (!!data.query) {
    let params = new URLSearchParams();
    for (let [key, value] of Object.entries(data.query)) {
      if (value === undefined || value === null  || value === "") {
        continue;
      } else if (value === true) {
        params.set(key, 1);
      } else if (value === false) {
        params.set(key, 0);
      } else {
        params.set(key, value);
      }
    }
    params.sort();
    hashString += `?${params}`;
  }

  if (!data.path) {
    window.location.hash = hashString;
  }
  else {
    let href = data.path.replace(/\/+$/, '') + hashString;
    window.location.href = href;
  }
};

const dynamic = {
  article,
  goto,
};

const load = async function () {
  databook.dynamic = dynamic;

  let configFile = await databook.loader.getJson('./config.json');

  dynamic.config = configFile;

  if (configFile.js?.length > 0) {
    databook.loader.getScripts(configFile.js);
  }
  if (configFile.css?.length > 0) {
    databook.loader.getCSS(configFile.css);
  }
  if (configFile.mjs?.length > 0) {
    databook.loader.getModules(configFile.mjs);
  }

  if (configFile.navigation) {
    sidebar.create(configFile.navigation);
  }

  hashlistener.listen(onHashChange);

  databook.event.dispatchEvent(new CustomEvent("dynamicloaded"));
};

window.addEventListener("databookloading", load);
