//! CRUD

const api = "http://localhost:8000/products";

//! Create
let inpName = $(".inp-name");
let inpSurname = $(".inp-surname");
let inpNumber = $(".inp-number");
let addForm = $(".add-form");

addForm.on("submit", async (event) => {
  event.preventDefault();
  let name = inpName.val().trim();
  let surname = inpSurname.val().trim();
  let number = inpNumber.val().trim();
  let newBook = {
    name: name,
    surname: surname,
    number: number,
  };
  for (let key in newBook) {
    if (!newBook[key]) {
      alert("Заполните все поля");
      return;
    }
  }
  const responce = await fetch(api, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newBook),
  });
  inpName.val("");
  inpSurname.val("");
  inpNumber.val("");
  Toastify({
    text: "Successfully added",
    duration: 3000,
    close: true,
    gravity: "top", // `top` or `bottom`
    position: "left", // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      background:
        "linear-gradient(90deg, rgba(37,224,112,1) 18%, rgba(3,56,244,1) 100%)",
    },
  }).showToast();
  getProducts();
});

//! Read

let tbody = $("tbody");

async function getProducts() {
  const responce = await fetch(api);
  const data = await responce.json();

  let first = currentPage * postsPerPage - postsPerPage;
  let last = currentPage * postsPerPage;
  const currentProducts = data.slice(first, last);
  lastPage = Math.ceil(data.length / postsPerPage);

  if (currentPage === 1) {
    prevBtn.addClass("disabled");
  } else {
    prevBtn.removeClass("disabled");
  }

  if (currentPage === lastPage) {
    nextBtn.addClass("disabled");
  } else {
    nextBtn.removeClass("disabled");
  }

  tbody.html("");
  currentProducts.forEach((item, index) => {
    tbody.append(`
    <tr>
        <td>${index + 1}</td>
        <td>${item.name}</td>
        <td>${item.surname}</td>
        <td>${item.number}</td>
        <td>
          <button id="${item.id}" class="btn-delete btn btn-danger">
            Удалить
          </button>
          <button id="${
            item.id
          }" class="btn-edit btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
            Редактировать
          </button></td>
        </tr>
      `);
  });
}
getProducts();

// //! Delete

$(document).on("click", ".btn-delete", async (event) => {
  let id = event.currentTarget.id;
  await fetch(`${api}/${id}`, {
    method: "DELETE",
  });
  getProducts();
  Toastify({
    text: "Successfully delete",
    duration: 3000,
    close: true,
    gravity: "top", // `top` or `bottom`
    position: "right", // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      background:
        "linear-gradient(90deg, rgba(37,224,112,1) 18%, rgba(3,56,244,1) 100%)",
    },
  }).showToast();
});

//! Update

let editName = $(".edit-name");
let editSurname = $(".edit-surname");
let editNumber = $(".edit-number");
let editForm = $(".edit-form");
let editModal = $(".modal");

$(document).on("click", ".btn-edit", async (event) => {
  let id = event.currentTarget.id;
  editForm.attr("id", id);
  const responce = await fetch(`${api}/${id}`);
  const data = await responce.json();
  editName.val(data.name);
  editSurname.val(data.surname);
  editNumber.val(data.number);
});
editForm.on("submit", async (event) => {
  event.preventDefault();
  let name = editName.val().trim();
  let surname = editSurname.val().trim();
  let number = editNumber.val().trim();
  let editContact = {
    name: name,
    surname: surname,
    number: number,
  };
  let id = event.currentTarget.id;
  await fetch(`${api}/${id}`, {
    method: "PUT",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(editContact),
  });
  getProducts();
  editModal.modal("hide");
  getProducts();
  Toastify({
    text: "Successfully changed",
    duration: 3000,
    close: true,
    gravity: "top", // `top` or `bottom`
    position: "right", // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      background:
        "linear-gradient(90deg, rgba(37,224,112,1) 18%, rgba(3,56,244,1) 100%)",
    },
  }).showToast();
});

//! Pagination

let prevBtn = $(".prev-btn");
let nextBtn = $(".next-btn");

let postsPerPage = 8;
let currentPage = 1;
let lastPage = 1;

nextBtn.on("click", () => {
  if (currentPage === lastPage) {
    return;
  }
  currentPage++;
  getProducts();
  window.scrollTo(0, 0);
});

prevBtn.on("click", () => {
  if (currentPage === 1) {
    return;
  }
  currentPage--;
  getProducts();
  window.scrollTo(0, 0);
});
