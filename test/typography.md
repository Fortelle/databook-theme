---
title:  "Typography"
layout: page
toc: true
sidebar: 
  sticky: true
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
      text: "Change Color"
      items:
        -
          text: "Colorless"
          onclick: "delete document.documentElement.dataset['accentColor']"
        -
          text: "Red"
          onclick: "document.documentElement.dataset['accentColor'] = 'red'"
        -
          text: "Yellow"
          onclick: "document.documentElement.dataset['accentColor'] = 'yellow'"
        -
          text: "Green"
          onclick: "document.documentElement.dataset['accentColor'] = 'green'"
        -
          text: "Blue"
          onclick: "document.documentElement.dataset['accentColor'] = 'blue'"
        -
          text: "Purple"
          onclick: "document.documentElement.dataset['accentColor'] = 'purple'"
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

## Markdown
### Headings
<div style="margin: 2rem 4rem; padding: 2rem; border: 1px dashed gray; border-radius: 1rem;">
<script>
  for(let i=1;i<=6;i++){
    document.write(`<h${i}>h${i} heading</h${i}>`);
  }
  document.currentScript.remove();
</script>
<p>Paragraph text.</p>
</div>

### Paragraphs
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.<br>
Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.<br>
Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

### Styling text

| Style | Syntax | Output |
| :-: | :-: | :-: |
| Bold | `This is **bold text**` | This is **bold text** |
| Italic | `This is *italic text*` | This is *italic text* |
| Strikethrough | `~~This was mistaken text~~` | `This was ~~mistaken text~~ |

### Links
This is a [link](https://example.com/ "title").

### Lists
#### Ordered Lists
1. List item
2. List item
3. List item

#### Unordered Lists
- List item
- List item
- List item

#### Nexted Lists
- List item
  - List item
    - List item
      - List item
        - List item
^
1. List item
  - List item
^
- List item
  1. List item
^
- List item with paragraph

  List item with paragraph

- List item
^
- List item

  > This is a quote

- List item

#### Definition lists
Definition list title
: Definition list division.

#### Task lists
- [x] Checked item
- [ ] Unchecked item

### Tables

| Header | Header | Header |
| :- | :-: | -: |
| Cell | Cell | Cell |
| Cell | Cell | Cell |

### Quotes
Paragraph text.

> This is a quote

Paragraph text.

> <script>document.write(`<h${3}>Header</h${3}>`);document.currentScript.remove();</script>
> 
> 1. List item
> 2. List item
> 
> > Nested quote

### Codes
An in-line `code` block.

``` javascript
// fenced code block
alert('hello world');
```

### Horizontal rules
Paragraph text.

---

Paragraph text.

## Plugins

### Emoji
:+1:

## Footnotes
This is a footnote[^1].

[^1]: Reference.
