const hamburger = document.querySelector('.hamburger');
const cachedList = document.querySelector('.cached__list');

export default hamburger.addEventListener('click', () => {
  cachedList.classList.toggle('hidden');
});
