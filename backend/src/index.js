import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import paymentRoutes from './routes/payment.routes.js';
import orderRoutes from './routes/payment.routes.js';

dotenv.config();

const app = express();

app.use(
  cors({
    origin: 'http://localhost:5173', // React frontend portu
  })
);
app.use(express.json());

// Form-data / URL-encoded parsing (Iyzico callback için şart)
app.use(express.urlencoded({ extended: true }));

app.use('/api/payments', paymentRoutes);
app.use('/api', orderRoutes);

app.get('/health', (req, res) => {
  res.json({ ok: true });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
