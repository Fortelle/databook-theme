function query(json) {
  let params = new URLSearchParams(location.search);
  let keywords = params.get('q').split(' ').filter(x => x.length > 0);
  if (keywords.length == 0) return [];
  let reg = new RegExp( keywords.join('|'), 'i');

  let results = [];
  for (let item of json) {
    if (item.title && reg.test(item.title)) {
      results.push(item);
      break;
    }
    if (item.content && reg.test(item.content)) {
      results.push(item);
      break;
    }
  }

  return results;
}

function render(results) {
  let resultTemplate = document.querySelector(".js-search-result").innerHTML;
  let resultText = resultTemplate.replace('{0}', results.length);
  document.querySelector('.c-title__meta').innerHTML = resultText;
  
  let html = ``;
  html += `<div class="c-blog-list">`;
  for(let item of results) {
    html += `
<div class="c-blog-list__item">
  <div class="c-blog-list__title">
    <a class="c-blog-list__link" href="${item.url}">${item.title}</a>
  </div>
  <div class="c-blog-list__content">${item.content?.slice(0, 256) || ''}</div>
</div>
    `;
  }
  html += `</div>`;
  
  document.querySelector('.js-search').innerHTML = html;
}

fetch("/assets/search.json")
  .then(response => response.json())
  .then(query)
  .then(render);
