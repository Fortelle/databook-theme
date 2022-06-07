# DATABOOK-THEME

[![Gem Version](https://img.shields.io/gem/v/databook-theme.svg?style=flat)](https://rubygems.org/gems/databook-theme)
[![Jekyll Version](https://img.shields.io/badge/jekyll-3.9-red.svg?style=flat)](https://jekyllrb.com/)
[![LICENSE](https://img.shields.io/github/license/fortelle/databook-theme.svg?style=flat)](https://github.com/fortelle/databook-theme/blob/master/LICENSE.txt)

Databook is a highly customizable Jekyll theme, which is designed for building personal sites, blogs, and documentations.

![Thumbnail](https://repository-images.githubusercontent.com/493253504/e83a967e-647b-41af-b3de-96dcf228c3f3)

---

## Features
### Common
- Responsive layouts
- Light/dark mode with tunable accent color
- Multiple language user interface
- JavaScript library
- Fully compatible with GitHub Pages

### Components
- Different style sidebars
- Single-page application style documentations
- Pinned Posts
- Search (built-in or google)
- Mathematics ([Mathjax](https://www.mathjax.org/) or [KaTeX](https://katex.org/))
- Diagrams ([Chart.js](https://www.chartjs.org/), [Flowchart.js](https://flowchart.js.org/), [Mermaid](https://mermaid-js.github.io/))
- Comments ([Disqus](https://www.disqus.com), [Gitalk](https://github.com/gitalk/gitalk))
- Analytics ([Google Analytics](https://analytics.google.com/analytics/web/))

## Getting started
### Using GitHub template (recommended)
Using [databook-boilerplate](https://github.com/fortelle/databook-boilerplate), you can easily build and manage a site through browser without any programming knowledge.

1. [**Click here**](https://github.com/fortelle/databook-boilerplate/generate) to create a new repository and name it <code><i>&lt;username&gt;</i>.github.io</code>, where `<username>` is your GitHub account name in lowercase.
2. Navigate to the new repository you created and go to "Settings" -> "Pages". Under "Source", select `master` branch in the drop-down menu and click "Save".
3. Done! Your site will be published at <code>https://<i>&lt;username&gt;</i>.github.io</code> in a few minutes.

### Using jekyll-remote-theme
- Add the following line to your `Gemfile`:
  ``` ruby
  gem "jekyll-remote-theme"
  ```
  or
  ``` ruby
  gem "github-pages"
  ```
- Add the following line to your `_config.yml` file:
  ``` yaml
  remote_theme: "Fortelle/databook-theme"
  ```
### Using Gem-based theme
- Add the following line to your `Gemfile`:
  ``` ruby
  gem "databook-theme"
  ```
- Add the following line to your `_config.yml`:
  ``` yaml
  theme: "databook-theme"
  ```

## Documentations
- [English](https://fortelle.github.io/databook-theme/)


## License
Databook is licensed under the [MIT License](https://github.com/fortelle/databook-theme/blob/master/LICENSE.txt).

## Credits
- [Jekyll](https://jekyllrb.com/)

- [Font Awesome](https://fontawesome.com/)
- [jekyll-toc](https://github.com/allejo/jekyll-toc)
