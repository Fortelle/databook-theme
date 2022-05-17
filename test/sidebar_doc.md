---
title: "Sidebar"
layout: page
sidebar:
  sticky:     true
  header:     true
  navigation:
    -
      text:       "Group"
      items:
        -
          text:   "Item"
          url:    "#"
          icon:   "fas fa-link"
        -
          text:   "Item without link"
          icon:   "fas fa-link"
        -
          text:   "Item with onclick"
          icon:   "fas fa-link"
          onclick: "alert('hello');"
        -
          text:   "Item with tooltip"
          url:    "#"
          icon:   "fas fa-link"
          title:  "tooltip"
        -
          text:   "Item without icon"
          url:    "#"
        -
          text:   "Active item"
          url:    "/test/sidebar_doc.html"
          icon:   "fas fa-link"
        -
          text:   "Disabled item"
          url:    "#"
          disabled: true
          icon:   "fas fa-link"

        -
          text:   "-"
        -
          text:   "External link"
          url:    "https://www.google.com/"
          external: true
          icon:   "fas fa-link"
        -
          text:   "Item with badge icon"
          url:    "#"
          icon:   "fas fa-link"
          badge:   "fa fa-fire"
        -
          text:   "Item with badge text"
          url:    "#"
          icon:   "fas fa-link"
          badge:   "<span>99</span>"
        -
          text:   "Item with button link"
          url:    "https://www.google.com/"
          icon:   "fas fa-link"
          button:
            icon: "fa fa-arrow-up-right-from-square"
            url:  "https://www.google.com/"
            title: "Open in new window"
            external: true
        -
          text:   "Item with button onclick"
          url:    "#"
          icon:   "fas fa-link"
          button:
            icon: "fas fa-window-maximize"
            title: "Say &quot;Hello&quot;"
            onclick: "alert('hello');"
        -
          text:   "Item with button tooltip"
          url:    "#"
          icon:   "fas fa-link"
          button:
            icon: "fas fa-circle-question"
            title: "A tooltip message"
            
        -
          text:   "-"
        -
          text:   "Collapsed dropdown"
          icon:   "fas fa-bars"
          items:
            -
              text:   "Subitem 1"
            -
              text:   "Subitem 2"
        -
          text:   "Expanded dropdown"
          expanded:   true
          icon:   "fas fa-bars"
          items:
            -
              text:   "Subitem 1"
            -
              text:   "Subitem 2"
        -
          text:   "Collapsed dropdown"
          icon:   "fas fa-bars"
          items:
            -
              text:   "with active item"
              url:    "/test/sidebar_doc.html"
        -
          text:   "Dropdown with link"
          icon:   "fas fa-bars"
          url:    "#"
          items:
            -
              text:   "Subitem"
        -
          text:   "Item after dropdown"
          icon:   "fas fa-link"
    -
      text:       "Extremes"
      items:
        -
          text:   "Long long long long long long long long text"
          url:    "#"
          icon:   "fas fa-link"
        -
          text:   "Long long long long long long long long text with badge"
          url:    "#"
          icon:   "fas fa-link"
          badge:  "fa fa-fire"
        -
          text:   "Long long long long long long long long text with button"
          url:    "#"
          icon:   "fas fa-link"
          button:
            icon: "fas fa-window-maximize"
            title: "Say &quot;Hello&quot;"
            onclick: "alert('hello');"
        -
          text:   "Line <br /> break"
          url:    "#"
          icon:   "fas fa-link"
        -
          text:   "In-text <i class='fas fa-link'></i> icon"
          url:    "#"
          icon:   "fas fa-link"
        -
          text:   "Empty dropdown"
          url:    "#"
          icon:   "fas fa-link"
          items:  true
        -
          text:   "Dropdown with badge"
          url:    "#"
          icon:   "fas fa-link"
          badge:  "fa fa-fire"
          items:  true
    -
      text:       "Footer"
      bottom:     true
      items:
        -
          text:   "Item"
          icon:   "fas fa-link"
---
