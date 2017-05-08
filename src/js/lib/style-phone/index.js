const phones = [...document.querySelectorAll('.js-stylePhone')];

const phoneRegExp = /^(\+\d{2})(\d{2})(\d{2,3})(\d{2})(\d{2})$/;

phones.forEach((el) => {
  const newEl = el.cloneNode(true);
  const number = newEl.textContent.trim();

  const match = phoneRegExp
    .exec(number)
    .slice(1)
    .join(' ')
    .replace(/\s/g, (m, i) => (i === 6 ? '-' : m));

  newEl.textContent = match;
  el.parentNode.replaceChild(newEl, el);
});
