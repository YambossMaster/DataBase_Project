const form = document.querySelector('#register-form');
const usernameInput = document.querySelector('#user_name');
const emailInput = document.querySelector('#email');
const passwordInput = document.querySelector('#password');
const repasswordInput = document.querySelector('#repassword');
const birth_dInput = document.querySelector('#birth_d');
const birth_mInput = document.querySelector('#birth_m');
const birth_yInput = document.querySelector('#birth_y');
const registerBtn = document.querySelector('#register-btn');

const codeInput = document.querySelector('.code');
const codeDisplay = document.querySelector('#code');

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
    codeDisplay.value = code;
}

//創建第一組驗證碼
change();
codeDisplay.addEventListener('click',function(){
  change();
})
// 提交表單時進行驗證
form.addEventListener('submit', function(event) {
  event.preventDefault();
  const username = usernameInput.value;
  const password = passwordInput.value;
  const repassword = repasswordInput.value;
  const email = emailInput.value;
  const birth_d = birth_dInput.value;
  const birth_m = birth_mInput.value;
  const birth_y = birth_yInput.value;

  const inputCode = codeInput.value;

  /*password and repassword*/
  if(password != repassword){
    alert('密碼前後不一致，請確認後再次輸入。');
    repasswordInput.value = '';
  }
  /*verification code*/
  if (code && inputCode.toLowerCase() == code.toLowerCase()) {
    document.getElementById('btn').type = 'submit';
    form.submit();
  } else {
    alert('驗證碼不正確!!請在試一次。');
    codeInput.value = '';
    change();
  }
});
