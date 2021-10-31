const removePhotoBtn = document.querySelector('.remove-photo');
// const uploadImageInput = document.querySelector('.upload-image__input');

export default removePhotoBtn?.addEventListener('click', async (e) => {
  e.preventDefault();

  const res = await fetch('http://127.0.0.1:3000/api/v1/users/remove-photo', {
    method: 'POST',
  });
  if (res.ok) {
    location.realod();
  }
});
