const elementDiv = document.createElement('div');
elementDiv.classList.add('alert');
export default function (state, message) {
  elementDiv.style.background =
    state === 'success' ? 'var(--color-ok)' : 'var(--color-error)';
  elementDiv.style.position = 'fixed';
  elementDiv.style.top = '50%';
  elementDiv.style.left = '50%';
  elementDiv.style.textAlign = 'center';
  elementDiv.style.width = '35%';
  elementDiv.style.height = '18rem';
  elementDiv.style.padding = '4rem';
  elementDiv.style.display = 'flex';
  elementDiv.style.justifyContent = 'center';
  elementDiv.style.alignItems = 'center';
  elementDiv.style.color = 'white';
  elementDiv.style.transform = 'translate(-50%,-50%)';
  elementDiv.innerText = message;
  document
    .querySelector('body')
    .insertAdjacentElement('afterbegin', elementDiv);
}
