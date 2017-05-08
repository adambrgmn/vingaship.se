import raf from '../utils/raf';

const addAnimate = [...document.querySelectorAll('.js-addAnimate')];
const image = document.querySelector('.js-awaitLoad');
const newImage = document.createElement('img');
const regExp = /[-a-zA-Z0-9@:%_+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_+.~#?&//=]*)?/gi;

const toggleAnimate = () => {
  addAnimate.forEach(el => el.classList.add('animate'));
};

const { backgroundImage } = document.defaultView.getComputedStyle(image, null);
const url = backgroundImage
  .match(regExp)[0];

newImage.setAttribute('src', url);

function runOnLoadAndRemove(el, fn) {
  el.addEventListener('load', () => raf(fn), { once: true });
}

runOnLoadAndRemove(newImage, toggleAnimate);
