const reviewStarBtn = document.querySelectorAll('.book__star');

export default Array.from(reviewStarBtn).forEach((review) => {
  review?.addEventListener('click', async function (e) {
    const payload = {
      rating: this.dataset.rating,
      book: this.dataset.book,
      user: this.dataset.user,
    };
    const res = await fetch('http://127.0.0.1:3000/api/v1/reviews', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    console.log(data);

    if (res.ok) {
      location.reload();
    }
  });
});
