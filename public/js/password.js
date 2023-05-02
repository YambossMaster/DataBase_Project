
/*
const form = document.querySelector('form');
const usernameInput = document.querySelector('input[name="login[username]"]');
const passwordInput = document.querySelector('input[name="login[password]"]');

form.addEventListener('submit', function(event) {
  event.preventDefault();
  const username = usernameInput.value;
  const password = passwordInput.value;
  if (username === 'a@gmail.com' && password === '123123') {
    document.getElementById('btn').type = 'submit';
    form.submit();
  } else {
    alert('帳號或密碼不正確!!請在試一次。');
    passwordInput.value = "";
  }
});
*/
const form = document.querySelector('form');
const usernameInput = document.querySelector('input[name="login[username]"]');
const passwordInput = document.querySelector('input[name="login[password]"]');

form.addEventListener('submit', function(event) {
  event.preventDefault();
  const username = usernameInput.value;
  const password = passwordInput.value;
  const user = users.find(u => u.email === username);
  if (user && user.password === password) {
    document.getElementById('btn').type = 'submit';
    form.submit();
  } 
  else {
    alert('帳號或密碼不正確!!請在試一次。');
    passwordInput.value = '';
  }
});

