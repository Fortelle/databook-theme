let articleModule, articlePath;
let config;

const parseHTML = function (str) {
  var tmp = document.createElement(null);
  tmp.innerHTML = str;
  return tmp.firstElementChild;
};

const articleNode = document.querySelector('.l-article');
const wallNode = parseHTML(`<div class="l-wall"></div>`);

wallNode.hidden = true;
document.querySelector('.l-body').appendChild(wallNode);

const beginUpdate = function () {
  showWall("Loading", ``, "fas fa-spinner fa-spin");
};

const endUpdate = function () {
  hideWall();
};

const showError = function (error) {
  showWall("Error", ``, "fas fa-exclamation-triangle");
  console.error(error);
}

const showWall = function (title, text, icon) {
  wallNode.innerHTML = `
    <div class="l-wall__title"> <i class="${icon}"></i> ${title}</div>
    <div class="l-wall__text">${text}</div>`;

  articleNode.hidden = true;
  wallNode.hidden = false;
}

const hideWall = function () {
  articleNode.hidden = false;
  wallNode.hidden = true;
}

const load = async function (path, loading = false) {
  if (loading) beginUpdate();

  let absUrl = new URL(`./${path}.mjs`, document.baseURI).href;
  articlePath = path;
  articleModule = await import(absUrl)
    .then(m => m.default)
    .catch((error) => {
      showError(error);
      return false;
    });

  if (articleModule === false) {
    //showWall("Module not found", `<p>Sorry, but the requested module "${path}" was not found on this server.</p><p>Please try another link.</p>`, "far fa-frown");
    return false;
  };

  try {
    if (articleModule.init) {
      await articleModule.init();
    }

    let pageData = {
      title: articleModule.title,
    };
    update(pageData, true);

    if (articleModule.getForm) {
      let data = articleModule.getForm();
      form.create(data, (query) => {
        let search = new URLSearchParams(query);
        let hashString = `#!/${path}?${search}`;
        window.location.hash = hashString;
      });
    }

    if(config?.breadcrumb) {
      breadcrumb.create();
    }
  } catch (error) {
    showError(error);
    return false;
  }

  if (loading) endUpdate();
  return true;
};

const change = async function (query) {
  if (!articleModule) return;
  let isAsync = articleModule.getContent.constructor.name === "AsyncFunction";
  if (isAsync) beginUpdate();

  try {
    let content = await articleModule.getContent(query);

    let titles = [window.databookConfig.siteTitle, articleModule.title];
    if (content.subtitle) titles.push(content.subtitle);
    document.title = titles.reverse().join(` - `);

    content.title = content.subtitle ?? articleModule.title;

    if(config?.breadcrumb) {
      if (content.subtitle) {
        breadcrumb.update({ 1: { "text": articleModule.title, "url": '#!/' + articlePath } });
      } else {
        breadcrumb.update({});
      }
    }

    update(content);
    form.setValue(query);
  } catch (error) {
    showError(error);
  } finally {
    if (isAsync) endUpdate();
  }
}

const update = function (info, clear = false) {
  if (info.title || clear) {
    $('.c-pagehead__title').html(info.title ?? null);
  }

  if (info.tagline || clear) {
    $('.c-pagehead__tagline').html(info.tagline ?? null);
  }

  if (info.indicator || clear) {
    $('.c-pagehead__indicator').html(info.indicator ?? null);
  }

  if (info.toc || clear) {
    $('.l-article__side').html(info.toc ?? null);
  }

  if (info.content || clear) {
    $('.l-article__content').html(info.content ?? null);
  }

  if (info.footer || clear) {
    $('.l-article__footer').html(info.footer ?? null);
  }
  
  // todo: multiple tab
}

const form = {
  create(info, submit) {
    let html = '';
    html += '<form class="c-tocform" name="pseudoform"><div class="form-row">';
    for (let item of info.items) {
      html += `<div class="form-group col-12">`
      if (item.label) html += `<label>${item.label}</label>`;
      if (item.type == 'select') html += databook.component.create(item);
      html += '</div>'
    }

    if (info.submit) {
      html += '<button class="btn btn-primary" type="submit">Submit</button>';
    }

    html += '</div></form>';
    let $form = $(html);

    $form.submit(() => false);

    if (info.submit) {
      $('button[type="submit"]', $form).click(_e => this.onSubmit(submit));
    } else {
      $('.form-control', $form).change(_e => this.onSubmit(submit));
    }

    $('.l-article__side').html($form);
  },

  onSubmit(submit) {
    let data = $('.c-tocform').serializeArray().map(x => [x.name, x.value]);
    let query = Object.fromEntries(data);
    submit(query);
  },

  setValue(search) {
    document.querySelectorAll(`.c-tocform .form-control`).forEach(e => {
      let name = e.getAttribute('name');
      e.value = search?.[name] ?? null;
    });
  },

};

const breadcrumb = {
  data: {
    0: {
      "text": "<i class=\"fas fa-home\"></i>",
      "url": window.location.pathname
    },
  },

  create() {
    document.querySelector('.c-pagehead__breadcrumb').innerHTML = `<div class="c-breadcrumb"></div>`;
  },

  update(data) {
    let newData = Object.assign({}, this.data, data);
    let i = 0;
    let html = '';
    while (true) {
      let item = newData[i];
      if (!item) break;
      if (i > 0) html += `<span class="c-breadcrumb__separator">></span>`;
      html += `<a class="c-breadcrumb__link" href="${item.url}">${item.text}</a>`;
      i++;
    }
    document.querySelector('.c-breadcrumb').innerHTML = html;
  },

};

export default {
  load,
  change,
  breadcrumb,
  setConfig(c) { config = c; },
}
