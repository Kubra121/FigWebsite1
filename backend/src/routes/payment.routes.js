import 'dotenv/config'; // otomatik process.env'e aktarır
import express from 'express';
import { iyzipay } from '../services/iyzico.js';
import { createClient } from '@supabase/supabase-js';

const router = express.Router();

// Supabase service role client
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SERVICE_ROLE_KEY,
);

// =========================
// Ödeme başlatma
// =========================
router.post('/iyzico', async (req, res) => {
  try {
    const { orderId, price, buyer } = req.body;

    // Basit validation
    if (
      !orderId ||
      !price ||
      !buyer ||
      !buyer.name ||
      !buyer.phone ||
      !buyer.email ||
      !buyer.address
    ) {
      console.error('❌ Validation failed');
      return res.status(400).json({ error: 'Eksik alan var' });
    }

    // =========================
    // Siparişi Supabase'e kaydet
    // =========================
    const { error: insertError } = await supabase.from('orders').insert([
      {
        id: orderId,
        user_id: buyer.user_id,
        total_amount: price,
        shipping_address: { address: buyer.address },
        status: 'PENDING',
        order_date: new Date(),
        phone: buyer.phone,
      },
    ]);

    // =========================
    // Iyzico request
    // =========================
    const fullName = buyer.name.trim();
    const nameParts = fullName.split(' ');
    const name = nameParts.shift();
    const surname = nameParts.join(' ') || 'User';

    const request = {
      locale: 'tr',
      conversationId: orderId,
      price: Number(price).toFixed(2),
      paidPrice: Number(price).toFixed(2),
      currency: 'TRY',
      basketId: orderId,
      paymentGroup: 'PRODUCT',
      callbackUrl: `${process.env.BASE_URL}/api/payments/callback`,
      buyer: {
        id: `BY-${orderId}`,
        name,
        surname,
        gsmNumber: `+90${buyer.phone.replace(/\D/g, '').slice(-10)}`,
        email: buyer.email,
        identityNumber: '11111111111',
        registrationAddress: buyer.address,
        city: 'Istanbul',
        country: 'Turkey',
        zipCode: '34000',
        ip: req.ip,
      },
      shippingAddress: {
        contactName: fullName,
        city: 'Istanbul',
        country: 'Turkey',
        address: buyer.address,
        zipCode: '34000',
      },
      billingAddress: {
        contactName: fullName,
        city: 'Istanbul',
        country: 'Turkey',
        address: buyer.address,
        zipCode: '34000',
      },
      basketItems: [
        {
          id: 'BI-1',
          name: 'Sepet Ürünleri',
          category1: 'E-Ticaret',
          itemType: 'PHYSICAL',
          price: Number(price).toFixed(2),
        },
      ],
    };

    iyzipay.checkoutFormInitialize.create(request, (err, result) => {
      if (err) {
        console.error('❌ IYZICO ERROR:', err);
        return res.status(500).json({ error: err.message || err });
      }

      if (result.status !== 'success') {
        console.error('❌ IYZICO FAIL:', result);
        return res
          .status(500)
          .json({ error: result.errorMessage || 'Iyzico error', result });
      }

      // Frontend PaymentResult sayfasına yönlendirme URL
      const redirectUrl = `http://localhost:5173/payment-result?orderId=${orderId}`;

      res.json({
        paymentPageUrl: result.paymentPageUrl,
      });
    });
  } catch (error) {
    console.error('🔥 Backend /iyzico error:', error);
    res.status(500).json({ error: error.message });
  }
});

// =========================
// Callback endpoint
// =========================
router.post('/callback', async (req, res) => {
  const { token } = req.body;

  try {
    // İyzico callback retrieve'i promise ile sarmala
    const result = await new Promise((resolve, reject) => {
      iyzipay.checkoutForm.retrieve({ token }, (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });

    const orderId = result.basketId;

    if (!orderId) {
      console.error('❌ basketId yok, callback bozuk');
      return res.status(400).send('NO ORDER ID');
    }

    if (result.paymentStatus === 'SUCCESS') {
      const { error: updateError } = await supabase
        .from('orders')
        .update({
          status: 'PAID',
          payment_id: result.paymentId,
          order_date: new Date(),
          shipping_address: result.shippingAddress,
        })
        .eq('id', orderId);

      if (updateError) console.error('❌ Supabase update error:', updateError);
      // res.send('OK'); // Iyzico callback için gerekli
      // 👇 KULLANICIYI FRONTEND’E GÖNDER
      return res.redirect(
        302,
        `http://localhost:5173/payment-result?orderId=${orderId}`,
      );
    } else {
      await supabase
        .from('orders')
        .update({ status: 'FAILED' })
        .eq('id', orderId);

      return res.redirect(
        302,
        `http://localhost:5173/payment-result?orderId=${orderId}&status=failed`,
      );
    }
  } catch (err) {
    console.error('🔥 Callback async error:', err);
    res.status(500).send('ERROR');
  }
});

// =========================
// Sipariş sorgulama
// =========================
router.get('/orders/:orderId', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', req.params.orderId)
      .single();

    if (error) return res.status(404).json({ error: 'Sipariş bulunamadı' });

    res.json(data);
  } catch (err) {
    console.error('🔥 GET /orders/:orderId error:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
