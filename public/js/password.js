var user_account = document.getElementsByClassName("user_account");
var password = document.getElementsByClassName("password");

if(user_account=="a@gmail.com" && password=="123"){
    const btn = document.querySelector("#btn");
    btn.setAttribute("type", "submit");
}
else{
    alert("Wrong!!");
}
//document.querySelector("#btn").addEventListener("click", function() {window.location.href = "/layout"});

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
    alert('帳號或密碼不正確');
  }
});

*/