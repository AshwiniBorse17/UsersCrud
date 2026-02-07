const apiUrl = "https://gorest.co.in/public/v2/users";
const token = "5d713e4fab3225de8619cd3f50c50985e0322877c8e4c084ceab08cb3dc79c2a";

const searchInput = document.querySelector(".searchInput");


const tableBody = document.querySelector(".usersTable tbody");



const modal = document.querySelector(".userModal");
const addUserBtn = document.querySelector(".addUserBtn");
const closeModal = document.querySelector(".closeModal");
const saveUser = document.querySelector(".saveUser");

const nameInput = document.querySelector(".name");
const emailInput = document.querySelector(".email");
const genderInput = document.querySelector(".gender");
const statusInput = document.querySelector(".status");

const textField1 = document.querySelector(".small1");
const textField2 = document.querySelector(".small2");

nameInput.after(textField1);
emailInput.after(textField2);

const editModal = document.querySelector(".editUserModal");
const closeEditModal = document.querySelector(".closeEditModal");
const updateUserBtn = document.querySelector(".updateUserBtn");

const editName = document.querySelector(".editName");
const editEmail = document.querySelector(".editEmail");
const editGender = document.querySelector(".editGender");
const editStatus = document.querySelector(".editStatus");

let currentEditUserId = null;


const capitalize = (text = "") =>
  text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();


const pageLoader = document.querySelector(".page-loader");
const showPageLoader = () => {
  if (pageLoader) pageLoader.style.display = "block";
};

const hidePageLoader = () => {
  if (pageLoader) pageLoader.style.display = "none";
};


const fetchUsers = () => {
  tableBody.innerHTML = "";
  showPageLoader();

  fetch(apiUrl, {
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(res => {
      if (!res.ok) throw new Error();
      return res.json();
    })
    .then(users => {
      users.forEach(createRow);
    })
    .catch(() => alert("Unable to load users"))
    .finally(() => hidePageLoader());
};

const createRow = (user) => {
  const row = document.createElement("tr");

  row.innerHTML = `
    <td>${user.id}</td>
    <td>${user.name}</td>
    <td>${user.email}</td>
    <td>${capitalize(user.gender)}</td>
    <td>${capitalize(user.status)}</td>
    <td>
      <button class="action-btn edit-btn">Edit</button>
      <button class="action-btn remove-btn">Remove</button>
    </td>
  `;

  row.querySelector(".edit-btn").onclick = () => openEditPopup(row);
  row.querySelector(".remove-btn").onclick = () => removeRow(row);

  tableBody.appendChild(row);
};


const removeRow = (row) => {
  const userId = row.children[0].innerText;

  fetch(`${apiUrl}/${userId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(res => {
      if (!res.ok) throw new Error();
      fetchUsers();
    })
    .catch(() => alert("Delete failed"));
};


const openEditPopup = (row) => {
  currentEditUserId = row.children[0].innerText;

  editName.value = row.children[1].innerText;
  editEmail.value = row.children[2].innerText;
  editGender.value = row.children[3].innerText.toLowerCase();
  editStatus.value = row.children[4].innerText.toLowerCase();

  editModal.style.display = "flex";
};

updateUserBtn.onclick = () => {
  const updatedUser = {
    name: editName.value.trim(),
    email: editEmail.value.trim(),
    gender: editGender.value,
    status: editStatus.value
  };

  fetch(`${apiUrl}/${currentEditUserId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(updatedUser)
  })
    .then(res => {
      if (!res.ok) throw new Error();
      editModal.style.display = "none";
      fetchUsers();
    })
    .catch(() => alert("Update failed"));
};


closeEditModal.onclick = () => {
  editModal.style.display = "none";
};


addUserBtn.onclick = () => modal.style.display = "flex";
closeModal.onclick = () => modal.style.display = "none";


saveUser.onclick = () => {
  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const gender = genderInput.value;
  const status = statusInput.value;

  let isValid = true;
  textField1.innerText = "";
  textField2.innerText = "";

  if (!name) {
    textField1.innerText = "Name cannot be empty";
    isValid = false;
  }

  const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
  if (!gmailRegex.test(email)) {
    textField2.innerText = "Enter a valid Gmail address (@gmail.com)";
    isValid = false;
  }

  if (!isValid) return;

  fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ name, email, gender, status })
  })
    .then(res => {
      if (!res.ok) throw new Error();
      modal.style.display = "none";
      nameInput.value = "";
      emailInput.value = "";
      fetchUsers();
    })
    .catch(() => alert("User creation failed"));
};

const filterUsers = (value) => {
  const rows = document.querySelectorAll(".usersTable tbody tr");
  value = value.toLowerCase();

  rows.forEach(row => {
    row.style.display = row.innerText.toLowerCase().includes(value) ? "" : "none";
  });
};

searchInput.addEventListener("input", (e) => {
  filterUsers(e.target.value);
});


fetchUsers();
