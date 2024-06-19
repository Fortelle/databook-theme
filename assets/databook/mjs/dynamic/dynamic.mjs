import sidebar from './sidebar.mjs';
import router from './router.mjs';
import article from './article.mjs';

const dynamic = {
  article,
  router,
};

const onHashChange = async function (options) {
  const isEmpty = !options.location.page && (options.location.searchParams == null || options.location.searchParams.size === 0);
  if (options.isEvent && isEmpty) {
    window.location.reload();
    return;
  } else if (!isEmpty) {
    if (options.isPageChanged && options.location.page) {
      databook.debug('Page changed.', options);
      sidebar.activeItem('#!/' + options.location.page);
      const isSuccess = await article.load(options.location);
      if (!isSuccess) {
        return;
      }
    } else {
      databook.debug('Params changed.', options);
      article.change(options.location);
    }
  }

  if (!options.isHistory) {
    window.scrollTo(0, 0);
  }

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

  router.launch(onHashChange);

  databook.event.dispatchEvent(new CustomEvent("dynamicloaded"));
};

window.addEventListener("databookloading", load);
