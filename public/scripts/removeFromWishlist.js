const deleteWishlist = document.querySelectorAll('.deleteWishlist');

export default Array.from(deleteWishlist)?.forEach((b) => {
  b.addEventListener('click', async () => {
    const res = await fetch('/api/v1/wishlist/delete-wishlist', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user: b.dataset.user, book: b.dataset.book }),
    });
    if (res.ok) {
      location.reload();
    }
  });
});
