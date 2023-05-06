
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
// const users = <%- JSON.stringify(user) %>;
const loginForm = document.getElementById("login-form");
// const usernameInput = document.querySelector('input[name="login[username]"]');
// const passwordInput = document.querySelector('input[name="login[password]"]');

loginForm.addEventListener('submit', function(event) {
  // event.preventDefault();
  let loginSuccess = false;
  const username = document.getElementById("username");
  const password = document.getElementById("password");
  // const user = users.find(u => u.email === username);
  // if (user && user.password === password) {
  //   document.getElementById('btn').type = 'submit';
  //   form.submit();
  // } 
  for(let i = 0; i < users.length; ++i){
    if(username.value === users[i].nickname && password.value === users[i].password){
      loginSuccess = true;
      break;
    }
  }
  if(!loginSuccess){
    alert('帳號或密碼不正確!!請在試一次。');
    password.value = "";
    event.preventDefault();
  }
  // if(username.value != users[0].email || password.value != users[0].password){
  //   alert('帳號或密碼不正確!!請在試一次。');
  //   // passwordInput.value = '';
  //   // loginForm.reset();
  //   password.value = "";
  //   event.preventDefault();
  // }
});

