---
title: "Databook"
layout: page
hide_title: true
header:
  sticky: true
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
sidebar:
  sticky:     true
  header:     false
  profile:
    image:     "/assets/databook/img/logo.png"
    title:    "Databook"
    subtitle:   "Fortelle"
    bio:      "A Jekyll theme for blogs and documentations."
  buttons:
    -
      name:     "github"
      value:    "Fortelle/databook-theme"
    -
      name:     "twitter"
      value:    "twitter"
    -
      name:     "email"
      value:    "example@email.com"
  links:
    -
      text:     "Home"
      url:    "/"
    -
      text:     "Posts"
      url:    "/page1/"
      prefix:   "/page"
    -
      text:     "Archive"
      url:    "/archive/"
    -
      text:     "Tags"
      url:    "/tags/"
      prefix:   "/tags/"
    -
      text:     "Categories"
      url:    "/categories/"
      prefix:   "/categories/"
---

{%- assign posts = site.posts | concat: site.posts | concat: site.posts -%}

{%- include blog/list.liquid posts=posts -%}
