const form = document.querySelector('#register-form');
const usernameInput = document.querySelector('#username');
const passwordInput = document.querySelector('#password');
const registerBtn = document.querySelector('#register-btn');

const codeInput = document.querySelector('.code');
const codeButton = document.querySelector('#code');

let code = '';

// 生成驗證碼
function generateCode() {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < 4; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}
// 更換驗證碼
function change() {
    code = generateCode();
    codeInput.value = code;
}

//創建第一組驗證碼
change();

// 提交表單時進行驗證
form.addEventListener('submit', function(event) {
  event.preventDefault();
  const username = usernameInput.value;
  const password = passwordInput.value;
  const inputCode = codeInput.value;
  if (code && inputCode.toLowerCase() === code.toLowerCase()) {
    document.getElementById('btn').type = 'submit';
    form.submit();
  } else {
    alert('驗證碼不正確!!請在試一次。');
    passwordInput.value = '';
    codeInput.value = '';
    change();
  }
});
