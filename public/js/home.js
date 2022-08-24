const btnLogout = document.getElementById("logout");

//function setCookie
function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + exdays);
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
//---------------------------------------------------

//Logout user
btnLogout.addEventListener("click", () => {
  setCookie("token", "T_T", 1);
  window.location.href = "/login";
});
//---------------------------------------------------
