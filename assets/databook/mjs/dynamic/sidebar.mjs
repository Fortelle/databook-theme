const create = function (data) {
  let html = '<div class="c-navtree">';

  for (const group of data) {
    if (group.text) {
      html += `<div class="c-navtree__label">${group.text}</div>`;
    }

    for (const item of group.items) {
      const text = item.title;
      const url = item.url ?? `#!/${item.module}`;
      const icon = (item.icon ?? group.default_icon) ? `<i class=" fas fa-${item.icon ?? group.default_icon} fa-fw"></i>` : '';
      const hasChildren = !!item.items;
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
        for (const subitem of item.items) {
          const subtext = subitem.name;
          const suburl = subitem.url ?? `#!/${subitem.name}`;
          html += `
            <div class="c-navtree__item">
              <a class="c-navtree__link" href="${suburl}">
                <div class="c-navtree__icon"></div>
                <div class="c-navtree__text">${subtext}</div>
              </a>
            </div>
            `;
        }
        html += '</div>';
      }
    }
  }

  html += '</div>';

  document.querySelector('.l-sidebar__body').innerHTML = html;
};

const activeItem = function (url) {
  document.querySelector('.c-navtree__item.is-active')?.classList.remove('is-active');
  const item = document.querySelector(`.c-navtree__item:has(> .c-navtree__link[href="${url}"])`);
  if (item != null) {
    item.classList.add('is-active');
    if (item.nextElementSibling?.classList.contains('c-navtree__list')) {
      item.classList.add('is-expanded');
    }
    item.closest('.c-navtree__list')?.parentElement.addClass('is-expanded');
  }
};

export default {
  create,
  activeItem,
};