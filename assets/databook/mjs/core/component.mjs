const componentBuilders = {

  'select': function (html) {
    return `<select class="form-control p-selector">${html}</select>`;
  },

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
      footHtml = '',
      colHtml = '';

    let tableClass = config['class'] ?? '';
    let tableAttr = config.attr ?? '';
    let tableStyle = config.style ?? '';

    if (config.striped) tableClass += ' h-table--striped';
    if (config.hover) tableClass += ' h-table--hover';
    if (config.small) tableClass += ' h-table--small';
    if (config.sortable) tableClass += ' sortable';
    if (config.sortlist) tableAttr += ` data-sortlist="[${config.sortlist}]"`;
    if (config.align) tableStyle += ` text-align:${config.align}`;

    // captionHtml
    if(config.caption) {
      captionHtml = `<caption>${config.caption}</caption>`;
    }

    // colHtml
    let columns = config.columns ?? [];
    if (config.headers) {
      columns.push(...config.headers.map(x => ({text: x})));
    };
    if (columns.length > 0) {
      colHtml += '<colgroup>';
      columns.forEach(col => {
        colHtml += `<col span="${col.span || 1};"`;
        if (col.width) colHtml += ` style="width:${col.width};"`;
        colHtml += ` />`;
      });
      colHtml += '</colgroup>';
    }

    // headHtml
    if (columns.some(x => !!x.text)) {
      headHtml += '<thead><tr>';
      columns.forEach(col => {
        headHtml += '<th';
        if (col.span) headHtml += ` colspan="${col.span};"`;
        if (col.width) headHtml += ` style="width:${col.width};"`;
        headHtml += `>${col.text}</th>`;
      });
      headHtml += '</tr></thead>';
    }

    // bodyHtml
    let bodies = config.bodies ?? [];
    if (config.body) bodies.push(config.body);
    bodies.map(body => {
      if(body.length == 0) return true;
      bodyHtml += '<tbody>';
      body.map(tr => {
        bodyHtml += '<tr>';
        tr.map((cell, col) => {
          bodyHtml += '<td';
          if (columns[col] && columns[col]["class"]) bodyHtml += ` class="${columns[col]['class']}"`;
          let style = '';
          if (columns[col]?.align) style += ` text-align:${columns[col].align}`;
          if (columns[col]?.style) style += ` ${columns[col].style}`;
          if (style) bodyHtml += ` style="${style}"`;
          bodyHtml += `>${cell}</td>`;
        });
        bodyHtml += '</tr>';
      });
      bodyHtml += '</tbody>';
    });

    // footHtml
    if(config.foot) {
      footHtml += '<tfoot>';
      config.foot.map(tr => {
        footHtml += '<tr>';
        tr.map((cell, col) => {
          footHtml += `<td>${cell}</td>`;
        });
        footHtml += '</tr>';
      });
      footHtml += '</tfoot>';
    }

    let html = `<table class="${tableClass}" style="${tableStyle}" ${tableAttr}>
      ${captionHtml}
      ${colHtml}
      ${headHtml}
      ${bodyHtml}
      ${footHtml}
    </table>`;

    return html;
  },


  'list': function (config) {
    config.striped ??= true;
    config.body = config.list.filter(x => x !== null);
    config.align ??= 'center';
    config["class"] ??= "";
    config["class"] += "h-table--row";

    let html = create('table', config);
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
    let labelWidth = 100 * 0.6 / (0.6 + config.list[0].length - 1);
    config.style = (config.style ?? "") + "table-layout:fixed;";
    config.body = list;
    config.columns = [
      {
        width: `${labelWidth}%;`,
      }
    ];
    let tableHtml = create('table', config);

    let html = `<div class="row">
      <div class="col-12 col-lg-${12 - imageCol} order-lg-first">
        ${tableHtml}
      </div>
      ${imageHtml}
    </div>`;

    return html;
  },

  'tabs': function (config) {
    let id = config.id || 'default';
    let active = ('active' in config)
      ? config.active
      : $(`#tab-${id} .nav-link.active`).data('index') || 0
      ;
    let html = `<div class="c-tabs c-tabs--id-${id}">`;
    config.tabs.forEach((tab, i) => {
      html += `<input class="c-tabs__input" name="${id}" id="${id}-${i}" type="radio" ${active == i ? 'checked' : ''}>`;
      html += `<label class="c-tabs__button" for="${id}-${i}">${tab.text}</label>`;
      html += `<div class="c-tabs__pane">${tab.content}</div>`;
    });
    html += '</div>';
    return html;
  },


  'select': function (config) {
    let className = "form-control o-select";
    let html = `<select class="${className}" name="${config.name}">`;

    if (Array.isArray(config.data)) {
      // [
      //   [key, value],
      // ]
      for (let [key, value] of config.data) {
        html += `<option value="${key}">${value}</option>`;
      }
    } else {
      // {
      //   group: [
      //     [key, value],
      //   ],
      // }
      for (let [label, data] of Object.entries(config.groups)) {
        if (!!label) html += `<optgroup label="${label}">`;
        for (let [key, value] of data) {
          html += `<option value="${key}">${value}</option>`;
        }
        if (!!label) html += `</optgroup>`;
      }
    }
    html += '</select>';
    return html;
  },

}

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
}
