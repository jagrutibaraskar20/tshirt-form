// User form handler
const form = document.getElementById('tshirtForm');
if (form) {
  let submissions = JSON.parse(localStorage.getItem('tshirtSubmissions')) || [];

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const entry = Object.fromEntries(formData.entries());
    submissions.push(entry);
    localStorage.setItem('tshirtSubmissions', JSON.stringify(submissions));
    alert('✅ Form submitted!');
    e.target.reset();
  });
}

// Admin login + export
function verifyAdmin() {
  const password = document.getElementById('adminPassword').value;
  const ADMIN_PASSWORD = "admin123"; // Change this password

  if (password === ADMIN_PASSWORD) {
    alert("✅ Access granted");
    document.getElementById('adminLogin').style.display = 'none';
    document.getElementById('exportSection').style.display = 'block';
  } else {
    alert("❌ Incorrect password");
  }
}

function exportToExcel() {
  const data = JSON.parse(localStorage.getItem('tshirtSubmissions') || '[]');

  if (data.length === 0) {
    alert('⚠️ No submissions to export.');
    return;
  }

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'T-Shirt Submissions');
  XLSX.writeFile(workbook, 'festival_tshirt_submissions.xlsx');
}
