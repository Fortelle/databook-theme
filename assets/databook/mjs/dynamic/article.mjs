import formhelper from '../extensions/formhelper.mjs';

let articleModule;

const parseHTML = function (str) {
  const tmp = document.createElement(null);
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
};

const showWall = function (title, text, icon) {
  wallNode.innerHTML = `
    <div class="l-wall__title"> <i class="${icon}"></i> ${title}</div>
    <div class="l-wall__text">${text}</div>`;

  articleNode.hidden = true;
  wallNode.hidden = false;
};

const hideWall = function () {
  articleNode.hidden = false;
  wallNode.hidden = true;
};

const load = async function (location) {
  beginUpdate();

  const absUrl = new URL(`./${location.page}.mjs`, document.baseURI).href;
  const articlePath = location.page;
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

    breadcrumb.clear();
    if (databook.dynamic.config.breadcrumb) {
      breadcrumb.push(databook.dynamic.config.breadcrumb);
    }
    breadcrumb.push({
      "text": articleModule.title,
      "url": '#!/' + articlePath
    });

    const pageData = {
      title: articleModule.title,
    };

    if(articleModule.content) {
      if (articleModule.content instanceof Function) {
        const contentData = await articleModule.content();
        if (typeof contentData === 'object') {
          Object.assign(pageData, contentData);
        } else {
          pageData.content = contentData;
        }
      }
    }

    await update(pageData, true);

    if (articleModule.form) {
      await createForm(articleModule.form);
    }

    await change(location);

    endUpdate();
  } catch (error) {
    showError(error);
    return false;
  }

  return true;
};

const change = async function (location) {
  if (!articleModule) return;

  const isAsync = articleModule.change?.constructor?.name === "AsyncFunction";
  if (isAsync) {
    beginUpdate();
  }

  try {
    let pageData = false;

    if (articleModule.change instanceof Function) {
      pageData = await articleModule.change(location);
    }

    if (pageData === true) {
      await update();
    } else if (pageData === false || pageData === null || pageData === undefined) {
      // do nothing
    } else if (typeof pageData === 'object') {
      await update(pageData);
    } else {
      await update({ content: pageData });
    }
    formhelper.applyValues(location.searchParams);
  } catch (error) {
    showError(error);
  } finally {
    if (isAsync) {
      endUpdate();
    }
  }
};

