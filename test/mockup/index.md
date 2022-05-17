---
title: "Mockup"
layout: page
navbar: false
sidebar: false
wide: true
pages:
  - "./blog/"
  - "./profile/"
  - "./doc/"
  - "./post/"
  - "./hero/"
---

{%- assign pages = page.pages -%}

<div class="mockup">
  {%- for url in pages -%}
    <div class="page">
      <iframe src="{{url}}" scrolling="no"></iframe>
    </div>
  {%- endfor -%}
</div>

<ul>
  {%- for url in pages -%}
    <li><a href="{{url}}">{{url}}</a></li>
  {%- endfor -%}
</ul>

<style>

  .mockup {
    --canvas-width: 2400px;
    --canvas-height: 1200px;
    --frame-width: 1280px;
    --frame-height: 720px;
    --count: {{pages.size}};
    width: var(--canvas-width);
    height: var(--canvas-height);
    overflow: hidden;
    border: 1px solid #aaa;
    display: flex;
    flex-direction: row;
  }

  .page {
    width: calc( 100% / var(--count) * .8);
  }

  iframe {
    width: var(--frame-width);
    height: var(--frame-height);
    transform:
      perspective(1920px)
      rotateX(5deg)
      rotateY(58deg)
      rotateZ(-5deg)
      translate3d(0px,0px,1px)
      ;
    pointer-events: none;
    border-radius: 4px;
    border: none;
    box-shadow:
      0 0 0 1px #666,
      -4px 4px 8px 4px #3333
      ;
    background: white;
    margin-top: 220px;
    margin-left: -80px;
  }

  .page:first-child iframe {
    box-shadow:
      0 0 0 32px #333,
      -16px 0px 16px 16px #333
      ;
  }

</style>
