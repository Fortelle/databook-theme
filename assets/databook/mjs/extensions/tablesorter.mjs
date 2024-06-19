const valueParsers = {
  'auto': (text) => {
    let num = Number(text);
    return text == num ? num : text.toLocaleLowerCase();
  },

  'text': (text) => {
    return text.toLocaleLowerCase();
  },

  'number': (text) => {
    if (text.endsWith('%')) {
      return Number(text.replace(/%$/, '')) / 100;
    } else {
      return Number(text);
    }
  },

  'date': (text) => {
    return Date.parse(text);
  },

  'time': (text) => {
    return Date.parse("1970-01-01T" + text);
  },
}

function addParser(key, parser) {
  valueParsers[key] = parser;
}

function applyIndexes(tblock) {
  let rows = tblock.children;
  for (let r = 0; r < rows.length; r++) {
    let cols = rows[r].children;
    let colindex = 0;
    for (let c = 0; c < cols.length; c++) {
      let cell = cols[c];
      let colspan = ~~cell.getAttribute('colspan') || 1;
      cell.rowindex = r;
      cell.colindex = colindex;
      colindex += colspan;
    }
    if (rows[r].classList.contains('expand-child')) {
      rows[r].expandchild = true;
    }
  }
  for (let r = 0; r < rows.length - 1; r++) {
    let cols = rows[r].children;
    for (let c = 0; c < cols.length; c++) {
      let cell = cols[c];
      let rowspan = ~~cell.getAttribute('rowspan') || 1;
      if (rowspan == 1) {
        continue;
      }
      let colspan = ~~cell.getAttribute('colspan') || 1;
      let colindex = cell.colindex;
      for (let r2 = r + 1; r2 <= r + rowspan - 1; r2++) {
        if (r2 >= rows.length) {
          break;
        }
        let cell2 = Array.findIndex(rows[r2].children, x => x.colindex >= colindex);
        for (let c2 = cell2.colindex; c2 < rows[r2].children.length; c2++) {
          rows[r2].children[c2].colindex == colspan;
        }
        rows[r2].expandchild = true;
      }
    }
  }
}

function apply(selector, options) {
  let tables = !selector ? document.querySelectorAll('table.sortable:not(.js-tablesorter)')
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
    if (table.classList.contains('js-tablesorter')) {
      continue;
    }

    let headers = table.querySelectorAll(':scope > thead > tr > th:not(.unsortable)');
    headers.forEach(header => {
      header.classList.add('js-tablesorter-header');
      header.onclick = onHeaderClick;
    });

    table.classList.add('js-tablesorter');
    if (!!options) {
      table.sortOptions = options;
    }

    sort(table);
  }
}

function sort(table, options = {}) {
  options = { ...table.sortOptions, ...options };

  let columns = [...options.columns ?? []];
  let headers = table.querySelectorAll(':scope > thead > tr > th.js-tablesorter-header');

  for (let tblock of table.querySelectorAll(':scope > thead')) {
    applyIndexes(tblock);
  }

  if (columns.length == 0) {
    if (options.header) {
      columns.push({
        column: options.header.colindex,
        type: options.header.dataset.sortType,
        isDescending: options.header.classList.contains('js-tablesorter-header-up'),
      })
    } else {
      for (let th of headers) {
        if ('sortDefault' in th.dataset) {
          columns[~~th.dataset.sortDefault] = {
            column: th.colindex,
            type: th.dataset.sortType,
          };
        }
      }
      columns = columns.filter(x => !!x);
    }
  }

  if (columns.length == 0) {
    return;
  }

  for (let th of headers) {
    th.classList.remove('js-tablesorter-header-up', 'js-tablesorter-header-down');
    if (th.colindex == columns[0].column) {
      th.classList.add(columns[0].isDescending ? 'js-tablesorter-header-down' : 'js-tablesorter-header-up');
    }
  }

  let parsers = { ...valueParsers, ...options.parsers };
  let bodies = table.querySelectorAll(':scope > tbody');

  for (let tbody of bodies) {
    applyIndexes(tbody);
    let rowData = [...tbody.children].map(tr => [tr]);

    for (let columnData of columns) {
      let parser = parsers[columnData.type] ?? parsers['auto'];

      for (let r = 0; r < rowData.length; r++) {
        let row = rowData[r];
        if (!!row[0].expandchild) {
          row.push(...rowData[r - 1].slice(1));
          continue;
        }
        let td = [...row[0].children].findLast(x => x.colindex <= columnData.column);
        if (td == null) continue;
        let text = td.dataset.sortValue ?? td.innerText;
        let value = parser(text.trim());
        row.push(value);
      }
    }

    for (let i = columns.length - 1; i >= 0; i--) {
      let reverseValue = columns[i].isDescending ? -1 : 1;
      rowData.sort((a, b) => (a[i + 1] > b[i + 1] ? 1 : a[i + 1] == b[i + 1] ? 0 : -1) * reverseValue);
    }

    tbody.replaceChildren(...rowData.map(x => x[0]));
  }

  databook.event.dispatchEvent(new CustomEvent('tablesort', {
    detail: {
      table: table,
      columns: columns.map(x => x.column),
    }
  }));
}

function onHeaderClick(event) {
  let table = event.currentTarget.closest('table');
  let options = {
    header: event.currentTarget
  };

  sort(table, options);
}

export default {
  apply,
  sort,
  addParser,
}