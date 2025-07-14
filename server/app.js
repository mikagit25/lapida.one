require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Пример маршрута
app.get('/', (_, res) => res.json({ message: 'Lapida API v1' }));

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
