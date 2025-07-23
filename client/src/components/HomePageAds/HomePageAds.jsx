import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../AppContext'
import boomImage from '../../assets/boom.png';

const HomePageAds = () => {

  const { allProducts } = useContext(AppContext); 
  const [ images, setImages ] = useState([]);
  const [ currentImage, setCurrentImage ] = useState('');
  const [fade, setFade] = useState(false);
  
  useEffect(() => {
    if (allProducts.length > 0) {
      setImages(allProducts.map((product) => product));
    }
  }, [allProducts]);

  useEffect(() => {
    if (images.length === 0) return; 

    let index = 0;
    setCurrentImage(images[index]);
  
    const interval = setInterval(() => {
      setFade(true); // Start fade-out
      setTimeout(() => {
        index = (index + 1) % images.length;  
        setCurrentImage(images[index]);
        setFade(false); // Fade-in new image
      }, 500);
    }, 5000);

    return () => clearInterval(interval);
  }, [images]);

  return (
    <div 
      className='flex justify-center relative border-5 border-[#A08963] lg:shadow-[-6px_10px_45px_rgba(0,0,0,0.3)] rounded bg-white backdrop-blur-xl w-screen 
      md:w-80 h-70 mt-4 '
    >
        {currentImage && 
          <div className='max-w-screen'>
            <img 
              src={currentImage.image} 
              alt="Advertisement" 
              className={`max-h-full max-w-full object-contain transition-opacity duration-500 
                ${fade ? "opacity-0" : "opacity-100"}`}
            />
            <span className='h-18 w-20 absolute -bottom-12 right-5 lg:right-4 flex justify-center items-center overflow-hidden 
              bg-[url("/scrapBook/tag.png")] bg-contain bg-no-repeat animate-float origin-top'
            >
              {/* <img src={boomImage} alt="" className='absolute z-0 scale-180 animate-semi-spin font-poppins h-20 w-20'/> */}
              <p className={`mx-auto text-white transition-opacity z-5 duration-500 text-sm text-center ${fade ? "opacity-0" : "opacity-100"}`}>Rs. <br /> {currentImage.price}</p>
            </span>
          </div>
        }
    </div>
  )
}

export default HomePageAds