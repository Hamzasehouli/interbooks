'use strict';

import addAlert from './addAlert.js';
import { addSpinner, removeSpinner } from './spinner.js';

const gender = document.querySelectorAll('.gender');
const firstName = document.getElementById('firstName');
const lastName = document.getElementById('lastName');
const userName = document.getElementById('userName');
const email = document.getElementById('email');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirmPassword');
const policy = document.getElementById('policy');
const newsletter = document.getElementById('newsletter');

export default document
  .querySelector('.signupForm')
  ?.addEventListener('submit', async function (e) {
    e.preventDefault();
    const genderSelected = Array.from(gender).find((a) => a.checked);
    const obj = {
      gender: genderSelected.value,
      firstName: firstName.value,
      lastName: lastName.value,
      userName: userName.value,
      email: email.value,
      password: password.value,
      confirmPassword: confirmPassword.value,
      acceptConditions: policy.checked,
      acceptNewletter: newsletter.checked,
    };
    addSpinner(this);
    const res = await fetch('/api/v1/users/signup', {
      method: 'POST',
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
        window.location.replace('/profile');
      }, 3000);
    }
    genderSelected.value = '';
    firstName.value = '';
    lastName.value = '';
    userName.value = '';
    email.value = '';
    password.value = '';
    confirmPassword.value = '';
    policy.checked = false;
    newsletter.checked = false;
  });
