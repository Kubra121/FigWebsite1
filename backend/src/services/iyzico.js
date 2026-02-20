// backend/src/services/iyzico.js
import Iyzipay from 'iyzipay';
import dotenv from 'dotenv';

// .env dosyasını yükle
dotenv.config();

// Konsolda kontrol et
console.log('IYZICO_URI:', process.env.IYZICO_URI);

export const iyzipay = new Iyzipay({
  apiKey: process.env.IYZICO_API_KEY,
  secretKey: process.env.IYZICO_SECRET_KEY,
  uri: process.env.IYZICO_URI, // BOŞ olmamalı
});
