function verifyAdmin() {
  const password = document.getElementById("adminPassword").value;
  const ADMIN_PASSWORD = "admin123"; // Set your admin password

  if (password === ADMIN_PASSWORD) {
    document.getElementById("login-box").style.display = "none";
    document.getElementById("exportSection").style.display = "block";
  } else {
    alert("❌ Incorrect password");
  }
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
