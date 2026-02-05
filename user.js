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


  const capitalize = (text) =>
    text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();


  const fetchUsers = () => {
    tableBody.innerHTML = "";

    fetch(apiUrl, { cache: "no-store" })
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(users => users.forEach(createRow))
      .catch(() => alert("Unable to load users"));
  };

  const createRow = (user) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${user.id}</td>
      <td contenteditable="false">${user.name}</td>
      <td contenteditable="false">${user.email}</td>
      <td contenteditable="false">${capitalize(user.gender)}</td>
      <td contenteditable="false">${capitalize(user.status)}</td>
      <td>
        <button class="action-btn edit-btn">Edit</button>
        <button class="action-btn remove-btn">Remove</button>
      </td>
    `;

    row.querySelector(".edit-btn").onclick = () => editRow(row);
    row.querySelector(".remove-btn").onclick = () => removeRow(row);

    tableBody.appendChild(row);
  };

  const removeRow = (row) => {
    const userId = row.children[0].innerText;

    fetch(`${apiUrl}/${userId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error();
        row.remove();
      })
      .catch(() => alert("Delete failed"));
  };

  const editRow = (row) => {
    const btn = row.querySelector(".edit-btn");
    const cells = row.querySelectorAll("td:not(:last-child)");
    const userId = row.children[0].innerText;

    if (btn.innerText === "Edit") {
      cells.forEach(cell => cell.contentEditable = "true");
      btn.innerText = "Save";
    } else {
      const updatedUser = {
        name: cells[1].innerText.trim(),
        email: cells[2].innerText.trim(),
        gender: cells[3].innerText.trim().toLowerCase(),
        status: cells[4].innerText.trim().toLowerCase()
      };

      fetch(`${apiUrl}/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updatedUser)
      })
        .then(res => {
          if (!res.ok) throw new Error();
          cells[3].innerText = capitalize(updatedUser.gender);
          cells[4].innerText = capitalize(updatedUser.status);
          cells.forEach(cell => cell.contentEditable = "false");
          btn.innerText = "Edit";
        })
        .catch(() => alert("Update failed"));
    }
  };


  addUserBtn.onclick = () => modal.style.display = "flex";
  closeModal.onclick = () => modal.style.display = "none";

  saveUser.onclick = () => {
    const newUser = {
      name: nameInput.value.trim(),
      email: `user${Date.now()}@mail.com`,
      gender: genderInput.value,
      status: statusInput.value
    };

    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(newUser)
    })
      .then(res => res.json())
      .then(user => {
        createRow(user);
        tableBody.prepend(tableBody.lastChild);

        modal.style.display = "none";
        nameInput.value = "";
        emailInput.value = "";
      })
      .catch(() => alert("User creation failed"));
  };

  const filterUsers = (value) => {
    const rows = document.querySelectorAll(".usersTable tbody tr");

    value = value.toLowerCase();

    rows.forEach(row => {
      const text = row.innerText.toLowerCase();
      row.style.display = text.includes(value) ? "" : "none";
    });
  };

  searchInput.addEventListener("input", (e) => {
    filterUsers(e.target.value);
  });

  fetchUsers();
