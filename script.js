document.getElementById("tshirtForm").addEventListener("submit", function(e) {
  e.preventDefault(); // Stop the form from reloading the page

  const name = this.name.value.trim();
  const email = this.email.value.trim();
  const mobile = this.mobile.value.trim();
  const size = this.size.value;

  if (!name || !email || !mobile || !size) {
    alert("Please fill in all fields.");
    return;
  }

  // Get existing submissions
  const submissions = JSON.parse(localStorage.getItem("tshirtSubmissions") || "[]");

  // Add new submission
  submissions.push({ name, email, mobile, size });

  // Save to localStorage
  localStorage.setItem("tshirtSubmissions", JSON.stringify(submissions));

  // Optional: clear form
  this.reset();

  alert("✅ Order submitted successfully!");
});





function verifyAdmin() {
  const password = document.getElementById("adminPassword").value;
  const ADMIN_PASSWORD = "admin123";

  if (password === ADMIN_PASSWORD) {
    document.getElementById("login-box").style.display = "none";
    document.getElementById("exportSection").style.display = "block";
    loadSubmissions();

    // ✅ Attach search event AFTER exportSection is visible
    document.getElementById("searchInput").addEventListener("input", filterSubmissions);

  } else {
    alert("❌ Incorrect password");
  }
  
}

function loadSubmissions() {
  const table = document.getElementById("submissionsTable");
  const data = JSON.parse(localStorage.getItem("tshirtSubmissions") || "[]");

  // Set table headers
  table.innerHTML = `
    <tr>
      <th>Name</th>
      <th>Email</th>
      <th>Mobile</th>
      <th>Size</th>
      <th>Action</th>
    </tr>
  `;

  data.forEach((entry, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${entry.name}</td>
      <td>${entry.email}</td>
      <td>${entry.mobile}</td>
      <td>${entry.size}</td>
      <td><button class="delete-btn" onclick="deleteEntry(${index})">Delete</button></td>
    `;
    table.appendChild(row);
  });
}



function filterSubmissions() {
  const input = document.getElementById("searchInput").value.toLowerCase();
  const rows = document.querySelectorAll("#submissionsTable tr");

  rows.forEach((row, index) => {
    if (index === 0) return; // skip header row
    const text = row.innerText.toLowerCase();
    row.style.display = text.includes(input) ? "" : "none";
  });
}

function deleteEntry(index) {
  if (!confirm("Are you sure you want to delete this entry?")) return;

  const data = JSON.parse(localStorage.getItem("tshirtSubmissions") || "[]");
  data.splice(index, 1); // remove the entry
  localStorage.setItem("tshirtSubmissions", JSON.stringify(data));
  loadSubmissions(); // refresh the table
}

function exportToExcel() {
  const data = JSON.parse(localStorage.getItem('tshirtSubmissions') || '[]');

  if (data.length === 0) {
    alert("⚠️ No data found to export.");
    return;
  }

  const formatted = data.map(entry => ({
    "Name": entry.name,
    "Email": entry.email,
    "Mobile": entry.mobile,
    "Size": entry.size
  }));

  const worksheet = XLSX.utils.json_to_sheet(formatted);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "TShirt Orders");

  XLSX.writeFile(workbook, "Festival_TShirt_Orders.xlsx");
}
