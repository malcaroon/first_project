import express from 'express'
const app = express()
const port = 5000

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/user', async (req, res) => {
  const {first_name, last_name, email, password} = req.body;

  try {
    res.status(201).json({
      first_name,
      last_name,
      email,
      password
    });
  } catch (error) {
    res.status(500).json({error: error.message});
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
