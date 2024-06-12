let articleModule, articlePath;

const parseHTML = function (str) {
  var tmp = document.createElement(null);
  tmp.innerHTML = str;
  return tmp.firstElementChild;
};

const articleNode = document.querySelector('.l-page');
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

    let pageData = {
      title: articleModule.title,
    };

    if (articleModule.init) {
      let initData = await articleModule.init();
      if (!!initData) {
        Object.assign(pageData, initData);
      }
    }

    breadcrumb.clear();
    if (databook.dynamic.config.breadcrumb) {
      breadcrumb.push(databook.dynamic.config.breadcrumb);
    }
    breadcrumb.push({
      "text": articleModule.title,
      "url": '#!/' + articlePath
    });

    update(pageData, true);

    if (articleModule.form) {
      await form.create(articleModule.form);
      form.submit = (query) => {
        let search = new URLSearchParams(query);
        let hashString = `#!/${path}?${search}`;
        window.location.hash = hashString;
      };
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

  let content = articleModule.change ?? articleModule.content;
  let isAsync = content?.constructor?.name === "AsyncFunction";
  if (isAsync) {
    beginUpdate();
  }

  try {
    if (content instanceof Function) {
      content = await content(query ?? {});
    }

    if (content === true) {
      update({});
    } else if (content === false || content === null || content === undefined) {
    } else if (typeof content === 'object') {
      let titles = breadcrumb.data.map(x => x.text);
      if (content.subtitle) {
        titles.push(content.subtitle);
      }
      document.title = titles.reverse().join(` - `);

      content.title = content.displaytitle ?? content.subtitle ?? articleModule.title;

      update(content);
    } else {
      update({ content });
    }
    form.setValue(query);
  } catch (error) {
    showError(error);
  } finally {
    if (isAsync) {
      endUpdate();
    }
  }
}

const update = function (info, clear = false) {
  let title = document.querySelector('.c-title');

  if (info.title || clear) {
    title.querySelector('.c-title__title').innerHTML = info.title ?? null;
  }

  if (info.tagline || clear) {
    let tagline = title.querySelector('.c-pagehead__tagline');
    if (tagline == null) {
      tagline = parseHTML('<div class="c-pagehead__tagline"></div>');
      title.append(tagline);
    }
    tagline.innerHTML = info.tagline ?? null;
  }

  if (info.indicator || clear) {
    let indicator = title.querySelector('.c-pagehead__indicator');
    if (indicator == null) {
      indicator = parseHTML('<div class="c-pagehead__indicator"></div>');
      title.append(indicator);
    }
    indicator.innerHTML = info.indicator ?? null;
  }

  if (info.toc || clear) {
    document.querySelector('.l-page__side').innerHTML = info.toc ?? null;
  }

  if (info.footer || clear) {
    document.querySelector('.l-page__footer').innerHTML = info.footer ?? null;
  }

  if (info.breadcrumb || clear) {
    breadcrumb.update(info.breadcrumb ?? null);
  }

  if (info.content || clear) {
    let tabs = document.querySelectorAll('.c-tabs--keepselected');
    let tabdata = [];
    if (tabs.length > 0) {
      tabs.forEach((tab, i) => {
        let inputs = tab.querySelectorAll(':scope > .c-tabs__input');
        let selectedIndex = [...inputs].findIndex(x => x.checked);
        tabdata.push({
          id: tab.id,
          index: i,
          selected: selectedIndex,
        });
      })
    }

    document.querySelector('.l-page__content').innerHTML = info.content ?? "&nbsp;";

    if (tabdata.length > 0) {
      for (let item of tabdata) {
        let tab = document.getElementById(item.id) ?? document.querySelectorAll('.c-tabs--keepselected')[item.index];
        if (tab == null) {
          continue;
        }
        let input = tab.querySelectorAll(':scope > .c-tabs__input')[item.selected];
        if (input == null) {
          continue;
        }
        input.checked = true;
      }
    }
  }

  if (info.events?.length > 0) {
    for (let eventItem of info.events) {
      let targets = document.querySelectorAll('.l-page__content ' + eventItem.target);
      for (let element of targets) {
        element.addEventListener(eventItem.type, eventItem.listener, eventItem.options);
      }
    }
  }

  databook.event.dispatchEvent(new CustomEvent("articleupdated"));
}

const form = {
  formNode: null,
  submit: null,

  async create(data) {
    if (data instanceof Function) {
      data = await data();
    }
    if (typeof data === 'string') {
      let element = parseHTML(info);
      if (element.tagName == 'form') {
        this.formNode = form;
      } else {
        this.formNode = element.querySelector('form');
      }
      document.querySelector('.l-page__side').appendChild(element);
    } else {
      let html = '';
      html += '<form class="c-tocform" name="pseudoform"><div class="form-row">';
      for (let item of data.items) {
        html += `<div class="form-group col-12">`
        if (item.label) html += `<label>${item.label}</label>`;
        if (item.type == 'select') html += databook.component.create(item);
        html += '</div>'
      }
      if (data.submit) {
        html += '<button class="btn btn-primary" type="submit">OK</button>';
      }
      html += '</div></form>';
      let element = parseHTML(html);
      this.formNode = element;
      document.querySelector('.l-page__side').appendChild(element);
    }

    this.formNode.onsubmit = () => false;

    let submitButton = this.formNode.querySelector('button[type="submit"]');
    if (submitButton) {
      submitButton.onclick = () => this.onSubmit();
    } else {
      for (let e of this.formNode.elements) {
        e.onchange = () => this.onSubmit();
      }
    }

  },

  onSubmit() {
    let formData = new FormData(this.formNode);
    let query = Object.fromEntries(formData);
    if (this.submit) {
      this.submit(query);
    }
  },

  setValue(search) {
    if (!this.formNode) {
      return;
    }
    for (let e of this.formNode.elements) {
      e.value = search?.[e.name] ?? null;
    }
  },
};


const breadcrumb = {
  data: [],

  clear() {
    this.data = [];
  },

  push(data) {
    if (Array.isArray(data)) {
      this.data.push(...data);
    } else {
      this.data.push(data);
    }
  },

  update(data) {
    let newData = [...this.data, ...(data ?? [])];
    let html = '';
    for (let entry of newData) {
      html += `<span class="c-breadcrumb__item"><a href="${entry.url}">${entry.display ?? entry.text}</a></span>`;
    }

    let breadcrumbNode = document.querySelector('.c-breadcrumb');
    if (!breadcrumbNode) {
      breadcrumbNode = parseHTML('<div class="c-breadcrumb"></div>');
      let title = document.querySelector('.c-title');
      title.insertBefore(breadcrumbNode, title.firstChild);
    }
    breadcrumbNode.innerHTML = html;
  },
}

databook.event.addEventListener("articleupdated", async () => {
  let sortable = document.querySelectorAll('.l-page__content table.sortable:not(.js-tablesorter)');
  if (sortable.length > 0) {
    let tablesorter = await databook.loader.getExtension('tablesorter');
    tablesorter.apply(sortable);
  }

  let paginateable = document.querySelectorAll('.l-page__content table.paginateable:not(.js-tablepaginator)');
  if (paginateable.length > 0) {
    let tablepaginator = await databook.loader.getExtension('tablepaginator');
    tablepaginator.apply(paginateable);
  }
});

export default {
  load,
  change,
}
