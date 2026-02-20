// import express from 'express';
// import iyzipay from '../../iyzico.js';

// const router = express.Router();

// /* ÖDEME BAŞLAT */
// router.post('/init', (req, res) => {
//   const { buyer, shippingAddress, billingAddress, basketItems } = req.body;

//   const totalPrice = basketItems
//     .reduce((sum, item) => sum + Number(item.price), 0)
//     .toFixed(2);

//   const request = {
//     locale: 'tr',
//     conversationId: '123456',
//     price: totalPrice,
//     paidPrice: totalPrice,
//     currency: 'TRY',
//     installment: 1,
//     paymentGroup: 'PRODUCT',
//     callbackUrl: 'http://localhost:5173/payment-result',

//     buyer: {
//       ...buyer,
//       identityNumber: '11111111111',
//     },

//     shippingAddress,
//     billingAddress,
//     basketItems,
//   };

//   iyzipay.checkoutFormInitialize.create(request, (err, result) => {
//     if (err) return res.status(500).json(err);
//     res.json(result);
//   });
// });

// /* ÖDEME DOĞRULAMA */
// router.post('/verify', (req, res) => {
//   iyzipay.checkoutForm.retrieve(
//     { locale: 'tr', token: req.body.token },
//     (err, result) => res.json(result)
//   );
// });

// export default router;
