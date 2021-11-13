const removePhotoBtn = document.querySelector('.remove-photo');
// const uploadImageInput = document.querySelector('.upload-image__input');

export default removePhotoBtn?.addEventListener('click', async (e) => {
  e.preventDefault();

  const res = await fetch('/api/v1/users/remove-photo', {
    method: 'POST',
  });
  console.log(res);
  if (res.ok) {
    location.reload();
  }
});
