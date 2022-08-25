const btnLogout = document.getElementById("logout");
const posts = document.querySelector(".posts-container");
const btnAdd = document.getElementById("add");
const txtTitle = document.querySelector("input");
const txtDesc = document.querySelector("textarea");
const btnWindow = document.getElementById("open-create");
const addPost = document.querySelector(".add-post");
const btnClose = document.getElementById("close");
const opacityWindow = document.getElementById("not-hide");
const h2 = document.querySelector("h2");

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
  setCookie("token", "T_T", 1); //remove cookies
  window.location.href = "/login"; //go home login
});
//---------------------------------------------------

//Function to show all posts of user with input data
const showAllPost = (data) => {
  for (let post of data) {
    //post
    var txt = `<div class="post">
    <div class="title">${post.title}</div>
    <div class="description">${post.description}</div>
    <div class="container-edit">
        <button class="edit">Edit</button>
        <button class="delete">Delete</button>
    </div>
  </div>`;

    $(posts).append(txt); //add post
  }
};

//--------------------------------------------------

//Load all posts of user
window.onload = function () {
  $.ajax({
    type: "GET",
    url: "http://localhost:3001/api/posts",
  })
    .then((data) => {
      const posts = data.posts;
      showAllPost(posts);

      const btnDelete = document.querySelectorAll(".delete");
      const btnEdit = document.querySelectorAll(".edit");

      for (let i = 0; i < btnDelete.length; i++) {
        //Delete post
        btnDelete[i].addEventListener("click", () => {
          $.ajax({
            type: "DELETE",
            url: `http://localhost:3001/api/posts/${posts[i]._id}`,
          })
            .then(() => {
              window.location.href = "/home";
            })
            .catch((err) => {
              console.log(err);
            });
        });

        //Edit post
        btnEdit[i].addEventListener("click", () => {
          let title = posts[i].title,
            description = posts[i].description,
            id = posts[i]._id,
            updateId = true;

          //open edit board{}[]
          txtTitle.value = title;
          txtDesc.value = description;
          h2.textContent = "Edit Post";
          btnAdd.textContent = "Update Post";
          addPost.classList.add("active");
          setTimeout(() => {
            opacityWindow.classList.toggle("hide");
          }, 500);

          //close update board
          btnClose.addEventListener("click", () => {
            txtDesc.value = txtTitle.value = "";
            addPost.classList.remove("active");
            opacityWindow.classList.remove("hide");
            updateId = false; //check if close
          });

          btnAdd.addEventListener("click", () => {
            if (btnAdd.textContent != "Update Post" || !updateId) return;
            const titl = txtTitle.value,
              descriptio = txtDesc.value;

            //check input existing
            if (!titl.trim() || !descriptio.trim()) {
              alert("None title or Description");
              txtTitle.value = title;
              txtDesc.value = description;
              return;
            }

            //all good => update database with new post
            $.ajax({
              type: "PUT",
              url: `http://localhost:3001/api/posts/${id}`,
              data: { title: titl, description: descriptio },
            })
              .then((data) => {
                window.location.href = "/home";
              })
              .catch((err) => {
                console.log(err);
              });
          });
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};
//----------------------------------------------------

//---------Add post----------------------------------
btnAdd.addEventListener("click", () => {
  if (btnAdd.textContent != "Create Post") return;
  const title = txtTitle.value,
    description = txtDesc.value;

  //check input existing
  if (!title.trim() || !description.trim()) {
    alert("None title or Description");
    txtTitle.value = txtDesc.value = "";
    return;
  }

  //all good => update database with new post
  $.ajax({
    type: "POST",
    url: "http://localhost:3001/api/posts",
    data: { title, description },
  })
    .then((data) => {
      window.location.href = "/home";
    })
    .catch((err) => {});
});
//-----------------------------------------------------

//------------------Open window Add Post---------------
btnWindow.addEventListener("click", () => {
  txtDesc.value = txtTitle.value = "";
  h2.textContent = "Add Post";
  btnAdd.textContent = "Create Post";
  addPost.classList.toggle("active");
  setTimeout(() => {
    opacityWindow.classList.toggle("hide");
  }, 500);

  //close add post
  btnClose.addEventListener("click", () => {
    txtDesc.value = txtTitle.value = "";
    addPost.classList.remove("active");
    opacityWindow.classList.remove("hide");
  });
});
//-----------------------------------------------------
