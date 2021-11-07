const increaseQuantity = document.querySelectorAll('.increase-quantity');

export default Array.from(increaseQuantity).forEach((el) => {
  el.addEventListener('input', async function (e) {
    console.log(e.target.value);
    if (!e.target.value) return;

    const payload = {
      user: this.dataset.user,
      book: this.dataset.book,
    };

    const data = [];

    for (let i = 0; i < Number(e.target.value); i++) {
      data.push(payload);
    }

    console.log(data);

    const res = await fetch(`/api/v1/cart/${payload.user}/${payload.book}`, {
      method: 'POST',
      headers: {
        'content-type': 'application/JSON',
      },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      location.reload();
    }
  });
});
