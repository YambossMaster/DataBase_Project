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
function password_right(user_account,password){
    if(User[user_account]){
        if (password==User[user_account].password){
            window.location.href = "/index.ejs" //跳轉首頁
            return User[user_account];
        }
    }
    else{
        alert("Wrong User Account Or Password !! Please Do It Again.");
    }

}
*/