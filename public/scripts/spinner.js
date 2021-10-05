const loader = document.querySelector('.loader');
const addSpinner = function (el) {
  //   el.insertAdjacentHTML('afterbegin', loader);
  loader.classList.remove('hidden');
  el.style.display = 'none';
};
const removeSpinner = function (el) {
  //   el.removeChild('.loader');
  loader.classList.add('hidden');
  el.style.display = 'block';
};

export { addSpinner, removeSpinner };
