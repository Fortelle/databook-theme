---
title:  "Scheme"
layout: page
accent_color: custom
sidebar:
  navigation:
    -
      text: "Change scheme"
      items:
        -
          text: "Light"
          onclick: "document.documentElement.dataset['colorScheme'] = 'light'"
        -
          text: "Dark"
          onclick: "document.documentElement.dataset['colorScheme'] = 'dark'"
        -
          text: "Auto"
          onclick: "document.documentElement.dataset['colorScheme'] = 'auto'"
    -
      text: "Change typography"
      items:
        -
          text: "Article"
          onclick: "document.querySelector('.l-typography').classList.remove('l-typography--doc');document.querySelector('.l-typography').classList.add('l-typography--article');"
        -
          text: "Doc"
          onclick: "document.querySelector('.l-typography').classList.remove('l-typography--article');document.querySelector('.l-typography').classList.add('l-typography--doc');"
---

## hello
### world
<div class="colors"></div>

<script type="text/javascript">
  let pn = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317, 331, 337, 347, 349, 353, 359];
  let html = '';
  for (let n of pn) {
    html += `<div class="c" style="--h:${n};" onclick="document.documentElement.dataset['accentColor'] = 'custom';document.documentElement.style.setProperty('--db-accent-color-h', ${n});">${n}</div>`;
  }
  document.querySelector('.colors').innerHTML = html;
</script>

<style>
.c {
  width: 64px;
  height: 64px;
  margin: 8px;
  display: inline-block;
  background-color: hsl(var(--h), 50%, 66%);
  border: 2px solid hsl(var(--h), 50%, 33%);
  color: hsl(calc(var(--h) + 180), 100%, 66%);
}
</style>
