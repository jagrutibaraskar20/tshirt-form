const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.resolve(__dirname, '../public')));

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'tshirt_orders'
});

db.connect(err => {
  if (err) throw err;
  console.log('✅ Connected to MySQL Database');
});

app.post('/submit-order', (req, res) => {
  const { name, email, mobile, quantity, sizes } = req.body;
  const sizeString = sizes.join(', ');
  db.query(
    'INSERT INTO orders (name,email,mobile,quantity,sizes) VALUES (?,?,?,?,?)',
    [name, email, mobile, quantity, sizeString],
    (err) => {
      if (err) {
        console.error('❌ Error inserting data:', err);
        return res.status(500).send('Database error');
      }
      res.send('✅ Order saved successfully!');
    }
  );
});

app.get('/get-orders', (req, res) => {
  db.query('SELECT * FROM orders ORDER BY submitted_at DESC', (err, results) => {
    if (err) {
      console.error('❌ Error fetching data:', err);
      return res.status(500).send('Database error');
    }
    res.json(results);
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
app.delete('/delete-order/:id', (req, res) => {
  const id = req.params.id;
  const sql = `DELETE FROM orders WHERE id = ?`;

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('❌ Error deleting data:', err);
      return res.status(500).send('Database error');
    }
    res.send('✅ Entry deleted successfully');
  });
});

// DELETE order by ID
app.delete('/delete-order/:id', (req, res) => {
  const id = req.params.id;

  const sql = 'DELETE FROM orders WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('❌ Error deleting order:', err);
      return res.status(500).send('Failed to delete order');
    }

    if (result.affectedRows === 0) {
      return res.status(404).send('Order not found');
    }

    res.send('✅ Order deleted successfully');
  });
});
