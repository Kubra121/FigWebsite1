const ProductCard = ({ product }) => {
  return (
    <div className='border rounded-2xl shadow-md hover:shadow-xl transition-transform duration-300 p-4 xl:scale-95 2xl:scale-90 h-[400px] flex flex-col'>
      <img
        src={product.image_url}
        alt={product.name}
        className='w-full h-48 object-cover rounded-xl mb-4'
      />
      <div className='flex-grow'>
        <h3 className='text-xl font-semibold'>{product.name}</h3>
        <p className='text-gray-600'>{product.description}</p>
      </div>
      <p className='text-lg font-bold mt-2 text-[#04310a]'>
        {product.price} TL
      </p>
      <button className='mt-4 w-full bg-[#04310a] text-white py-2 rounded-full hover:bg-[#06531c] transition'>
        Sepete Ekle
      </button>
    </div>
  );
};

export default ProductCard;
