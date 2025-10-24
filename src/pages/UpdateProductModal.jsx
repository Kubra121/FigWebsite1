// UpdateProductModal.jsx

const UpdateProductModal = ({ product, onChange, onClose, onSave }) => {
  if (!product) return null;

  return (
    <div className='fixed inset-0 flex justify-center items-center z-50'>
      <div className='bg-white p-6 rounded shadow-lg w-96'>
        <h3 className='text-xl font-semibold mb-4'>Ürünü Güncelle</h3>
        <input
          type='text'
          placeholder='Ürün Adı'
          value={product.name}
          onChange={(e) => onChange({ ...product, name: e.target.value })}
          className='border p-2 rounded mb-2 w-full'
        />
        <input
          type='number'
          placeholder='Fiyat'
          value={product.price}
          onChange={(e) =>
            onChange({ ...product, price: parseFloat(e.target.value) })
          }
          className='border p-2 rounded mb-2 w-full'
        />

        <input
          type='number'
          placeholder='Stok'
          value={product.stock}
          onChange={(e) =>
            onChange({ ...product, stock: parseInt(e.target.value) })
          }
          className='border p-2 rounded mb-4 w-full'
        />
        <div className='flex justify-end gap-2'>
          <button
            onClick={onClose}
            className='px-4 py-2 border rounded hover:bg-gray-200'
          >
            İptal
          </button>
          <button
            onClick={onSave}
            className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
          >
            Kaydet
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateProductModal;
