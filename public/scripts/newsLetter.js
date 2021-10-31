const newsLetter = document.querySelector('.newsLetter__form');
const newsLetterInput = document.querySelector('.newsLetter__form__input');
export default newsLetter.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const theEmail = newsLetterInput.value.trim().toLowerCase();
  if (!theEmail.includes('@') || !theEmail.split('@')[1].includes('.')) {
    return;
  }
  const res = await fetch('http://127.0.0.1:3000/api/v1/email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email: theEmail }),
  });
  const data = await res.json();
  newsLetterInput.value = '';
});