const update = async function (pageData = {}, clear = false) {
  const titleElement = document.querySelector('.c-title');

  const titles = breadcrumb.data.map(x => x.text);
  if (pageData.subtitle) {
    titles.push(pageData.subtitle);
  }
  document.title = titles.reverse().join(` - `);
  const title = pageData.displaytitle ?? pageData.subtitle ?? articleModule.title;

  if (title || clear) {
    titleElement.querySelector('.c-title__title').innerHTML = title ?? null;
  }

  if (pageData.tagline || clear) {
    let tagline = titleElement.querySelector('.c-pagehead__tagline');
    if (tagline == null) {
      tagline = parseHTML('<div class="c-pagehead__tagline"></div>');
      titleElement.append(tagline);
    }
    tagline.innerHTML = pageData.tagline ?? null;
  }

  if (pageData.indicator || clear) {
    let indicator = titleElement.querySelector('.c-pagehead__indicator');
    if (indicator == null) {
      indicator = parseHTML('<div class="c-pagehead__indicator"></div>');
      titleElement.append(indicator);
    }
    indicator.innerHTML = pageData.indicator ?? null;
  }

  if (pageData.toc || clear) {
    document.querySelector('.l-page__side').innerHTML = pageData.toc ?? null;
  }

  if (pageData.footer || clear) {
    document.querySelector('.l-page__footer').innerHTML = pageData.footer ?? null;
  }

  if (pageData.breadcrumb || clear) {
    breadcrumb.update(pageData.breadcrumb ?? null);
  }

  if (pageData.content || clear) {
    const tabs = document.querySelectorAll('.c-tabs--keepselected');
    const tabdata = [];
    if (tabs.length > 0) {
      tabs.forEach((tab, i) => {
        const inputs = tab.querySelectorAll(':scope > .c-tabs__input');
        const selectedIndex = [...inputs].findIndex(x => x.checked);
        tabdata.push({
          id: tab.id,
          index: i,
          selected: selectedIndex,
        });
      });
    }

    if (pageData.content instanceof HTMLElement) {
      document.querySelector('.l-page__content').replaceChildren(pageData.content);
    } else if (pageData.content instanceof NodeList) {
      document.querySelector('.l-page__content').replaceChildren(...pageData.content);
    } else if (typeof pageData.content === 'string') {
      document.querySelector('.l-page__content').innerHTML = pageData.content;
    } else {
      document.querySelector('.l-page__content').innerHTML = "&nbsp;";
    }

    if (tabdata.length > 0) {
      for (const item of tabdata) {
        const tab = document.getElementById(item.id) ?? document.querySelectorAll('.c-tabs--keepselected')[item.index];
        if (tab == null) {
          continue;
        }
        const input = tab.querySelectorAll(':scope > .c-tabs__input')[item.selected];
        if (input == null) {
          continue;
        }
        input.checked = true;
      }
    }
  }

  if (pageData.events?.length > 0) {
    for (const eventItem of pageData.events) {
      const targets = document.querySelectorAll('.l-page__content ' + eventItem.target);
      for (const element of targets) {
        element.addEventListener(eventItem.type, eventItem.listener, eventItem.options);
      }
    }
  }

  if (pageData.done instanceof Function) {
    await pageData.done();
  }

  databook.event.dispatchEvent(new CustomEvent("articleupdated"));
};

const createForm = async function (data) {
  let form;
  if (data instanceof Function) {
    data = await data();
  }

  if (typeof data === 'string') {
    const element = parseHTML(data);
    if (element.tagName === 'form') {
      form = element;
    } else {
      form = element.querySelector('form');
    }
  } else {
    let html = '';
    html += '<form class="c-tocform" name="pseudoform"><div class="form-row">';
    for (const item of data.items) {
      html += `<div class="form-group col-12">`;
      if (item.label) html += `<label>${item.label}</label>`;
      if (item.type === 'select') html += databook.component.create(item);
      html += '</div>';
    }
    if (data.submit) {
      html += '<button class="btn btn-primary" type="submit">OK</button>';
    }
    html += '</div></form>';
    const element = parseHTML(html);
    form = element;
  }
  document.querySelector('.l-page__side').appendChild(form);

  formhelper.apply(form);
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
    const newData = [...this.data, ...(data ?? [])];
    let html = '';
    for (const entry of newData) {
      html += `<span class="c-breadcrumb__item"><a href="${entry.url}">${entry.display ?? entry.text}</a></span>`;
    }

    let breadcrumbNode = document.querySelector('.c-breadcrumb');
    if (!breadcrumbNode) {
      breadcrumbNode = parseHTML('<div class="c-breadcrumb"></div>');
      const title = document.querySelector('.c-title');
      title.insertBefore(breadcrumbNode, title.firstChild);
    }
    breadcrumbNode.innerHTML = html;
  },
};

databook.event.addEventListener("articleupdated", async () => {
  const sortable = document.querySelectorAll('.l-page__content table.sortable:not(.js-tablesorter)');
  if (sortable.length > 0) {
    const tablesorter = await databook.loader.getExtension('tablesorter');
    tablesorter.apply(sortable);
  }

  const paginateable = document.querySelectorAll('.l-page__content table.paginateable:not(.js-tablepaginator)');
  if (paginateable.length > 0) {
    const tablepaginator = await databook.loader.getExtension('tablepaginator');
    tablepaginator.apply(paginateable);
  }
});



export default {
  load,
  change,
};
