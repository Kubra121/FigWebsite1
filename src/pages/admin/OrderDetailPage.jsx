import { supabase } from '../../supabaseClient';
import { useEffect, useState } from 'react';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

// ✅ DOĞRU FONT BAĞLAMA (HATA BURADAYDI)
pdfMake.vfs = pdfFonts.vfs;

// (İleride custom font istersen hazır)
pdfMake.fonts = {
  Roboto: {
    normal: 'Roboto-Regular.ttf',
    bold: 'Roboto-Medium.ttf',
    italics: 'Roboto-Italic.ttf',
    bolditalics: 'Roboto-MediumItalic.ttf',
  },
};

// 🔴 LOGO (base64 olacaksa buraya koy)
const logoBase64 = null;

const OrderDetailPage = ({ orderId, onClose }) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;

    const id = typeof orderId === 'object' ? orderId.id : orderId;

    const fetchOrder = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from('orders')
        .select(
          `
          id,
          order_no,
          total_amount,
          status,
          order_date,
          shipping_address,
          phone,
          profiles ( first_name, last_name, email ),
          order_items (
            quantity,
            price,
            products(name)
          )
        `
        )
        .eq('id', id)
        .single();

      if (error) {
        console.error('Sipariş çekme hatası:', error);
      } else {
        setOrder(data);
      }

      setLoading(false);
    };

    fetchOrder();
  }, [orderId]);

  if (loading)
    return <p className='p-4 mt-16'>Sipariş detayları yükleniyor...</p>;

  if (!order) return <p className='p-4 mt-16'>Sipariş bulunamadı.</p>;

  // ================= PDF =================
  const generatePDF = () => {
    const tableBody = [
      [
        { text: 'Ürün', bold: true },
        { text: 'Adet', bold: true },
        { text: 'Birim Fiyat', bold: true },
        { text: 'Toplam', bold: true },
      ],
      ...order.order_items.map((item) => [
        item.products?.name || 'Ürün bulunamadı',
        item.quantity,
        `${item.price} ₺`,
        `${item.quantity * parseFloat(item.price)} ₺`,
      ]),
    ];

    const docDefinition = {
      pageSize: 'A4',
      pageMargins: [40, 90, 40, 60],

      footer: (currentPage, pageCount) => ({
        text: `${currentPage} / ${pageCount}`,
        alignment: 'center',
        fontSize: 9,
        margin: [0, 10, 0, 0],
      }),

      content: [
        // LOGO
        ...(logoBase64
          ? [
              {
                image: logoBase64,
                width: 120,
                alignment: 'left',
                margin: [0, 0, 0, 20],
              },
            ]
          : []),

        { text: 'FATURA', fontSize: 18, bold: true, margin: [0, 0, 0, 10] },

        // MÜŞTERİ + SİPARİŞ
        {
          columns: [
            [
              { text: 'Müşteri Bilgileri', bold: true },
              `İsim: ${order.profiles?.first_name || ''} ${
                order.profiles?.last_name || ''
              }`,
              `E-posta: ${order.profiles?.email || ''}`,
              `Telefon: ${order.phone}`,
              `Adres: ${order.shipping_address}`,
            ],
            [
              { text: 'Sipariş Bilgileri', bold: true },
              `Sipariş No: ${order.order_no}`,
              `Tarih: ${new Date(order.order_date).toLocaleDateString(
                'tr-TR'
              )}`,
              `Durum: ${order.status}`,
            ],
          ],
        },

        { text: '\n\n' },

        // ÜRÜN TABLOSU
        {
          table: {
            headerRows: 1,
            widths: ['*', 'auto', 'auto', 'auto'],
            body: tableBody,
          },
          layout: 'lightHorizontalLines',
        },

        { text: '\n' },

        // KARGO + ÖDEME
        {
          columns: [
            [
              { text: 'Kargo Bilgileri', bold: true },
              'Firma: Yurtiçi Kargo',
              'Teslim Süresi: 1–3 İş Günü',
            ],
            [
              { text: 'Ödeme Bilgileri', bold: true },
              'Ödeme Yöntemi: Kredi Kartı',
              'Ödeme Durumu: Ödendi',
            ],
          ],
        },

        { text: '\n' },

        // TOPLAM
        {
          text: `GENEL TOPLAM: ${order.total_amount} ₺`,
          alignment: 'right',
          fontSize: 14,
          bold: true,
        },
      ],

      defaultStyle: {
        font: 'Roboto',
        fontSize: 10,
      },
    };

    pdfMake.createPdf(docDefinition).download(`Fatura_${order.order_no}.pdf`);
  };

  // ================= UI =================
  return (
    <div className='fixed inset-0 bg-black/40 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg p-6 w-[600px] shadow-lg'>
        <h3 className='text-xl font-bold mb-3'>Sipariş #{order.order_no}</h3>

        <p>
          <strong>İsim:</strong> {order.profiles?.first_name}{' '}
          {order.profiles?.last_name}
        </p>
        <p>
          <strong>Adres:</strong> {order.shipping_address}
        </p>
        <p>
          <strong>Tarih:</strong>{' '}
          {new Date(order.order_date).toLocaleString('tr-TR')}
        </p>
        <p>
          <strong>Telefon:</strong> {order.phone}
        </p>

        <table className='w-full border mt-3'>
          <thead>
            <tr className='border-b bg-gray-100'>
              <th>Ürün</th>
              <th>Adet</th>
              <th>Fiyat</th>
              <th>Toplam</th>
            </tr>
          </thead>
          <tbody>
            {order.order_items.map((item, i) => (
              <tr key={i} className='border-b'>
                <td>{item.products?.name}</td>
                <td>{item.quantity}</td>
                <td>{item.price} ₺</td>
                <td>{item.quantity * parseFloat(item.price)} ₺</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className='flex justify-between mt-4'>
          <button
            onClick={generatePDF}
            className='bg-green-600 text-white px-4 py-2 rounded'
          >
            PDF İndir
          </button>
          <button
            onClick={onClose}
            className='bg-gray-400 text-white px-4 py-2 rounded'
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
