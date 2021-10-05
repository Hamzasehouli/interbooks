'use strict';
import addAlert from './addAlert.js';
import { addSpinner, removeSpinner } from './spinner.js';

const email = document.getElementById('email');

export default document
  .querySelector('.forget-password-form')
  ?.addEventListener('submit', async function (e) {
    e.preventDefault();
    const obj = {
      email: email.value,
    };
    addSpinner(this);
    const res = await fetch(
      'http://127.0.0.1:3000/api/v1/users/forget-password',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/JSON',
        },
        body: JSON.stringify(obj),
      }
    );

    const data = await res.json();
    removeSpinner(this);
    if (!res.ok) {
      addAlert('error', data.error);
      setTimeout(() => {
        document.querySelector('.alert').style.display = 'none';
      }, 3000);
    } else {
      addAlert('success', 'Email sent successfully, please check your inbox');
      setTimeout(() => {
        document.querySelector('.alert').style.display = 'none';
        // window.location.replace('/');
      }, 3000);
    }
    email.value = '';
  });
