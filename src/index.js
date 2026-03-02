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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
