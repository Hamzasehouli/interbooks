const deleteCartBtn = document.querySelectorAll('.delete-cart');

export default Array.from(deleteCartBtn).forEach((btn) => {
  btn?.addEventListener('click', async function () {
    try {
      const resp = await fetch(
        `http://127.0.0.1:3000/api/v1/cart/delete-cart/${btn.dataset.user}/${btn.dataset.book}`,
        {
          method: 'DELETE',
        }
      );

      if (resp.ok) {
        location.reload();
      }
    } catch (err) {
      console.log(err);
    }
  });
});
