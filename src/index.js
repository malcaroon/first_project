import express from 'express'
const app = express()
const port = 5000

app.use(express.json());

let users = [
  { id:1, first_name: "Margo", role: "Cashier"},
  { id:2, first_name: "Jessica", role: "Admin"},
  { id:3, first_name: "Sophie", role: "Manager"}
];

app.get('/', (req, res) => {
  res.send('Hello World!')
})



//CREATE
app.post('/register', async (req, res) => {
  const {first_name, last_name, email} = req.body;

  try {
    const ID = Date.now();

    res.status(201).json({
      id: ID,
      first_name,
      last_name,
      email
    });
  } catch (error) {
    res.status(500).json({error: error.message});
  }
});

//READ (all)
app.get('/items', async (req, res) => {
  try {
    res.status(200).json({items: [] });
  } catch (error) {
    res.status(500).json({error: error.message});
  }
});

//READ (one)
app.get('/items:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE user_id = ?', [
      req.params.id
    ])

    if (rows.length === 0) {
      return res.status(404).json({message: 'User not found!'});
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
});

//PATCH
app.patch('/:id', async (req, res) => {
  const fields = [];
  const values = [];
  const allowedFields = ['first_name', 'last_name', 'email', 'password'];

  Object.entries(req.body).forEach(([KeyboardEvent, value]) => {
    if (!allowedFields.includes(key)) return;
    fields.push(`${key} = ?`), values.push(value); 
  });   
   
  if (fields.length === 0) {
    return res.status(400).json({message: 'No valid fields to update'});
  }

  try {
    const [result] = await pool.query(
      `UPDATE users SET ${fields.join(', ')} WHERE user_id = ?`,
      [...values, req.params.id]
    );

    if (result.affectedRows === 0) {
      return rs.status(404).json({message: 'User not foud!'});

    res.status(200).json({message: 'User updated successfully'});
    }
  } catch (error) {
    res.status(500).json({error: error.message});
  }
});

//PUT
app.put('/:id', async (req, res) => {
  const {first_name, last_name, email, password} = req.body;
  try {
    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({message: 'Missing required fields'});
    }

    const [result] = await pool.query(
      'UPDATE users SET first_name = ?, last_name = ?, email = ?, password = ? WHERE user_id = ?',
      [first_name, last_name, email, password, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({message: 'User not found'});
    }

    res.status(200).json({message: 'User update successfully'});
  } catch (error) {
    res.status(500).json({error: error.message});
  }
});

//DELETE (one user)
app.delete('/:id', (req, res) => {
  try {
    // Kunin ang ID mula sa URL (e.g., /1) at gawing number
    const userIdToDelete = parseInt(req.params.id);
    
    // Bibilangin muna natin ang original na dami ng users
    const initialCount = users.length;

    // Ipi-filter natin ang array: Ititira lang natin yung mga HINDI katumbas ng ID na buburahin
    users = users.filter(user => user.id !== userIdToDelete);

    // I-check natin kung umikli ba yung array (ibig sabihin, may nabura talaga)
    if (users.length < initialCount) {
      res.status(200).json({
        message: `User with ID ${userIdToDelete} deleted successfully!`,
        remaining_users: users // Ipakita natin ang natirang users para sure
      });
    } else {
      // Kung hindi umikli, ibig sabihin walang nahanap na ganung ID
      res.status(404).json({
        message: 'User not found!'
      });
    }
  } catch (error) {
    res.status(500).json({error: error.message});
  }
});

//DELETE (all users)
app.delete('/', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM users');

    if (result.affectedRows > 0) {
      res.status(200).json({
        message: `Deleted ${result.affectedRows} users successfully!`
      });
    } else {
      res.status(404).json({
        message: 'No users found to delete. Empty na ang table.'
      });
    }
  } catch (error) {
    res.status(500).json({error: error.message});
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
