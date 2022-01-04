
//variables
const search = document.getElementById("search");
const searchBtn = document.getElementById("submit");
const body = document.getElementById("body-contents");
const selectBtn = document.getElementById("select-btn");
const popup = document.querySelector(".popup");
const popupCancel = document.getElementById("popup-cancel");
const genusInfo = document.querySelector(".edited-content #genus");
const nameInfo = document.querySelector(".edited-content #name");
const familyInfo = document.querySelector(".edited-content #family");
const editBtn = document.getElementById("editBtn");
const deleteBtn = document.getElementById("deleteBtn");
const responsesCancel = document.getElementById("responses-cancel");
const responsesBody = document.getElementById("responses-div");
const placedResponse = document.getElementById("placed-responce");
var idToUpdate;
var searchValue = "none";
var currentState;
var allDeleted = [];
// event list
document.addEventListener("DOMContentLoaded", fetchAll());
function fetchAll() {
  fetch("http://127.0.0.1:5000/get")
    .then((response) => response.json())
    .then((data) => loadData(data["data"]))
    .catch({ success: false });
}
search.addEventListener("input", (e) => {
    e.preventDefault();
    searchValue = search.value.trim();
    //searching();   to improve for suggestions
});
searchBtn.addEventListener("click", (e) => {
  e.preventDefault();
  searching();   
});
popupCancel.addEventListener("click", (e) => {
  e.preventDefault();
  popup.classList.remove("popup-active");
});
selectBtn.addEventListener("input", (e) => {
  e.preventDefault();
  sortingUpdated();
});
responsesCancel.addEventListener("click", (e) => {
  e.preventDefault();
  responsesBody.classList.remove("response-active");
})
editBtn.addEventListener("click", (e) => {
  e.preventDefault();
  responsesBody.classList.remove("response-active");
  const decision = confirm("Are you sure ?");
  if (decision) {
    updating(idToUpdate, genusInfo.value, nameInfo.value, familyInfo.value);
    popup.classList.remove("popup-active");
  } else {
    responsesBody.classList.remove("response-active");
  }
});
deleteBtn.addEventListener("click", (e) => {
  e.preventDefault();
  responsesBody.classList.remove("response-active");
  const decisionDel = confirm("You are about to delete an Entry ?");
  if (decisionDel) {
    deleting(idToUpdate);
    popup.classList.remove("popup-active");
  } else {
    responsesBody.classList.remove("response-active");
  }
})

//function
function loadData(data) {
  body.innerHTML = `<div  class="header">
                    <div>Id</div>
                    <div>Genus</div>
                    <div>Name</div>
                    <div>Family</div>
                    <div>Order</div>
                </div>
                `;
  if (data.length < 1) {
    let mainDiv = document.createElement("div");
    mainDiv.innerHTML = "No Element Found";
    mainDiv.classList.add("empty");
    body.appendChild(mainDiv);
  } else {
    data.forEach((item) => {
      let mainDiv = document.createElement("div");
      mainDiv.classList.add("entry");
      const { genus, name, id, family, order } = item;
      const array = [id, genus, name, family, order];
      const givenId = ["id", "genus", "name", "family", "order"];
      array.forEach((elem) => {
        let div = document.createElement("div");
        div.innerHTML = elem;
        div.setAttribute("id", givenId[array.indexOf(elem)]);
        mainDiv.appendChild(div);
      });

      body.appendChild(mainDiv);
    });
    const entry = document.querySelectorAll("#body-contents .entry");

    entry.forEach((elem) => {
      elem.addEventListener("click", (e) => {
        e.preventDefault();
        popup.classList.add("popup-active");
        idToUpdate = elem.childNodes[0].innerHTML;
        genusInfo.value = elem.childNodes[1].innerHTML;
        nameInfo.value = elem.childNodes[2].innerHTML;
        familyInfo.value = elem.childNodes[3].innerHTML;
      });
    });
  }
}

function updating(id, genus, name, family) {
  fetch("http://127.0.0.1:5000/update/" + id, {
    headers: { "Content-type": "application/json" },
    method: "PATCH",
    body: JSON.stringify({
      genus: genus,
      name: name,
      family: family,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      loadData(sorting(selectBtn.value ,data["data"]));
      responsesBody.classList.add("response-active");
      placedResponse.innerHTML = data["message"];
      if (data["success"]) {
        responsesBody.classList.add("response-updated");
        responsesBody.classList.remove("response-error");
      } else {
        responsesBody.classList.add("response-error");
        responsesBody.classList.remove("response-updated");
      }
    })
    .catch({ success: false });
  
  
}
function deleting(id) {
  allDeleted.push(id);
  localStorage.setItem(1, allDeleted);
  fetch("http://127.0.0.1:5000/delete/" + id, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((data) => {
      if (localStorage.getItem(1).split(",").length > 1) {
        let arr = filtering(localStorage.getItem(1).split(","), data["data"]);
        console.log(arr);
        loadData(sorting(selectBtn.value, arr));
      } else {
        loadData(sorting(selectBtn.value, data["data"]));
      }
      responsesBody.classList.add("response-active");
      placedResponse.innerHTML = data["message"];
      if (data["success"]) {
        responsesBody.classList.add("response-updated");
        responsesBody.classList.remove("response-error");
      } else {
        responsesBody.classList.add("response-error");
        responsesBody.classList.remove("response-updated");
      }
    })
    .catch({ success: false });
  
}
function searching() {
  
  if (searchValue === "") {
    return loadData([]);
  }
  fetch("http://127.0.0.1:5000/search/" + searchValue)
    .then((response) => response.json())
    .then((data) => loadData(sorting(selectBtn.value, data["data"])))
    .catch({ success: false });
}
function sortingUpdated() {
   if (searchValue === "") {
     fetch("http://127.0.0.1:5000/get")
       .then((response) => response.json())
       .then((data) => loadData(sorting(selectBtn.value, data["data"])))
       .catch({ success: false });
   } else {
     fetch("http://127.0.0.1:5000/search/" + search.value.trim())
       .then((response) => response.json())
       .then((data) => loadData(sorting(selectBtn.value, data["data"])))
       .catch({ success: false });
   }
}


function sorting(item, data, direction = "asc") {
  const sortItem = item.toLowerCase();
  if (data === []) {
    return [];
  }
  if (item === "sort by") {
    return data;
  }
  const array = data.sort((a, b) => {
    if (direction === "asc") {
      return a[sortItem] > b[sortItem] ? 1 : -1;
    } else {
      return a[sortItem] < b[sortItem] ? 1 : -1;
    }
  });
  return array;
}

function filtering(arr, data) {
  let array = data;
  if(arr === null){
    return data;
  }
  arr.forEach(
    elem => {
      array = array.filter(
        item => {
          return item.id !== Number(elem);
        }
      );
    }
  );
  return array;
}
