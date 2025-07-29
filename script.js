// Handle T-Shirt form submission
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("tshirtForm");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault(); // Stop default form submission

      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const mobile = form.mobile.value.trim();
      const size = form.size.value;

      if (!name || !email || !mobile || !size) {
        alert("Please fill in all fields.");
        return;
      }

      // Get existing submissions or initialize
      const existing = JSON.parse(localStorage.getItem("tshirtSubmissions") || "[]");

      // Add new submission
      existing.push({ name, email, mobile, size });

      // Save to localStorage
      localStorage.setItem("tshirtSubmissions", JSON.stringify(existing));

      alert("✅ Submission saved!");
      form.reset();
    });
  }
});


// Make sure this is outside any event listener so it's global
function verifyAdmin() {
  const password = document.getElementById("adminPassword").value;
  const ADMIN_PASSWORD = "admin123";

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

