const componentBuilders = {

  'card': function (config) {
    let html = `<div class="card mb-3 pl-3 pr-3 pt-2 pb-2">`;

    if (config.title) {
      html += `<div class="card-header"><div class="card-title m-0 font-weight-bold">${config.title}</div></div>`;
    }

    if (config.body) {
      html += `<div class="card-body">${config.body}</div>`;
    }

    if (config.table) {
      html += config.table;
    }

    if (config.list) {
      html += `<ul class="list-group list-group-flush">${config.list.map(x => `<li class="list-group-item">${x}</li>`).join('')}</ul>`;
    }

    html += `</div>`;
    return html;
  },

  'table': function (config) {
    let captionHtml = '',
      headHtml = '',
      bodyHtml = '',
      footHtml = '';

    let tableClass = 'h-table';
    let tableAttr = config.attr ?? '';
    let tableStyle = config.style ?? '';

    if (config.class) tableClass += ` ${config.class}`;
    if (config.striped) tableClass += ' h-table--striped';
    if (config.hover) tableClass += ' h-table--hover';
    if (config.small) tableClass += ' h-table--small';
    if (config.sortable) tableClass += ' sortable';
    if (config.id) tableAttr += ` id="${config.id}"`;
    if (config.align) tableStyle += ` text-align:${config.align}`;
    if (config.dataset) Object.entries(config.dataset).forEach(([key, value]) => tableAttr += ` data-${key}="${value}"`);
    if (config.pagination) {
      tableClass += ' paginateable';
      tableAttr += ` data-pagination="${config.pagination}"`;
    }
    
    // captionHtml
    if (config.caption) {
      captionHtml = `<caption>${config.caption}</caption>`;
    }

    const columns = config.columns?.map(x => typeof x === "string" ? { text: x } : x) ?? [];

    // headHtml
    if (columns.some(x => !!x.text)) {
      headHtml += '<thead><tr>';
      columns.forEach(col => {
        headHtml += '<th';
        if (col.id) headHtml += ` id="${col.id}"`;
        if (col.class) headHtml += ` class="${col.class}"`;
        if (col.span) headHtml += ` colspan="${col.span};"`;
        if (col.width) headHtml += ` style="width:${col.width};"`;
        if (col.dataset) Object.entries(col.dataset).forEach(([key, value]) => headHtml += ` data-${key}="${value}"`);
        headHtml += `>${col.text}</th>`;
      });
      headHtml += '</tr></thead>';
    }

    // bodyHtml
    const bodies = config.bodies ?? [];
    if (config.body) bodies.push(config.body);
    bodies.map(body => {
      if (body.length === 0) return true;
      bodyHtml += '<tbody>';
      body.map((row, rowindex) => {
        bodyHtml += '<tr';
        if (config.pagination > 0 && rowindex >= config.pagination) {
          bodyHtml += ' hidden';
        }
        bodyHtml += '>';
        row.map((cell, colindex) => {
          if (typeof cell !== "object") cell = { text: cell };
          const column = columns[colindex] ?? {};

          const cellTag = (column.isHeadColumn || cell.isHead) ? 'th' : 'td';
          const cellId = cell.id;

          let cellClass = '';
          if (column.cellClass) cellClass += ' ' + column.cellClass;
          if (cell.class) cellClass += ' ' + cell.class;
          cellClass = cellClass.trim();

          let cellStyle = '';
          if (column.width && rowindex === 0) cellStyle += ` width:${column.width};`;
          if (column.cellAlign) cellStyle += ` text-align:${column.cellAlign}`;
          if (cell.align) cellStyle += ` text-align:${cell.align}`;
          if (column.cellStyle) cellStyle += ' ' + column.cellStyle;
          if (cell.style) cellStyle += ' ' + cell.style;
          cellStyle = cellStyle.trim();

          bodyHtml += `<${cellTag}`;
          if (cellId) bodyHtml += ` id="${cellId}"`;
          if (cellClass) bodyHtml += ` class="${cellClass}"`;
          if (cellStyle) bodyHtml += ` style="${cellStyle}"`;
          if (cell.dataset) Object.entries(cell.dataset).forEach(([key, value]) => bodyHtml += ` data-${key}="${value}"`);
          bodyHtml += `>${cell.text}</${cellTag}>`;
        });
        bodyHtml += '</tr>';
      });
      bodyHtml += '</tbody>';
    });

    // footHtml
    if (config.foot) {
      footHtml += '<tfoot>';
      config.foot.map(tr => {
        footHtml += '<tr>';
        tr.map((cell) => {
          footHtml += `<td>${cell}</td>`;
        });
        footHtml += '</tr>';
      });
      footHtml += '</tfoot>';
    }

    const html = `<table class="${tableClass}" style="${tableStyle}" ${tableAttr}>
      ${captionHtml}
      ${headHtml}
      ${bodyHtml}
      ${footHtml}
    </table>`;

    return html;
  },


  'list': function (config) {
    config.body = config.list.filter(x => x !== null);
    config.align ??= 'center';
    config.class ??= "";
    config.class += "h-table--row";

    const html = create('table', config);
    return html;
  },


  'info': function (config) {
    let imageHtml = '';
    let imageCol = 0;

    if (config.image) {
      imageCol = config.imageCol || 3;
      imageHtml = `<div class="col-12 col-lg-${imageCol} order-xs-first order-first order-lg-last d-flex">
        <div class="align-self-center flex-grow-1 text-center">${config.image}<hr class="d-lg-none"></div>
      </div>`;
    }

    let list = config.list.filter(x => x !== null);
    if (config.ignoreNull) {
      list = list.filter(x => (x[1] !== undefined) && (x[1] !== null) && (x[1] !== ""));
    }
    const labelWidth = config.labelWidth ?? 100 * 0.6 / (0.6 + config.list[0].length - 1);
    config.style = (config.style ?? "") + "table-layout:fixed;";
    config.body = list;
    config.columns = [
      {
        width: `${labelWidth}%;`,
        isHeadColumn: true,
        cellStyle: 'font-weight: bold; text-align: center;',
      }
    ];
    const tableHtml = create('table', config);

    const html = `<div class="row">
      <div class="col-12 col-lg-${12 - imageCol} order-lg-first">
        ${tableHtml}
      </div>
      ${imageHtml}
    </div>`;

    return html;
  },

  'tabs': function (config) {
    const id = config.id || crypto.randomUUID();
    let selectedIndex = 0;
    let tabClass = 'c-tabs';
    let tabAttr = '';
    tabAttr += ` id="${id}"`;
    if (config.keepSelected) {
      tabClass += ` c-tabs--keepselected`;
    }

    let html = `<div class="${tabClass}" ${tabAttr}>`;
    config.tabs.forEach((tab, i) => {
      if (tab.selected) {
        selectedIndex = i;
      }
      html += `<input class="c-tabs__input" name="${id}_inputs" id="${id}-${i}" type="radio" ${selectedIndex === i ? 'checked' : ''}>`;
      html += `<label class="c-tabs__button" for="${id}-${i}">${tab.text}</label>`;
      html += `<div class="c-tabs__pane">${tab.content}</div>`;
    });
    html += '</div>';
    return html;
  },


  'select': function (config) {
    const className = "form-select o-select";
    let html = `<select class="${className}" name="${config.name}">`;

    if (Array.isArray(config.data)) {
      // [
      //   [key, value],
      // ]
      for (const [key, value] of config.data) {
        html += `<option value="${key}">${value}</option>`;
      }
    } else {
      // {
      //   group: [
      //     [key, value],
      //   ],
      // }
      for (const [label, data] of Object.entries(config.groups)) {
        if (label) html += `<optgroup label="${label}">`;
        for (const [key, value] of data) {
          html += `<option value="${key}">${value}</option>`;
        }
        if (label) html += `</optgroup>`;
      }
    }
    html += '</select>';
    return html;
  },

};

const create = function (key, config) {
  if (typeof key == 'object') {
    config = key;
    key = config.type;
  }
  key = key.toLowerCase();
  if (key in componentBuilders) {
    return componentBuilders[key](config ?? {});
  } else {
    return `[Component "${key}" is not implemented]`;
  }
};

export default {
  create,
};
