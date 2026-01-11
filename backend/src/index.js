// src/index.js
import express from 'express';
import cors from 'cors';
import sessionRoutes from './routes/sessionRoutes.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'ANTYO Focus backend running 🧠' });
});

app.use('/api', sessionRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
