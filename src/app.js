require('dotenv').config();
const express = require('express');
const { query } = require('./config/db');

const app = express();

app.use(express.json());

// app.use('/api/categories', require('./routes/category.routes'));
// app.use('/api/products', require('./routes/product.routes'));

app.get('/api/health', (_req, res) => res.json({ status: 'ok', stack: 'express5' }));

app.get('/api/db/health', async (_req, res) => {
    try {
        const rows = await query('SELECT 1 AS ok');
        res.json({ db: 'ok', result: rows[0] });
    } catch (e) {
        res.status(500).json({ db: 'error', error: e.message });
    }
});

app.use((req, res) => {
    res.status(404).json({ message: 'Not Found' });
});

app.use((err, _req, res, _next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 API corriendo en http://localhost:${PORT}`);
});