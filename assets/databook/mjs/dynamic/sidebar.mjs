const create = function(data) {
  let html = '<div class="c-navtree">';

  for (const group of data) {

    if (!!group.text) {
      html += `<div class="c-navtree__label">${group.text}</div>`;
    }

    for (const item of group.items) {
      let text = item.title;
      let url = item.url ?? `#!/${item.module}`;
      let icon = (item.icon ?? group.default_icon) ? `<i class=" fas fa-${item.icon ?? group.default_icon} fa-fw"></i>` : '';
      let hasChildren = !!item.items;
      let right = '';
      if (hasChildren) {
        right = '<div class="c-navtree__toggle" onclick="this.parentNode.classList.toggle(\'is-expanded\');return false;"></div>';
      }
      html += `
        <div class="c-navtree__item">
          <a class="c-navtree__link" href="${url}">
            <div class="c-navtree__icon">${icon}</div>
            <div class="c-navtree__text">${text}</div>
          </a>
          ${right}
        </div>`;
      if (hasChildren) {
        html += `<div class="c-navtree__list">`;
        for (let subitem of item.items) {
          let text = subitem.name;
          let url = subitem.url ?? `#!/${subitem.name}`;
          html += `
            <div class="c-navtree__item">
              <a class="c-navtree__link" href="${url}">
                <div class="c-navtree__icon"></div>
                <div class="c-navtree__text">${text}</div>
              </a>
            </div>
            `;
        }
        html += '</div>';
      }
    }
  }

  html += '</div>';
  
  $('.l-sidebar__body').html(html);
}

const activeItem = function(url) {
  $('.c-navtree__item.is-active').removeClass('is-active');
  let $activeItem = $(`.c-navtree__item:has(> .c-navtree__link[href="${url}"])`);
  if ($activeItem.length > 0) {
    $activeItem.addClass('is-active');
    if ($activeItem.next().is('.c-navtree__list')) $activeItem.addClass('is-expanded');
    $activeItem.parent('.c-navtree__list').prev().addClass('is-expanded');
  }
}

export default {
  create,
  activeItem,
}
