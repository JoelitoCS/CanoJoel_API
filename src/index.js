import 'dotenv/config';
import express from 'express';


const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/api', (req, res) => {
  res.json({
    missatge: 'API de Cerveses',
    versio: '1.0',
    endpoints: ['/api', '/api/cervezas (a implementar)']
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({ estat: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Servidor escoltant a http://localhost:${PORT}`);
});