const navForm = document.querySelector('.nav__form');
const navFormInput = document.querySelector('.nav__form__input');

const navSearch = navForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (navFormInput.value?.trim() === '' || !navFormInput.value) return;
  const inputVal = navFormInput.value.toLowerCase()?.split(' ').join('-');
  navFormInput.value = '';
  // await fetch(`/books/${inputVal}`);
  window.location.replace(`/books/${inputVal}`);
});

export default navSearch;
