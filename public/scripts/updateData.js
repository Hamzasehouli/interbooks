'use strict';

import addAlert from './addAlert.js';
import { addSpinner, removeSpinner } from './spinner.js';

const firstName = document.getElementById('firstName');
const lastName = document.getElementById('lastName');
const userName = document.getElementById('userName');
const email = document.getElementById('email');

export default document
  .querySelector('.update-data-form')
  ?.addEventListener('submit', async function (e) {
    e.preventDefault();

    const obj = {
      firstName: firstName.value,
      lastName: lastName.value,
      userName: userName.value,
      email: email.value,
    };
    console.log(obj);
    addSpinner(this);
    const res = await fetch('http://127.0.0.1:3000/api/v1/users/update-data', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/JSON',
      },
      body: JSON.stringify(obj),
    });

    removeSpinner(this);

    const data = await res.json();
    if (!res.ok) {
      addAlert('error', data.error);
      setTimeout(() => {
        document.querySelector('.alert').style.display = 'none';
      }, 3000);
    } else {
      addAlert('success', 'You signed up successfully');
      setTimeout(() => {
        document.querySelector('.alert').style.display = 'none';
        // window.location.replace('/profile');
      }, 3000);
    }

    firstName.value = '';
    lastName.value = '';
    userName.value = '';
    email.value = '';
  });
