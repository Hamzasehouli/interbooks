const stripe = new Stripe(
  'pk_test_51Jsti8LkTujlLiy948aXOlBAbrJ0kevUtUFveuXr4PZ3x543nowAopOW46fpFq0mlyrAENpFFCwSlVH51DYm0KCU00iBapBjb9'
);
const checkoutBtn = document.getElementById('checkout');

export default checkoutBtn?.addEventListener('click', async function (e) {
  const res = await fetch(
    `/api/v1/purchase/checkout-session/${this.dataset.userid}`
  );

  const session = await res.json();

  console.log(session.session.id);
  await stripe.redirectToCheckout({
    sessionId: session.session.id,
  });
});
