const deleteWishlist = document.querySelectorAll('.deleteWishlist');

export default Array.from(deleteWishlist)?.forEach((b) => {
  b.addEventListener('click', async () => {
    const res = await fetch(
      'http://127.0.0.1:3000/api/v1/wishlist/delete-wishlist',
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user: b.dataset.user, book: b.dataset.book }),
      }
    );
    if (res.ok) {
      location.reload();
    }
  });
});
