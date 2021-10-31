const wishListBtn = document.querySelectorAll('.overviewLike');

export default Array.from(wishListBtn).forEach((b) => {
  b.addEventListener('click', async (e) => {
    try {
      const res = await fetch('http://127.0.0.1:3000/api/v1/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: b.dataset.user,
          book: b.dataset.book,
        }),
      });
      const data = await res.json();
    } catch (err) {
      console.log(err);
    }
  });
});
