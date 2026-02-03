const apiUrl = "https://gorest.co.in/public/v2/users";
const tableBody = document.querySelector("#usersTable tbody");

fetch(apiUrl)
  .then(res => res.json())
  .then(users => {
    users.forEach(user => createRow(user));
  });

function createRow(user) {
  const row = document.createElement("tr");

  row.innerHTML = `
    <td>${user.id}</td>
    <td contenteditable="false">${user.name}</td>
    <td contenteditable="false">${user.email}</td>
    <td contenteditable="false">${user.gender}</td>
    <td contenteditable="false">${user.status}</td>
    <td>
        <button class="action-btn edit-btn" onclick="editRow(this)">Edit</button>
        <button class="action-btn remove-btn" onclick="removeRow(this)">Remove</button>
    </td>
  `;

  tableBody.appendChild(row);
}


function removeRow(btn) {
  const row = btn.parentElement.parentElement;
  row.remove();
}


function editRow(btn) {
  const row = btn.parentElement.parentElement;
  const cells = row.querySelectorAll("td:not(:last-child)");

  if (btn.innerText === "Edit") {
    cells.forEach(cell => cell.contentEditable = "true");
    btn.innerText = "Save";
    btn.style.backgroundColor = "#27ae60";
  } else {
    cells.forEach(cell => cell.contentEditable = "false");
    btn.innerText = "Edit";
    btn.style.backgroundColor = "#3498db";
  }
}