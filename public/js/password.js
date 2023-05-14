const loginForm = document.getElementById("login-form");

loginForm.addEventListener('submit', function(event) {
  event.preventDefault();
  let loginSuccess = false;
  const username = document.getElementById("username");
  const password = document.getElementById("password");

  for(let i = 0; i < users.length; ++i){
    if(username.value === users[i].nickname && password.value === users[i].password){
      loginSuccess = true;
      break;
    }
  }
  if(!loginSuccess){
    alert('帳號或密碼不正確!!請在試一次。');
    password.value = "";
  }
  else {
    loginForm.submit();
  }
});