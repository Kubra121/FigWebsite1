import { FaFacebookSquare, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <div className='max-w-[1800px] mx-auto py-16 px-4 grid lg:grid-cols-3 gap-8 text-gray-300 ml-8'>
      <div>
        <h1 className='w-full text-3xl font-bold text-[#04310a]'>FIGELIA</h1>
        <p className='py-4'>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Id odit
          ullam iste repellat consequatur libero reiciendis, blanditiis
          accusantium.
        </p>
        <div>
          <div className='flex justify-left md:w-[75%] my-8'>
            <FaFacebookSquare size={30} />
            <p>Fig Elia</p>
          </div>
          <div className='flex justify-left md:w-[75%] my-8'>
            <FaInstagram size={30} />
            <p>@figeliaa_incir_zeytin</p>
          </div>
        </div>
      </div>
      <div className='lg:col-span-2 grid grid-cols-3 gap-6 mt-6 text-center'>
        <div>
          <h6 className='font-medium text-gray-400'>Hakkımızda</h6>
        </div>

        <div>
          <h6 className='font-medium text-gray-400'>Sertifikalar</h6>
        </div>

        <div>
          <h6 className='font-medium text-gray-400'>İletişim</h6>
        </div>
      </div>
    </div>
  );
};

export default Footer;
