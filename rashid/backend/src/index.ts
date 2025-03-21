import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Тестовый маршрут
app.get('/', (req, res) => {
  res.json({ message: 'Бэкенд сервер работает!' });
});

app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
}); 