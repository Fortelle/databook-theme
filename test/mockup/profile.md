---
title: "Databook"
layout: page
color_scheme: "dark"
blog_style: list
hide_title: true
header:
  sticky: true
  right_menu:
    -
      text:       "Home"
      url:        "/"
    -
      text:       "Tags"
      url:        "/tags/"
    -
      text:       "Category"
      url:        "/category/"
    -
      text:       "About"
      url:        "/about/"
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
  footer_html: "©2022-2022"
---

{%- assign posts = site.posts | concat: site.posts | concat: site.posts -%}

{%- include blog/list.liquid posts=posts -%}
