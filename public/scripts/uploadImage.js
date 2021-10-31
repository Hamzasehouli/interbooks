const uploadImageBtn = document.querySelector('.upload-image');
// const uploadImageInput = document.querySelector('.upload-image__input');

export default uploadImageBtn?.addEventListener('submit', async (e) => {
  e.preventDefault();
  // This assumes the form's name is `myForm`
  const form = document.querySelector('.upload-image');
  const formData = new FormData(form);
  const res = await fetch('http://127.0.0.1:3000/api/v1/users/upload-image', {
    method: 'POST',
    body: formData,
  });
  console.log('äää');
  console.log(res);
  if (res.ok) {
    window.location.replace('/profile');
  }
});
