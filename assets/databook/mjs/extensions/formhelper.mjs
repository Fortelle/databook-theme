function bind(form, submit) {

  form.onsubmit = () => false;

  const onreset = (event) => {
    // ugly but no better idea
    form.onreset = null;
    form.reset();
    event.target.querySelectorAll('select:not([value])').forEach(x => {
      if(!(x[0]?.hasAttribute('value')) || x[0]?.value !== '') {
        x.selectedIndex = -1;
      }
    });
    event.preventDefault();
    form.onreset = onreset;
  };
  form.onreset = onreset;

  const onsubmit = () => {
    const formData = new FormData(form);
    submit(formData);
  };
  const submitButton = form.querySelector('input[type="submit"], button[type="submit"], button:not([type])');
  if (submitButton) {
    submitButton.onclick = onsubmit;
  } else {
    const inputControls = form.querySelectorAll('*[name]');
    for (const control of inputControls) {
      control.onchange = onsubmit;
    }
  }
}

function apply(form) {
  bind(form, formData => {
    const search = new URLSearchParams(formData);
    databook.dynamic.router.goto({
      page: form.dataset['page'],
      query: search
    });
  });
}

function applyValues(searchParams) {
  const forms = document.querySelectorAll('.l-page form');
  for (const form of forms) {
    form.reset();
    if (searchParams === null) {
      continue;
    }
    const keys = [...new Set([...form.querySelectorAll('*[name]')].map(x => x.name))];
    for (const key of keys) {
      if (!searchParams.has(key)) {
        continue;
      }
      if (form[key] instanceof RadioNodeList) {
        const values = searchParams.getAll(key) ?? [];
        form[key].forEach((element, i) => {
          if (element.type === 'checkbox') {
            element.checked = values.includes(element.value);
          } else if ( i < values.length) {
            element.value = values[i];
          }
        });
      }
      else {
        const element = form[key];
        const value = searchParams.get(key);
        if (element.type === 'checkbox') {
          element.checked = value;
        } else {
          element.value = value;
        }
      }
    }
  }
}

export default {
  apply,
  applyValues,
  bind,
};