---
title:  "Toasts"
layout: page
header:
  sticky: true
sidebar:
  sticky:     true
  header:     false
  profile:
    image:     "/assets/databook/img/logo.png"
    title:    "Databook"
    subtitle:   "Fortelle"
    bio:      "A Jekyll theme for blogs and documentations."
  socials:
    -
      name:     "github"
      value:    "Fortelle/databook-theme"
    -
      name:     "twitter"
      value:    "twitter"
    -
      name:     "homepage"
      value:    "https://www.example.com"
      text:    "Homepage"
    -
      name:     "email"
      value:    "example@email.com"
modules:
  - /assets/databook/mjs/databook.mjs
---

### basic

```js
databook.util.showToast('Hello world');
```
equals
```js
databook.util.showToast({
  text: 'Hello world',
  closeButton: true,
});
```
<button onclick="databook.util.showToast('Hello world')">Popup</button>

### close button
```js
databook.util.showToast({
  text: 'Hello world',
  closeButton: true
});
```
<button onclick="databook.util.showToast({text:'Hello world',closeButton:true})">Popup</button>

### autoClose(ms)
```js
databook.util.showToast({
  text: 'Hello world',
  autoClose: 1000
});
```
<button onclick="databook.util.showToast({text:'Hello world',autoClose:1000})">Popup</button>

### toggle
```js
databook.util.showToast({
  text: 'Hello world',
  id: 'toggle-toast'
});
```
```js
databook.util.closeToast('toggle-toast');
```
<button onclick="document.querySelector('#toggle-toast') ? databook.util.closeToast('toggle-toast') : databook.util.showToast({text:'Hello world',id:'toggle-toast'})">Toggle</button>

<style>
button {
  padding: .2em .4em;
}
</style>
