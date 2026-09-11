import express from 'express';
import routes from './routes.js';

const app = express();
const PORT = 3000;

app.use(routes);
app.use(express.json());

app.get('/api/status', (req, res) => {
    res.json({ message: 'API is running successfully!' });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});