import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { fetchProducts } from '../services/fetchProducts';
import { fetchUserRole } from '../services/fetchUserRole';
import UpdateProductModal from '../pages/UpdateProductModal';
import ActiveToggle from '../components/ActiveToggle';

const AdminProfilePage = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: 0,
    stock: 0,
    description: '',
    imageFile: null,
    is_active: true, // eklendi
  });
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [updatedProduct, setUpdatedProduct] = useState({
    id: null,
    name: '',
    price: 0,
    stock: 0,
    description: '',
    imageFile: null,
    image_url: null,
    is_active: true, // eklendi
  });

  const [activeTab, setActiveTab] = useState('add');
  const [userRole, setUserRole] = useState(null);

  // Kullanıcı rolünü al
  useEffect(() => {
    const getRole = async () => {
      const role = await fetchUserRole();
      setUserRole(role);
    };
    getRole();
  }, []);

  // Ürünleri getir
  const getProducts = async () => {
    setLoading(true);
    try {
      let data = await fetchProducts();
      data.sort((a, b) => {
        if (a.is_active === b.is_active) return a.id - b.id;
        return b.is_active - a.is_active;
      });
      setProducts(data);
    } catch (err) {
      console.error('Ürünler alınamadı:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  // Ürün Ekle
  const addProduct = async (e) => {
    e.preventDefault();
    const { name, price, stock, description, imageFile, is_active } =
      newProduct;

    if (!name || price <= 0) return alert('Geçerli ürün bilgisi giriniz.');

    // Aynı isimli ürün kontrolü
    const { data: existing, error: checkError } = await supabase
      .from('products')
      .select('id')
      .eq('name', name);

    if (checkError && checkError.code !== 'PGRST116') {
      // single() ile bulunamazsa PGRST116 dönebilir
      return alert('Ürün kontrol edilirken hata oluştu: ' + checkError.message);
    }

    if (existing.length > 0) {
      return alert('Bu isimde bir ürün zaten mevcut.');
    }

    let image_url = null;

    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('FigWebsiteImages')
        .upload(filePath, imageFile);

      if (uploadError)
        return alert('Resim yüklenemedi: ' + uploadError.message);

      const { data, error: urlError } = supabase.storage
        .from('FigWebsiteImages')
        .getPublicUrl(filePath);

      if (urlError) return alert('URL alınamadı: ' + urlError.message);

      image_url = data.publicUrl;
    }

    const { error } = await supabase
      .from('products')
      .insert([{ name, price, stock, description, image_url, is_active }]);

    if (error) return alert('Ürün eklenemedi: ' + error.message);

    alert('Ürün başarıyla eklendi!'); // ✅ Eklendi uyarısı

    setNewProduct({
      name: '',
      price: 0,
      stock: 0,
      description: '',
      imageFile: null,
      is_active: true,
    });
    getProducts();
  };

  // Modal ile Güncelle
  const openUpdateModal = (product) => {
    setUpdatedProduct({ ...product, imageFile: null });
    setShowModal(true);
  };

  const saveUpdate = async () => {
    const {
      id,
      name,
      price,
      stock,
      description,
      imageFile,
      is_active,
      image_url: currentUrl,
    } = updatedProduct;

    if (!id || !name || isNaN(price) || isNaN(stock) || stock < 0 || price <= 0)
      return alert('Geçerli değerler girin.');

    let image_url = currentUrl || null;

    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('FigWebsiteImages')
        .upload(filePath, imageFile);

      if (uploadError)
        return alert('Resim yüklenemedi: ' + uploadError.message);

      const { data, error: urlError } = supabase.storage
        .from('FigWebsiteImages')
        .getPublicUrl(filePath);

      if (urlError) return alert('URL alınamadı: ' + urlError.message);

      image_url = data.publicUrl;
    }

    const { error } = await supabase
      .from('products')
      .update({ name, price, stock, description, image_url, is_active })
      .eq('id', id);

    if (error) return alert('Güncelleme başarısız: ' + error.message);

    setProducts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, name, price, stock, description, image_url, is_active }
          : p
      )
    );

    setShowModal(false);
  };

  // Aktif/Pasif Yap
  const toggleActive = async (product) => {
    const { id, is_active } = product;
    const { error } = await supabase
      .from('products')
      .update({ is_active: !is_active })
      .eq('id', id);

    if (error) return alert('İşlem başarısız: ' + error.message);
    getProducts();
  };

  return (
    <div className='max-w-4xl mx-auto p-4'>
      <h2 className='text-2xl font-bold mb-4'>Admin Paneli</h2>

      <div className='flex mb-6 border-b'>
        <button
          className={`px-4 py-2 -mb-px border-b-2 font-semibold ${
            activeTab === 'add'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600'
          }`}
          onClick={() => setActiveTab('add')}
        >
          Ürün Ekle
        </button>
        <button
          className={`px-4 py-2 -mb-px border-b-2 font-semibold ${
            activeTab === 'list'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600'
          }`}
          onClick={() => setActiveTab('list')}
        >
          Ürün Listesi
        </button>
      </div>

      {activeTab === 'add' && (
        <form onSubmit={addProduct} className='flex flex-col gap-2'>
          <input
            type='text'
            placeholder='Ürün Adı'
            value={newProduct.name}
            onChange={(e) =>
              setNewProduct({ ...newProduct, name: e.target.value })
            }
            className='border p-2 rounded'
          />
          <input
            type='number'
            placeholder='Fiyat'
            value={newProduct.price}
            onChange={(e) =>
              setNewProduct({
                ...newProduct,
                price: parseFloat(e.target.value),
              })
            }
            className='border p-2 rounded'
          />
          <input
            type='number'
            placeholder='Stok'
            value={newProduct.stock}
            onChange={(e) =>
              setNewProduct({ ...newProduct, stock: parseInt(e.target.value) })
            }
            className='border p-2 rounded'
          />
          <textarea
            placeholder='Ürün Açıklaması'
            value={newProduct.description}
            onChange={(e) =>
              setNewProduct({ ...newProduct, description: e.target.value })
            }
            className='border p-2 rounded'
          />
          {userRole === 'admin' && (
            <input
              type='file'
              accept='image/*'
              onChange={(e) =>
                setNewProduct({ ...newProduct, imageFile: e.target.files[0] })
              }
              className='border p-2 rounded'
            />
          )}
          <button
            type='submit'
            className='bg-green-600 text-white py-2 rounded hover:bg-green-700'
          >
            Ekle
          </button>
        </form>
      )}

      {activeTab === 'list' && (
        <>
          {loading ? (
            <p>Yükleniyor...</p>
          ) : (
            <table className='w-full border-collapse'>
              <thead>
                <tr className='border-b'>
                  <th className='p-2 text-left'>ID</th>
                  <th className='p-2 text-left'>Ürün Adı</th>
                  <th className='p-2 text-left'>Fiyat</th>
                  <th className='p-2 text-left'>Stok</th>
                  <th className='p-2 text-left'>Açıklama</th>
                  <th className='p-2 text-left'>Fotoğraf</th>
                  <th className='p-2'>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className='border-b'>
                    <td className='p-2'>{product.id}</td>
                    <td className='p-2'>{product.name}</td>
                    <td className='p-2'>{product.price}</td>
                    <td className='p-2'>{product.stock}</td>
                    <td className='p-2'>{product.description}</td>
                    <td className='p-2'>
                      {product.image_url && (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className='h-16 w-16 object-cover rounded'
                        />
                      )}
                    </td>
                    <td className='p-2 flex gap-2'>
                      <button
                        onClick={() => openUpdateModal(product)}
                        className='bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700'
                      >
                        Güncelle
                      </button>
                      <ActiveToggle
                        productId={product.id}
                        isActive={product.is_active}
                        onChange={(newStatus) =>
                          setProducts((prev) =>
                            prev.map((p) =>
                              p.id === product.id
                                ? { ...p, is_active: newStatus }
                                : p
                            )
                          )
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}

      {showModal && (
        <UpdateProductModal
          product={updatedProduct}
          onChange={setUpdatedProduct}
          onClose={() => setShowModal(false)}
          onSave={saveUpdate}
        />
      )}
    </div>
  );
};

export default AdminProfilePage;
