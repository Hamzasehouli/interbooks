const logoutBtn = document.querySelector('.logout');

export default logoutBtn?.addEventListener('click', async () => {
  try {
    const res = await fetch('/api/v1/users/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (res.ok) {
      window.location.replace('/');
    }
  } catch (err) {
    console.log(err);
  }
});
