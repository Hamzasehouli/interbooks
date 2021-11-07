'use strict';
import addAlert from './addAlert.js';
import { addSpinner, removeSpinner } from './spinner.js';

const email = document.getElementById('email');
const password = document.getElementById('password');

export default document
  .querySelector('.login-form')
  ?.addEventListener('submit', async function (e) {
    e.preventDefault();
    const obj = {
      email: email.value,
      password: password.value,
    };
    addSpinner(this);
    const res = await fetch('/api/v1/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/JSON',
      },
      body: JSON.stringify(obj),
    });

    const data = await res.json();
    removeSpinner(this);
    if (!res.ok) {
      addAlert('error', data.error);
      setTimeout(() => {
        document.querySelector('.alert').style.display = 'none';
      }, 3000);
    } else {
      addAlert('success', 'Login successfully');
      setTimeout(() => {
        document.querySelector('.alert').style.display = 'none';
        window.location.replace('/');
      }, 3000);
    }
    email.value = '';
    password.value = '';
  });
