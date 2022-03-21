
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
const orderInfo = document.querySelector(".edited-content #order");
const editBtn = document.getElementById("editBtn");
const deleteBtn = document.getElementById("deleteBtn");
const responsesCancel = document.getElementById("responses-cancel");
const responsesBody = document.getElementById("responses-div");
const placedResponse = document.getElementById("placed-responce");
const entry = document.querySelectorAll("#body-contents .entry");
var idToUpdate;
var searchValue = "none";
var currentState;
var allDeleted = [];
// event list
document.addEventListener("DOMContentLoaded", fetchAll());
function fetchAll() {
  fetch("http://localhost:3045/v1/api/fruits/")
    .then((response) => response.json())
    .then((data) =>loadData(data["data"]) )
    .catch({ success: false });
}
search.addEventListener("input", (e) => {
    e.preventDefault();
    searchValue = search.value.trim().toLowerCase();
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
    updating(idToUpdate, genusInfo.value, nameInfo.value, familyInfo.value, orderInfo.value);
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
  body.innerHTML = "";
  if (data.length < 1) {
    let mainDiv = document.createElement("div");
    mainDiv.innerHTML = "No Element Found";
    mainDiv.classList.add("empty");
    body.appendChild(mainDiv);
  } else {
    data.forEach((item) => {
      let mainDiv = document.createElement("div");
      mainDiv.classList.add("entry");
      const { genus, name, _id, family, order } = item;
      const array = [_id, genus, name, family, order];
      const givenId = ["_id", "genus", "name", "family", "order"];
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
        orderInfo.value = elem.childNodes[4].innerHTML;
        
      });
    });
  }
}

function updating(id, genus, name, family, order) {
  fetch("http://localhost:3045/v1/api/fruits/" + id, {
    headers: { "Content-type": "application/json" },
    method: "PATCH",
    body: JSON.stringify({
      genus: genus,
      name: name,
      family: family,
      order: order,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data["success"]) {
        fetchAll();
       // getEntry(id, genus, name, family, order);
        responsesBody.classList.add("response-active");
        placedResponse.innerHTML = data["msg"];
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
  fetch("http://localhost:3045/v1/api/fruits/" + id, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((data) => {
      if (!data["success"]) {
        responsesBody.classList.add("response-updated");
        responsesBody.classList.remove("response-error");
      } else {
        fetchAll();
        responsesBody.classList.add("response-active");
        placedResponse.innerHTML = data["msg"];
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
  fetch("http://localhost:3045/v1/api/fruits/?name=" + searchValue)
    .then((response) => response.json())
    .then((data) => loadData(data["data"]))
    .catch({ success: false });
}
function sortingUpdated() {
  console.log(search.value.toLowerCase());
   if (search.value === "") {
     fetch(
       ("http://localhost:3045/v1/api/fruits/?sort=" +
         selectBtn.value.toLowerCase())
     )
       .then((response) => response.json())
       .then((data) => loadData(data["data"]))
       .catch({ success: false });
   } else {
     fetch(
       ("http://localhost:3045/v1/api/fruits/?name=" +
         search.value +
         "&sort=" +
         selectBtn.value.toLowerCase())
     )
       .then((response) => response.json())
       .then((data) => loadData(data["data"]))
       .catch({ success: false });
   }
}


function getEntry(id, genus, name, family, order) {
  let entries = document.querySelectorAll("#body-contents .entry");
  entries.forEach(
    (item) => {
      if (item.children[0].innerHTML === id) {
        item.children[1].innerHTML = genus;
        item.children[2].innerHTML = name;
        item.children[3].innerHTML = family;
        item.children[4].innerHTML = order;
      }
    }
  );
}
function deletedEntry(id) {
  let entries = document.querySelectorAll("#body-contents .entry");
  entries.forEach((item) => {
    if (item.children[0].innerHTML === id) {
      item.remove();
    }
  });
}
