export default function setDimensions({ offset, width }) {
  document.documentElement.style.setProperty(
    '--js-navigation-decoration-offset',
    `${offset}px`,
  );

  document.documentElement.style.setProperty(
    '--js-navigation-decoration-width',
    `${width}px`,
  );
}
