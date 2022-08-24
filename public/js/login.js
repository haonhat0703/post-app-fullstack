const btnRegister = document.getElementById("register");
const btnLogin = document.getElementById("login");
const input = document.querySelectorAll("input");
const anoy = document.getElementById("alert");

//function alert information when user active form
const alertInfo = (str) => {
  anoy.innerText = `! ${str} !`;
  anoy.style.top = "10%";
  setTimeout(() => {
    anoy.style.top = "-100px";
  }, 2500);
};
//---------------------------------------------

//function setCookie with time deal
function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
//-----------------------------------------

//When user want to register => href to register
btnRegister.addEventListener("click", () => {
  window.location.href = "/register";
});
///------------------------------------------

//When user have account and want to login
btnLogin.addEventListener("click", () => {
  //get data from input form
  const username = input[0].value,
    password = input[1].value;
  //-------------------------------------

  //check if not password or username
  if (!username.trim() || !password.trim()) {
    alertInfo("Username or Password is null");
    input[0].value = input[1].value = "";
    return;
  }
  //------------------------------------

  //check login
  $.ajax({
    type: "POST",
    url: "http://localhost:3001/api/login",
    data: { username, password },
  })
    .then((data) => {
      setCookie("token", data.accessToken, 1);
      window.location.href = "/home";
    })
    .catch((err) => {
      alertInfo(err.responseJSON.message);
      input[0].value = input[1].value = "";
    });
  //-------------------------------------
});
//-----------------------------------------------
