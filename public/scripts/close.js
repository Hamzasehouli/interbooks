const close = document.querySelector('.close');
const cachedList = document.querySelector('.cached__list');

export default close.addEventListener('click', () => {
  cachedList.classList.toggle('hidden');
});
