import { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';

const emptyForm = {
  image_url: '',
  title: '',
  subtitle: '',
  order: 1,
};

const AdminCarousel = () => {
  const [banners, setBanners] = useState([]);
  const [editingBanner, setEditingBanner] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showListModal, setShowListModal] = useState(false); // Banner Listesi modal
  const [form, setForm] = useState(emptyForm);
  const [current, setCurrent] = useState(0);

  const fetchBanners = async () => {
    const { data } = await supabase
      .from('carousel_items')
      .select('*')
      .order('order');
    setBanners(data || []);
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  // Slider otomatik geçiş
  useEffect(() => {
    const activeBanners = banners.filter((b) => b.is_active);
    if (activeBanners.length === 0) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % activeBanners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [banners]);

  const handleAdd = async () => {
    await supabase
      .from('carousel_items')
      .insert([{ ...form, is_active: true }]);
    setForm(emptyForm);
    setShowAddModal(false);
    fetchBanners();
  };

  const saveEdit = async () => {
    await supabase
      .from('carousel_items')
      .update({
        image_url: editingBanner.image_url,
        title: editingBanner.title,
        subtitle: editingBanner.subtitle,
        order: editingBanner.order,
      })
      .eq('id', editingBanner.id);
    setEditingBanner(null);
    fetchBanners();
  };

  const toggleActive = async (id, current) => {
    await supabase
      .from('carousel_items')
      .update({ is_active: !current })
      .eq('id', id);
    fetchBanners();
  };

  const deleteBanner = async (id) => {
    if (!confirm('Silmek istediğine emin misin?')) return;
    await supabase.from('carousel_items').delete().eq('id', id);
    fetchBanners();
  };

  const activeBanners = banners.filter((b) => b.is_active);

  return (
    <div className='max-w-6xl mx-auto py-10'>
      <div className='flex justify-end mb-6'>
        <div className='flex gap-2'>
          <button
            onClick={() => setShowAddModal(true)}
            className='bg-[#04310a] text-white px-6 py-2 rounded-lg'
          >
            + Yeni Banner
          </button>
          <button
            onClick={() => setShowListModal(true)}
            className='bg-gray-700 text-white px-6 py-2 rounded-lg'
          >
            Banner Listesi
          </button>
        </div>
      </div>

      {/* Slider */}
      <div className='relative w-full h-[500px] mb-12 overflow-hidden rounded-2xl shadow'>
        {activeBanners.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === current ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={banner.image_url}
              className='w-full h-full object-cover'
            />
            <button
              onClick={() => setEditingBanner(activeBanners[current])}
              className='absolute top-4 right-4 bg-white/90 p-2 rounded-full shadow hover:bg-white z-20'
            >
              ✏️
            </button>
          </div>
        ))}

        {/* Dots */}
        <div className='absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20'>
          {activeBanners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`w-3 h-3 rounded-full ${
                index === current ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Modallar */}
      {showAddModal && (
        <Modal
          title='Yeni Banner Ekle'
          onClose={() => setShowAddModal(false)}
          onSave={handleAdd}
          form={form}
          setForm={setForm}
        />
      )}

      {editingBanner && (
        <Modal
          title='Banner Düzenle'
          onClose={() => setEditingBanner(null)}
          onSave={saveEdit}
          form={editingBanner}
          setForm={setEditingBanner}
          toggleActive={toggleActive}
          deleteBanner={deleteBanner}
        />
      )}

      {showListModal && (
        <div className='fixed inset-0 bg-black/40 flex items-center justify-center z-50'>
          <div className='bg-white rounded-xl p-6 w-full max-w-2xl space-y-4'>
            <h3 className='text-xl font-bold mb-2'>Banner Listesi</h3>
            <div className='max-h-[400px] overflow-y-auto flex flex-col gap-2'>
              {banners.map((banner) => (
                <div
                  key={banner.id}
                  className='flex items-center gap-4 border p-3 rounded'
                >
                  {/* Fotoğraf */}
                  <img
                    src={banner.image_url}
                    alt={banner.title}
                    className='w-24 h-16 object-cover rounded flex-shrink-0'
                  />

                  {/* Başlık ve alt başlık */}
                  <div className='flex-1'>
                    <h4 className='font-semibold text-gray-800'>
                      {banner.title || 'Başlıksız Banner'}
                    </h4>
                    <p className='text-sm text-gray-500'>{banner.subtitle}</p>
                  </div>

                  {/* Butonlar */}
                  <div className='flex gap-2'>
                    <button
                      onClick={() => toggleActive(banner.id, banner.is_active)}
                      className={`px-3 py-1 rounded ${
                        banner.is_active
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-300'
                      }`}
                    >
                      {banner.is_active ? 'Aktif' : 'Pasif'}
                    </button>
                    <button
                      onClick={() => deleteBanner(banner.id)}
                      className='px-3 py-1 rounded bg-red-600 text-white'
                    >
                      Sil
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className='flex justify-end mt-4'>
              <button
                onClick={() => setShowListModal(false)}
                className='px-4 py-2 bg-gray-200 rounded'
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* Modal Component */
/* Modal Component */
const Modal = ({
  title,
  onClose,
  onSave,
  form,
  setForm,
  toggleActive,
  deleteBanner,
}) => (
  <div className='fixed inset-0 bg-black/40 flex items-center justify-center z-50'>
    <div className='bg-white rounded-xl p-6 w-full max-w-md space-y-5'>
      <h3 className='text-xl font-bold mb-2'>{title}</h3>

      {/* Image Preview */}
      {form.image_url && (
        <div className='mb-2'>
          <img
            src={form.image_url}
            alt='Banner'
            className='w-full h-40 object-cover rounded'
          />
        </div>
      )}

      {/* Image Upload */}
      <div className='flex items-center gap-4'>
        <label className='w-28 text-sm font-medium'>Görsel Yükle</label>
        <input
          type='file'
          accept='image/*'
          onChange={async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}.${fileExt}`;

            const { data, error } = await supabase.storage
              .from('carousel')
              .upload(fileName, file, { upsert: true });

            if (error) {
              alert('Yükleme sırasında bir hata oluştu: ' + error.message);
              return;
            }

            const { publicURL } = supabase.storage
              .from('carousel')
              .getPublicUrl(data.path);

            setForm({ ...form, image_url: publicURL });
          }}
        />
      </div>

      {/* Title */}
      <div className='flex items-center gap-4'>
        <label className='w-28 text-sm font-medium'>Başlık</label>
        <input
          className='flex-1 border p-2 rounded'
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
      </div>

      {/* Subtitle */}
      <div className='flex items-center gap-4'>
        <label className='w-28 text-sm font-medium'>Alt Başlık</label>
        <input
          className='flex-1 border p-2 rounded'
          value={form.subtitle}
          onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
        />
      </div>

      {/* Order */}
      <div className='flex items-center gap-4'>
        <label className='w-28 text-sm font-medium'>Sıra</label>
        <input
          type='number'
          className='flex-1 border p-2 rounded'
          value={form.order}
          onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
        />
      </div>

      {/* Admin Actions */}
      {toggleActive && deleteBanner && (
        <div className='flex gap-2'>
          <button
            onClick={() => toggleActive(form.id, form.is_active)}
            className={`px-4 py-1 rounded ${
              form.is_active ? 'bg-green-600 text-white' : 'bg-gray-300'
            }`}
          >
            {form.is_active ? 'Aktif' : 'Pasif'}
          </button>
          <button
            onClick={() => deleteBanner(form.id)}
            className='text-red-600 font-semibold px-3 py-1 rounded'
          >
            Sil
          </button>
        </div>
      )}

      {/* Save / Cancel */}
      <div className='flex justify-end gap-2 pt-4'>
        <button onClick={onClose} className='px-4 py-2 bg-gray-200 rounded'>
          İptal
        </button>
        <button
          onClick={onSave}
          className='px-4 py-2 bg-[#04310a] text-white rounded'
        >
          Kaydet
        </button>
      </div>
    </div>
  </div>
);

export default AdminCarousel;
