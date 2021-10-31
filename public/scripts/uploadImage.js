const uploadImageForm = document.querySelector('.upload-image');
const uploadImageInput = document.querySelector('.upload-image__input');

export default uploadImageForm?.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (!uploadImageInput.value) return;

  const form = document.querySelector('.upload-image');
  const formData = new FormData(form);
  const res = await fetch('http://127.0.0.1:3000/api/v1/users/upload-image', {
    method: 'POST',
    body: formData,
  });

  if (res.ok) {
    window.location.replace('/profile');
  }
});
