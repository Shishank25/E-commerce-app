import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../AppContext';
import axiosInstance from '../../utils/axiosInstance';

import Navbar from '../../components/Navbar/Navbar';
import HomePageAds from '../../components/HomePageAds/HomePageAds';
import PCardSmall from '../../components/PCardSmall/PCardSmall';
import Heading from '../../components/Heading/Heading';

import { IoIosArrowForward } from "react-icons/io";
import banner from '../../assets/JulyDeals.png'

const Home = () => {

  const { getAllProducts, allProducts } = useContext(AppContext);
  const [ currentProducts, setCurrentProducts ] = useState([]); 
  const [ cpLength, setCpLength ] = useState(20);

  useEffect(()=>{
    getAllProducts();
  }, []);

  useEffect(()=>{setCurrentProducts(allProducts.slice(0,cpLength));},[cpLength, allProducts])

  return (
    <div className='flex flex-col mb-10 max-w-screen'>

        {/* Search Bar and Profile Tab */}
        <header className='sticky top-0 lg:-top-2 z-10'>
          <Navbar />
        </header>

        {/* Content */}
        <div className='flex flex-col max-w-full lg:flex-row justify-center items-center mb-20 lg:mb-20 mt-20'>
            <div 
              className='lg:mr-10 w-screen h-40 lg:h-[300px] lg:w-[542px] flex lg:scale-100 bg-[url("/JulyDeals.png")] 
              bg-center bg-cover bg-no-repeat relative z-5 lg:shadow-[10px_10px_45px_rgba(0,0,0,0.3)]'
            >
              <div className={`hidden lg:block bg-[url("/scrapBook/scrapFrame2.png")] absolute -z-5 bg-cover h-[320px] w-[566px] -top-3 -left-2`}></div>
            </div>
            <HomePageAds />
        </div>

        <Heading text={'Featured Deals'} />

        <div className='flex flex-col sm:flex-row sm:flex-wrap gap-5 lg:w-[80%] h-auto md:px-2 py-2 md:mx-auto'>
          {currentProducts.map((product) => (

            <PCardSmall 
              key={product.id}
              prod_id={product.id} 
              name={product.name} 
              image={product.image} 
              price={product.price}
              discount={product.discount}
              available_colours={product.available_colours}
              size_options={product.size_options}
            />

          ))}
        </div>
        {cpLength < 100 && <span 
          className='group bg-white text-gray-600 flex items-center self-center rounded-lg border border-gray-400 w-auto p-1 justify-between hover:text-black transition-all my-10'
          onClick={()=>setCpLength(prev => prev+15)}  
        >
          <button className={`rounded-lg self-center cursor-pointer`}>
            show more
          </button>
          <span className='w-0 overflow-hidden group-hover:w-4 transition-all duration-600 cursor-pointer'>
            <IoIosArrowForward className='text-gray-600 group-hover:text-black'/>
          </span>
        </span>}
    </div>
  )
}

export default Home