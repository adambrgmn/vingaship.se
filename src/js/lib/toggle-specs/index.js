const buttons = document.querySelectorAll('.js-toggleSpecs');
const content = document.querySelector('.js-sectionContent');
const specs = document.querySelector('.js-sectionSpecs');

buttons.forEach((btn) => {
  btn.addEventListener('click', () => {
    content.classList.toggle('section__hidden');
    specs.classList.toggle('section__hidden');
  });
});
