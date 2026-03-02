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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
