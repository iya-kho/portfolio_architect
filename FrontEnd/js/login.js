import { getLoginResponse } from './helpers.js';

const loginForm = document.querySelector('.login form');
const errorMessageContainer = document.querySelector('.login .error-message');

loginForm.addEventListener('submit', async function (event) {
  event.preventDefault();
  const userInfo = {
    email: event.target.querySelector('[name=email]').value,
    password: event.target.querySelector('[name=password]').value,
  };

  const userInfoJson = JSON.stringify(userInfo);

  const response = await getLoginResponse(userInfoJson, errorMessageContainer);
  console.log(response);

  // if (response.token) {
  //   localStorage.token = response.token;
  //   window.location.href = '../index.html';
  // }
});
