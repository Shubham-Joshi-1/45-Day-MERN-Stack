const express = require('express');
const app = express();

app.use(express.json());

app.get('/api', (req, res) => {
  res.json({ message: 'API is running!' });
});

app.get('/', (req, res) => {
  res.send(`
    <h1>Hello from Express!</h1>
    <p>Visit <a href="/api">/api</a> for JSON response</p>
  `);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});