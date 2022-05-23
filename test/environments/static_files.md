---
title: "Static files"
layout: page
sidebar:
  - true
---

<table>
  <tr>
    <th>path</th>
    <th>modified_time</th>
    <th>name</th>
    <th>basename</th>
    <th>extname</th>
  </tr>
{%- for file in site.static_files -%}
  <tr>
    <td><a href="{{file.path|relative_url}}">{{file.path}}</a></td>
    <td>{{file.modified_time}}</td>
    <td>{{file.name}}</td>
    <td>{{file.basename}}</td>
    <td>{{file.extname}}</td>
  </tr>
{%- endfor -%}
</table>
