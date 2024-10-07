import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import Home1 from '../assets/Home1.jpg';

import Footer from './footer.jsx';
import { Typewriter } from 'react-simple-typewriter';

const Home = () => {
  const [count, setCount] = useState(0);

  const bgImages = [
    {
      img: Home1,
      content: 'Precision at Your Fingertips',
      line: "Experience the accuracy and reliability of our weighing scales.",
      contentHindi: 'आपकी उंगलियों पर सटीकता',
      lineHindi: "हमारे वजन तराजू की सटीकता और विश्वसनीयता का अनुभव करें।"
    },
    {
      img: Home1,
      content: 'Trust in Every Measurement',
      line: "Delivering consistent results, every single time.",
      contentHindi: 'हर माप में भरोसा',
      lineHindi: "हर बार, निरंतर परिणाम प्रदान करना।"
    },
    {
      img: Home1,
      content: 'Innovative Weighing Solutions',
      line: "Advanced technology for your weighing needs.",
      contentHindi: 'नवीनतम वजन समाधान',
      lineHindi: "आपकी वजन आवश्यकताओं के लिए उन्नत तकनीक।"
    },
    {
      img: Home1,
      content: 'Quality You Can Count On',
      line: "Durable, accurate, and easy to use.",
      contentHindi: 'गुणवत्ता जिस पर आप भरोसा कर सकते हैं',
      lineHindi: "टिकाऊ, सटीक और उपयोग में आसान।"
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prevCount) => (prevCount + 1) % bgImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className='overflow-auto scrollbar-thin scrollbar-webkit'>
      <Navbar option='' />
      <div
        style={{
          backgroundImage: `url(${bgImages[count].img})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '80vh',
          transition: 'background-image 1s ease-in-out',
        }}
        className='relative bg-no-repeat bg-center'
      >
        <div className='absolute inset-0 flex items-center justify-center'>
          <div className='text-center text-white p-8 md:p-12 rounded-lg bg-opacity-30'>
            <h1 className='text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-4'>
              <Typewriter
                words={[bgImages[count].content, bgImages[count].contentHindi]}
                cursor
                cursorStyle='|'
                typeSpeed={65}
                deleteSpeed={40}
                delaySpeed={500}
                loop
              />
            </h1>
            <p className='text-lg md:text-xl lg:text-2xl font-serif font-semibold leading-relaxed'>
              {bgImages[count].line}
              <br />
              {bgImages[count].lineHindi}
            </p>
          </div>
        </div>
      </div>
      <div className='w-full md:w-4/5 lg:w-3/5 mx-auto text-center my-8 px-4'>
        <h2 className='text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-6'>
          Welcome to Balaji Electronics
        </h2>
        <p className='text-lg md:text-xl lg:text-2xl font-serif leading-8 tracking-wide'>
          Discover the precision and reliability of our weighing scales. Each product is crafted to provide accurate measurements and long-lasting durability. Trust in our innovative solutions to meet your weighing needs. Experience the quality and convenience that our weighing scales bring to your daily life.
          <br /><br />
          हमारे वजन तराजू की सटीकता और विश्वसनीयता का अनुभव करें। हर उत्पाद को सटीक माप और लंबे समय तक टिकाऊपन प्रदान करने के लिए तैयार किया गया है। हमारी नवीनतम समाधानों पर भरोसा करें जो आपकी वजन आवश्यकताओं को पूरा करते हैं। हमारे वजन तराजू की गुणवत्ता और सुविधा का अनुभव करें जो आपके दैनिक जीवन को आसान बनाते हैं।
        </p>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
