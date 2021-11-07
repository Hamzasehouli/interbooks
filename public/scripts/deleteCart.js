const deleteCartBtn = document.querySelectorAll('.delete-cart');

export default Array.from(deleteCartBtn).forEach((btn) => {
  btn?.addEventListener('click', async function () {
    try {
      const resp = await fetch(
        `/api/v1/cart/delete-cart/${btn.dataset.user}/${btn.dataset.book}`,
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
