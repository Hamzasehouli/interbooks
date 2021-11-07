const wishListBtn = document.querySelectorAll('.overviewLike');

export default Array.from(wishListBtn).forEach((b) => {
  b.addEventListener('click', async () => {
    try {
      const res = await fetch(`/api/v1/wishlist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: b.dataset.user,
          book: b.dataset.book,
        }),
      });

      if (res.ok) {
        window.location.replace('/wishlist');
      }
    } catch (err) {
      console.log(err);
    }
  });
});
