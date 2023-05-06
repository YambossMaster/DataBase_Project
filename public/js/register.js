const form = document.querySelector('#register-form');
const usernameInput = document.querySelector('#user_name');
const emailInput = document.querySelector('#email');
const passwordInput = document.querySelector('#password');
const repasswordInput = document.querySelector('#repassword');
// const birth_dInput = document.querySelector('#birth_d');
// const birth_mInput = document.querySelector('#birth_m');
// const birth_yInput = document.querySelector('#birth_y');
const birthInput = document.querySelector('#birth');
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
  console.log("Start submit ~");
  const username = usernameInput.value;
  const password = passwordInput.value;
  const repassword = repasswordInput.value;
  const email = emailInput.value;
  // const birth_d = birth_dInput.value;
  // const birth_m = birth_mInput.value;
  // const birth_y = birth_yInput.value;
  const birth = birthInput.value;

  const inputCode = codeInput.value;

  let PasswordAndRepassword = false;
  let verificationSuccess = false;
  let userNotInDB = true;
  let allPass = false;
  // if(password=="" || repassword=="" || email=="" || username==""){
  //   alert('註冊資訊不完整，請詳細填寫！');
  // }
  // else{
  //   complete=true;
  // }
  

  /*password and repassword*/
  if(password != repassword){
    alert('密碼前後不一致，請確認後再次輸入。');
    repasswordInput.value = '';
  }
  else{
    PasswordAndRepassword=true;
  }
  
  /*verification code*/
  if(PasswordAndRepassword){
    console.log("password : "+ password + "; repassword : " + repassword + "; pass==repass : " + PasswordAndRepassword);
    console.log("code : " + code + "; inputCode = " + inputCode);

    console.log(birth);
    console.log(typeof(birth));

    if (code && inputCode.toLowerCase() == code.toLowerCase()) {
      verificationSuccess = true;
    } 
    else {
      alert('驗證碼不正確!!請在試一次。');
      codeInput.value = '';
      change();
    }
  }

  if(verificationSuccess) {
    // 判定是否存在於資料庫
    for(let i = 0; i < users.length; ++i){
      if(username === users[i].nickname){
        alert('使用者名稱已被使用摟。');
        codeInput.value = '';
        change();
        userNotInDB = false;
        break;
      }
    }
    if(userNotInDB){
      /*將username email password birthday 加入數據庫存儲*/
      allPass = true;
    }
  }

  if(allPass) {
    form.submit();
    // window.location.href = '/';
  }
});
