document.getElementById('tshirtForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const name = this.name.value.trim();
  const email = this.email.value.trim();
  const mobile = this.mobile.value.trim();
  const quantity = parseInt(this.quantity.value);
  const sizes = [];
  if (!name || !email || !mobile || !quantity) {
    return alert('Please fill in all fields.');
  }
  for (let i = 1; i <= quantity; i++) {
    const sel = document.querySelector(`select[name="size_${i}"]`);
    if (!sel || !sel.value) {
      return alert(`Please select size for T-shirt ${i}`);
    }
    sizes.push(sel.value);
  }
  try {
    const res = await fetch('/submit-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, mobile, quantity, sizes })
    });
    const msg = await res.text();
    alert(msg);
    this.reset();
    document.getElementById('sizesContainer').innerHTML = '';
  } catch(err) {
    console.error(err);
    alert('❌ Failed to submit order');
  }
});

function verifyAdmin() {
  const password = document.getElementById('adminPassword').value;
  if (password === 'admin123') {
    document.getElementById('login-box').style.display = 'none';
    document.getElementById('exportSection').style.display = 'block';
    loadSubmissions();
    document.getElementById('searchInput').addEventListener('input', filterSubmissions);
  } else {
    alert('❌ Incorrect password');
  }
}

// loadSubmissions
async function loadSubmissions() {
  try {
    const res = await fetch('/get-orders');
    const data = await res.json();
    const table = document.getElementById('submissionsTable');
    table.innerHTML = `
      <tr>
        <th>Name</th>
        <th>Email</th>
        <th>Mobile</th>
        <th>Quantity</th>
        <th>Sizes</th>
        <th>Action</th>
      </tr>
    `;

    data.forEach(entry => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${entry.name}</td>
        <td>${entry.email}</td>
        <td>${entry.mobile}</td>
        <td>${entry.quantity}</td>
        <td>${entry.sizes}</td>
        <td>
          <button class="delete-btn" onclick="deleteEntry(${entry.id})">Delete</button>
        </td>
      `;
      table.appendChild(row);
    });
  } catch (err) {
    console.error(err);
    alert('❌ Failed to load orders');
  }
}


function filterSubmissions() {
  const q = document.getElementById('searchInput').value.toLowerCase();
  document.querySelectorAll('#submissionsTable tr').forEach((row, i) => {
    if (i === 0) return;
    row.style.display = row.innerText.toLowerCase().includes(q) ? '' : 'none';
  });
}

// delete entry

function deleteEntry(id) {
  if (!confirm("Are you sure you want to delete this entry?")) return;

  fetch(`http://localhost:3000/delete-order/${id}`, {
    method: "DELETE"
  })
  .then(res => res.text())
  .then(message => {
    alert(message);
    loadSubmissions(); // Refresh the table
  })
  .catch(err => {
    console.error("❌ Delete error:", err);
    alert("Failed to delete entry");
  });
}


function exportToExcel() {
  const data = Array.from(document.querySelectorAll('#submissionsTable tr:not(:first-child)'))
    .map(row => ({
      Name: row.cells[0].innerText,
      Email: row.cells[1].innerText,
      Mobile: row.cells[2].innerText,
      Quantity: row.cells[3].innerText,
      Sizes: row.cells[4].innerText
    }));
  if (data.length === 0) return alert('⚠️ No data to export.');
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Orders');
  XLSX.writeFile(wb, 'Festival_TShirt_Orders.xlsx');
}

document.getElementById('quantity').addEventListener('input', () => {
  const value = parseInt(document.getElementById('quantity').value);
  const cont = document.getElementById('sizesContainer');
  cont.innerHTML = '';
  if (value > 0) {
    for (let i = 1; i <= value; i++) {
      const label = document.createElement('label');
      label.textContent = `Size for T-shirt ${i}`;
      const select = document.createElement('select');
      select.name = `size_${i}`;
      select.required = true;
      select.innerHTML = `<option value="">Select Size</option>`;
      ['S', 'M', 'L', 'XL'].forEach(s => {
        const opt = document.createElement('option');
        opt.value = s;
        opt.textContent = s;
        select.append(opt);
      });
      cont.append(label, select, document.createElement('br'));
    }
  }
});
