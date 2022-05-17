---
title:  "Diagram"

chartjs:        true
flowchart:      true
katex:          true
mathjax:        true
mermaid:        true
---

## Chart.js
{%- highlight markdown -%}
``` chart
{
    "type": "bar",
    "data": {
        "labels": ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
        "datasets": [{
            "label": "# of Votes",
            "data": [12, 19, 3, 5, 2, 3],
            "backgroundColor": [
                "rgba(255, 99, 132, 0.2)",
                "rgba(54, 162, 235, 0.2)",
                "rgba(255, 206, 86, 0.2)",
                "rgba(75, 192, 192, 0.2)",
                "rgba(153, 102, 255, 0.2)",
                "rgba(255, 159, 64, 0.2)"
            ],
            "borderColor": [
                "rgba(255, 99, 132, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(75, 192, 192, 1)",
                "rgba(153, 102, 255, 1)",
                "rgba(255, 159, 64, 1)"
            ],
            "borderWidth": 1
        }]
    },
    "options": {
        "scales": {
            "y": {
                "beginAtZero": true
            }
        }
    }
}
```
{: style='width: 600px;' }
{%- endhighlight -%}

``` chart
{
    "type": "bar",
    "data": {
        "labels": ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
        "datasets": [{
            "label": "# of Votes",
            "data": [12, 19, 3, 5, 2, 3],
            "backgroundColor": [
                "rgba(255, 99, 132, 0.2)",
                "rgba(54, 162, 235, 0.2)",
                "rgba(255, 206, 86, 0.2)",
                "rgba(75, 192, 192, 0.2)",
                "rgba(153, 102, 255, 0.2)",
                "rgba(255, 159, 64, 0.2)"
            ],
            "borderColor": [
                "rgba(255, 99, 132, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(75, 192, 192, 1)",
                "rgba(153, 102, 255, 1)",
                "rgba(255, 159, 64, 1)"
            ],
            "borderWidth": 1
        }]
    },
    "options": {
        "scales": {
            "y": {
                "beginAtZero": true
            }
        }
    }
}
```
{: style='width: 600px;' }

## flowchart.js
{%- highlight markdown -%}
``` flowchart
st=>start: Start|past:>http://www.google.com[blank]
e=>end: End|future:>http://www.google.com
op1=>operation: My Operation|past
op2=>operation: Stuff|current
sub1=>subroutine: My Subroutine|invalid
cond=>condition: Yes
or No?|approved:>http://www.google.com
c2=>condition: Good idea|rejected
io=>inputoutput: catch something...|future

st->op1(right)->cond
cond(yes, right)->c2
cond(no)->sub1(left)->op1
c2(yes)->io->e
c2(no)->op2->e
```
{%- endhighlight -%}

``` flowchart
st=>start: Start|past:>http://www.google.com[blank]
e=>end: End|future:>http://www.google.com
op1=>operation: My Operation|past
op2=>operation: Stuff|current
sub1=>subroutine: My Subroutine|invalid
cond=>condition: Yes
or No?|approved:>http://www.google.com
c2=>condition: Good idea|rejected
io=>inputoutput: catch something...|future

st->op1(right)->cond
cond(yes, right)->c2
cond(no)->sub1(left)->op1
c2(yes)->io->e
c2(no)->op2->e
```

## mermaid
{%- highlight markdown -%}
``` mermaid
flowchart LR
    A[Hard edge] -->|Link text| B(Round edge)
    B --> C{Decision}
    C -->|One| D[Result one]
    C -->|Two| E[Result two]
```
{%- endhighlight -%}

``` mermaid
flowchart LR
    A[Hard edge] -->|Link text| B(Round edge)
    B --> C{Decision}
    C -->|One| D[Result one]
    C -->|Two| E[Result two]
```


## MathJax
### Use `$$ ... $$`
{%- highlight markdown -%}
When $$a \ne 0$$, there are two solutions to $$ax^2 + bx + c = 0$$ and they are 

$$
x = {-b \pm \sqrt{b^2-4ac} \over 2a}
$$
{%- endhighlight -%}

When $$a \ne 0$$, there are two solutions to $$ax^2 + bx + c = 0$$ and they are 

$$
x = {-b \pm \sqrt{b^2-4ac} \over 2a}
$$

### Use ```` ``` ... ``` ````
{%- highlight markdown -%}
``` mathjax
x = {-b \pm \sqrt{b^2-4ac} \over 2a}
```
{%- endhighlight -%}

``` mathjax
x = {-b \pm \sqrt{b^2-4ac} \over 2a}
```

## KaTex
### Use `$$ ... $$`
{%- highlight markdown -%}
When $$a \ne 0$$, there are two solutions to $$ax^2 + bx + c = 0$$ and they are 

$$
x = {-b \pm \sqrt{b^2-4ac} \over 2a}
$$
{%- endhighlight -%}

When $$a \ne 0$$, there are two solutions to $$ax^2 + bx + c = 0$$ and they are 

$$
x = {-b \pm \sqrt{b^2-4ac} \over 2a}
$$

### Use ```` ``` ... ``` ````
{%- highlight markdown -%}
``` katex
x = {-b \pm \sqrt{b^2-4ac} \over 2a}
```
{%- endhighlight -%}

``` katex
x = {-b \pm \sqrt{b^2-4ac} \over 2a}
```
