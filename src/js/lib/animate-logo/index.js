import raf from '../utils/raf';

const addAnimate = document.querySelectorAll('.js-addAnimate');
const image = document.querySelector('.js-awaitLoad');
const newImage = document.createElement('img');
const regExp = /^url\("(.+)"\)$/;

const toggleAnimate = () => {
  addAnimate.forEach(el => el.classList.add('animate'));
};

const { 'background-image': backgroundImage } = document.defaultView.getComputedStyle(image, null);
const url = backgroundImage
  .match(regExp)[1];

newImage.setAttribute('src', url);

function runOnLoadAndRemove(el, fn) {
  el.addEventListener('load', () => raf(fn), { once: true });
}

runOnLoadAndRemove(newImage, toggleAnimate);
