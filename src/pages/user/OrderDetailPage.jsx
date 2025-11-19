import { supabase } from '../../supabaseClient';
import { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const OrderDetailPage = ({ orderId, onClose }) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;

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
          profiles!orders_user_id_fkey (first_name, last_name, email),
          order_items!order_items_order_id_fkey (
            quantity,
            price,
            products!order_items_product_id_fkey (product_name)
          )
        `
        )
        .eq('id', orderId)
        .single();

      if (error) console.error(error);
      else setOrder(data);
      setLoading(false);
    };

    fetchOrder();
  }, [orderId]);

  if (loading) return <p>Sipariş detayları yükleniyor...</p>;
  if (!order) return <p>Sipariş bulunamadı.</p>;

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text(`Sipariş No: ${order.order_no}`, 10, 10);
    doc.text(
      `İsim: ${order.profiles.first_name} ${order.profiles.last_name}`,
      10,
      20
    );
    doc.text(
      `Tarih: ${new Date(order.order_date).toLocaleDateString()}`,
      10,
      30
    );
    doc.text(`Adres: ${order.shipping_address}`, 10, 40);

    const tableData = order.order_items.map((item) => [
      item.products.product_name,
      item.quantity,
      `${item.price} ₺`,
      `${item.quantity * item.price} ₺`,
    ]);

    doc.autoTable({
      head: [['Ürün', 'Adet', 'Fiyat', 'Toplam']],
      body: tableData,
      startY: 50,
    });

    doc.text(
      `Toplam: ${order.total_amount} ₺`,
      10,
      doc.lastAutoTable.finalY + 10
    );
    doc.save(`Siparis_${order.order_no}.pdf`);
  };

  return (
    <div className='fixed inset-0 bg-black/40 flex items-center justify-center'>
      <div className='bg-white rounded-lg p-6 w-[600px] shadow-lg'>
        <h3 className='text-xl font-bold mb-3'>Sipariş #{order.order_no}</h3>
        <p>
          <strong>İsim:</strong> {order.profiles.first_name}{' '}
          {order.profiles.last_name}
        </p>
        <p>
          <strong>Adres:</strong> {order.shipping_address}
        </p>
        <p>
          <strong>Tarih:</strong> {new Date(order.order_date).toLocaleString()}
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
                <td>{item.products.product_name}</td>
                <td>{item.quantity}</td>
                <td>{item.price} ₺</td>
                <td>{item.quantity * item.price} ₺</td>
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
