---
title: "Databook"
layout: page
sidebar: false
wide: true
hide_title: true
header:
  sticky: false
  right_menu:
    -
      text:       "Home"
      url:        "/"
    -
      text:       "Blog"
      url:        "/blog/"
    -
      text:       "Docs"
      url:        "/docs/"
    -
      text:       "GitHub"
      url:        "https://github.com/Fortelle/databook-theme/"
hero: 
  image: false
  title: "Databook"
  description: "A Jekyll theme for blogs and documentations."
  links: "<a type='button' href='#'>Learn more</a>"
  height: "32rem"
---

{%- assign posts = site.posts | concat: site.posts | concat: site.posts -%}

{%- include blog/features.liquid posts=posts style="grid" -%}

<style>
.c-hero {
  background-image:
    linear-gradient(120deg, #63BB5B, transparent),
    linear-gradient(240deg, #FF9C54, transparent),
    linear-gradient(360deg, #4E90D6, transparent)
    ;
  background-blend-mode: screen;

}

.c-blog-grid__thumbnail img { display: none; }
.c-blog-grid__item:nth-child(1) .c-blog-grid__thumbnail {
  background-image: radial-gradient(circle, transparent -200%, #63BB5B 100%);
  }
.c-blog-grid__item:nth-child(2) .c-blog-grid__thumbnail {
  background-image: radial-gradient(circle, transparent -200%, #FF9C54 100%);
  }
.c-blog-grid__item:nth-child(3) .c-blog-grid__thumbnail {
  background-image: radial-gradient(circle, transparent -200%, #4E90D6 100%);
  }
</style>
