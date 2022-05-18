{
  function init() {
    let items = [...document.querySelectorAll('pre')]
      .filter(pre => {
        return pre.childElementCount == 1
          && pre.children[0].tagName == 'CODE'
          && pre.children[0].childElementCount == 0;
      })
      .map((pre, index) => {
        let name = pre.children[0].className.replace('language-', '');
        let text = pre.children[0].textContent;
        let newNode = document.createElement('div');
        newNode.className = `js-code js-code--${name}`;
        newNode.setAttribute('style', pre.getAttribute('style') || "");
        pre.after(newNode);
        return {
          node: pre,
          name,
          text,
          output: newNode,
          id: `js-pre${index}`,
        }
      });

    items.forEach(render);

    if (items.some(x => x.success && x.name == 'mathjax')) {
      MathJax.startup.document.clear();
      MathJax.startup.document.updateDocument();
    }
  }

  function render(item) {
    if (item.name == 'chart' && typeof Chart !== 'undefined') {
      renderChart(item);
    } else if (item.name == 'flowchart' && typeof flowchart !== 'undefined') {
      renderFlowchart(item);
    } else if ((item.name == 'katex' || item.name == 'math') && typeof katex !== 'undefined') {
      renderKatex(item);
    } else if ((item.name == 'mathjax' || item.name == 'math') && typeof MathJax !== 'undefined') {
      renderMathjax(item);
    } else if (item.name == 'mermaid' && typeof mermaid !== 'undefined') {
      renderMermaid(item);
    }

    if (item.error) {
      item.output.innerHTML = `<p style="color:red;">Error: ${item.error}</p>`;
    } else if (item.success) {
      item.node.style.display = 'none';
    }
  }


  function renderChart(item) {
    let json;
    try {
      json = JSON.parse(item.text);
    } catch (error) {
      item.error = 'Invalid JSON syntax.';
      return;
    }

    let canvas = document.createElement('canvas');
    item.output.append(canvas);
    try {
      new Chart(canvas, json);
      item.success = true;
    } catch (error) {
      item.error = 'Invalid Chart syntax.';
      console.error(error);
    }
  }

  function renderFlowchart(item) {
    try {
      let diagram = flowchart.parse(item.text);
      diagram.drawSVG(item.output);
      item.success = true;
    } catch (error) {
      item.error = 'Invalid flowchart syntax.';
      console.error(error);
    }
  }

  function renderKatex(item) {
    try {
      katex.render(item.text, item.output, { displayMode: true });
      item.success = true;
    } catch (error) {
      item.error = 'Invalid Katex syntax.';
      console.error(error);
    }
  }

  function renderMathjax(item) {
    try {
      item.output.append(MathJax.tex2chtml(item.text));
      item.success = true;
    } catch (error) {
      item.error = 'Invalid Mathjax syntax.';
      console.error(error);
    }
  }

  function renderMermaid(item) {
    try {
      item.output.innerHTML = mermaid.render(item.id, item.text);
      item.success = true;
    } catch (error) {
      item.error = 'Invalid mermaid syntax.';
      console.error(error);
    }
  }

  window.addEventListener('load', init);
}
