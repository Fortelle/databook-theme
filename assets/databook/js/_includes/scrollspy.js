{
  if (!!window.databookConfig?.scrollspy) {
    window.addEventListener('load', () => {
      let links = Array.from(document.querySelectorAll('.c-toc__link'));
      let headers = links.map(x => decodeURI(x.href).split('#', 2)[1]).map(x => document.getElementById(x));
      if (links.length <= 1) return;
      window.onscroll = () => {
        let scrollPosition = document.documentElement.scrollTop;
        let offsets = headers.map(x => x.offsetTop);
        offsets = offsets.map((x, i) => x - (x - ((i == 0) ? 0 : offsets[i - 1])) * .33);
        let target = offsets.findIndex(x => x > scrollPosition);
        links.forEach((link, i) => link.classList.toggle('is-active', i == target - 1));
      };
    });
  }
}
