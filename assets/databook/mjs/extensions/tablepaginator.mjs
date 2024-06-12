function apply(selector) {
  let tables = !selector ? document.querySelectorAll('table.paginateable:not(.js-paginator)')
    : typeof selector === 'string' ? [...document.querySelectorAll(selector)]
      : selector instanceof HTMLElement ? [selector]
        : selector instanceof NodeList ? [...selector]
          : selector instanceof Array ? [...selector]
            : []
    ;

  for (let table of tables) {
    if (table.tagName != 'TABLE') {
      continue;
    }
    if (table.classList.contains('js-paginator')) {
      continue;
    }
    if (table.nextElementSibling?.classList.contains('.c-table-pagination')) {
      continue;
    }

    let body = table.querySelector(':scope > tbody');
    if (body == null) {
      continue;
    }

    let pagination = ~~table.dataset['pagination'];
    let maxRow = body.children.length;
    let maxPage = pagination == 0 ? 1 : Math.ceil(maxRow / pagination);
    let html = `<div class="c-table-pagination">
      <a class="c-table-pagination__item c-table-pagination__item--first" data-page="0">
        <i class="fas fa-angle-double-left"></i>
      </a>
      <a class="c-table-pagination__item c-table-pagination__item--prev" data-page="0">
        <i class="fas fa-angle-left"></i>
      </a>`;
    for (let i = 0; i < maxPage; i++) {
      html += `
        <a class="c-table-pagination__item" data-page="${i}">${i + 1}
        </a>`;
    }
    html += `<a class="c-table-pagination__item c-table-pagination__item--next" data-page="${maxPage > 1 ? 1 : 0}">
        <i class="fas fa-angle-right"></i>
      </a>
      <a class="c-table-pagination__item c-table-pagination__item--last" data-page="${maxPage - 1}">
        <i class="fas fa-angle-double-right"></i>
      </a>
    </div>`;

    var template = document.createElement(null);
    template.innerHTML = html;
    let paginator = template.firstElementChild;
    table.insertAdjacentElement('afterend', paginator);
    table.classList.add('js-tablesorter');
    let links = paginator.querySelectorAll('a.c-table-pagination__item');
    for (let a of links) {
      a.onclick = onButtonClick;
    }
    toPage(table, 0);
  }
}

function onButtonClick(event) {
  let paginator = event.currentTarget.closest('.c-table-pagination');
  if (paginator == null) {
    return;
  }

  let table = paginator.previousElementSibling;
  if (table == null) {
    return;
  }

  let page = ~~event.currentTarget.dataset['page'];
  toPage(table, page);

  return false;
}

function toPage(table, page) {
  let paginator = table.nextElementSibling;

  let pagination = ~~table.dataset['pagination'];
  let startIndex = pagination * page;
  let endIndex = startIndex + pagination - 1;
  let rows = table.querySelectorAll(':scope > tbody > tr');
  let maxPage = pagination == 0 ? 1 : Math.ceil(rows.length / pagination);
  endIndex = Math.min(endIndex, rows.length - 1);
  for (let i = 0; i < rows.length; i++) {
    rows[i].hidden = i < startIndex || i > endIndex;
  }

  let links = paginator.querySelectorAll('a.c-table-pagination__item');
  for (let a of links) {
    if (a.classList.contains('c-table-pagination__item--prev')) {
      a.dataset['page'] = page == 0 ? 0 : page - 1;
    } else if (a.classList.contains('c-table-pagination__item--next')) {
      a.dataset['page'] = page >= maxPage - 1 ? maxPage - 1 : page + 1;
    }
    a.classList.toggle('is-disabled', ~~a.dataset['page'] == page);
  }
  paginator.dataset['text'] = `${startIndex + 1} - ${endIndex + 1}`;
}

export default {
  apply,
  toPage,
}