// UpdateProductModal.jsx

const UpdateProductModal = ({ product, onChange, onClose, onSave }) => {
  if (!product) return null;

  return (
    <div className='fixed inset-0 flex justify-center items-center z-50'>
      <div className='bg-white p-6 rounded shadow-lg w-96'>
        <h3 className='text-xl font-semibold mb-4'>Ürünü Güncelle</h3>

        {/* Ürün Adı */}
        <div className='flex items-center mb-3'>
          <label className='w-32 font-medium'>Ürün Adı:</label>
          <input
            type='text'
            value={product.name}
            onChange={(e) => onChange({ ...product, name: e.target.value })}
            className='border p-2 rounded flex-1'
          />
        </div>

        {/* Fiyat */}
        <div className='flex items-center mb-3'>
          <label className='w-32 font-medium'>Fiyat:</label>
          <input
            type='number'
            value={product.price}
            onChange={(e) =>
              onChange({ ...product, price: parseFloat(e.target.value) })
            }
            className='border p-2 rounded flex-1'
          />
        </div>

        {/* Stok */}
        <div className='flex items-center mb-4'>
          <label className='w-32 font-medium'>Stok:</label>
          <input
            type='number'
            value={product.stock}
            onChange={(e) =>
              onChange({ ...product, stock: parseInt(e.target.value) })
            }
            className='border p-2 rounded flex-1'
          />
        </div>

        {/* Butonlar */}
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
