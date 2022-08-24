const btnLogin = document.getElementById("login");
const btnCreate = document.getElementById("create");
const input = document.querySelectorAll("input");
const anoy = document.getElementById("alert");

//function alert information when user active form
const alertInfo = (str) => {
  anoy.innerText = `! ${str} !`;
  anoy.style.top = "5%";
  setTimeout(() => {
    anoy.style.top = "-100px";
  }, 2500);
};
//--------------------------------------------------

//When user want to login => href to login
btnLogin.addEventListener("click", () => {
  window.location.href = "/login";
});
//------------------------------------------

//When user want to register new account => done
btnCreate.addEventListener("click", () => {
  //data of input form
  const username = input[0].value,
    password = input[1].value,
    repassword = input[2].value;
  //--------------------------

  //check if not username or password
  if (!username.trim() || !password.trim()) {
    alertInfo("Not Username or Password");
    input[0].value = username.trim();
    input[1].value = input[2].value = "";
    return;
  }
  //---------------------------------

  //check wrong re-password
  if (password !== repassword) {
    input[2].value = "";
    input[1].value = "";
    alertInfo("Wrong Re-password");
    return;
  }
  //-------------------------------

  //check if username existing
  $.ajax({
    type: "POST",
    url: "http://localhost:3001/api/register",
    data: { username, password },
  })
    .then((data) => {
      alertInfo(data.message);
      window.location.href = "/login";
    })
    .catch((err) => {
      alertInfo(err.responseJSON.message);
      input[0].value = input[1].value = input[2].value = "";
    });
  //----------------------------------
});
//---------------------------------------------
