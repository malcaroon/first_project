import express from 'express'
const app = express()
const port = 5000

app.use(express.json());

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
app.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM users WHERE user_id = ?', [
      req.params.id
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({message: 'User not found'});
    }

    res.status(200).json({message: 'User deleted successfully'});
  } catch (error) {
    res.status(500).json({error: error.message});
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
