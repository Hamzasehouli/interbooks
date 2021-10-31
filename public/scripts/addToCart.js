const addToCart = document.querySelectorAll('.addToCart');

export default Array.from(addToCart).forEach((a) => {
  a.addEventListener('click', async () => {
    try {
      const res = await fetch('http://127.0.0.1:3000/api/v1/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: a.dataset.user,
          book: a.dataset.book,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        window.location.replace('/cart');
      }
    } catch (err) {
      console.log(err);
    }
  });
});
