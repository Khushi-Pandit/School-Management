const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./db/db');
const schoolRoutes = require('./routes/schoolroutes');

const app = express();
connectDB();

app.use(bodyParser.json());
app.use('/api', schoolRoutes); // Mount routes at '/api'

app.get('/', (req, res) => {
    res.send('Welcome to School Management API');
});

// Catch-All 404 Handler
app.use((req, res) => {
    res.status(404).send('Route not found');
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
