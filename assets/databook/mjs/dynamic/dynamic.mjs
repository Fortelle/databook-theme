import sidebar from './sidebar.mjs';
import hashlistener from './hashlistener.mjs';
import article from './article.mjs';

let oldPath;

const onHashChange = async function(info) {
  if(info.isChanged && info.isEmpty) {
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

  if(!info.isHistory) {
    window.scrollTo(0, 0);
  }

};

const load = async function() {
  let configFile = await databook.loader.getJSON('./config.json');

  databook.dynamic = {
    config: configFile
  };
  
  if (configFile.navigation) {
    sidebar.create(configFile.navigation);
  }
  
  hashlistener.listen(onHashChange);

  databook.event.dispatchEvent(new CustomEvent("dynamicloaded"));
};

window.addEventListener("databookloading", load);
