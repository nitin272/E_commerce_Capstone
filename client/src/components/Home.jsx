import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import Home1 from '../assets/ScaleMart_enhanced.webp';
import Home2 from '../assets/Home2.png';
import Home3 from '../assets/Home3.png';
import { Typewriter } from 'react-simple-typewriter';
import Footer from './footer.jsx';

const Home = () => {
  const [count, setCount] = useState(0);

  const bgImages = [
    {
      img: Home1,
      content: 'Shop Precision, Shop Scalemart',
      line: "Your one-stop destination for reliable and accurate weighing scales."
    },
    {
      img: Home2,
      content: 'Unmatched Quality, Trusted Results',
      line: "Browse our collection of premium weighing solutions designed for every need."
    },
    {
      img: Home3,
      content: 'Innovative Weighing Solutions',
      line: "Advanced technology to ensure precision for your weighing needs."
    },
    {
      img: Home1,
      content: 'Durability You Can Rely On',
      line: "Long-lasting, accurate, and easy-to-use weighing scales."
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prevCount) => (prevCount + 1) % bgImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className='overflow-auto scrollbar-thin scrollbar-webkit' style={{ marginTop: "12vh" }}>
      <Navbar option='' />
      <div
        style={{
          backgroundImage: `url(${bgImages[count].img})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transition: 'background-image 1s ease-in-out',
        }}
        className='relative bg-no-repeat bg-center h-[40vh] md:h-[80vh] lg:h-[105vh]'
      >
        <div className='absolute inset-0 flex items-center justify-center'>
          {/* Text container with a semi-transparent background */}
          <div className='text-center text-white p-4 md:p-8 lg:p-12 rounded-lg bg-black bg-opacity-50'>
            <h1 className='text-2xl md:text-4xl lg:text-5xl font-serif font-bold mb-2 md:mb-4'>
              <Typewriter
                words={[bgImages[count].content]}
                cursor
                cursorStyle='|'
                typeSpeed={65}
                deleteSpeed={40}
                delaySpeed={500}
                loop
              />
            </h1>
            <p className='text-sm md:text-lg lg:text-xl font-serif font-semibold leading-relaxed'>
              {bgImages[count].line}
            </p>
          </div>
        </div>
      </div>

      <div className='w-full md:w-4/5 lg:w-3/5 mx-auto text-center my-8 px-4'>
        <h2 className='text-2xl md:text-3xl lg:text-4xl font-serif font-bold mb-6'>
          Welcome to Scalemart
        </h2>
        <p className='text-sm md:text-lg lg:text-xl font-serif leading-8 tracking-wide'>
          Discover the precision and reliability of our weighing scales. Each product is crafted to provide accurate measurements and long-lasting durability. Trust in our innovative solutions to meet your weighing needs. Experience the quality and convenience that our scales bring to your daily life.
        </p>
      </div>

      <Footer />
    </div>
  );
};

export default Home;
