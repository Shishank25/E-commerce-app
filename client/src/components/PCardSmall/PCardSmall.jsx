import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../AppContext';
import axiosInstance from '../../utils/axiosInstance';

import { IoMdHeart } from "react-icons/io";
import { FaCartPlus } from "react-icons/fa";
import { BsCartCheck } from "react-icons/bs";
import tapeCorner from "/scrapBook/tapeCorner.png"

const PCardSmall = ({ prod_id, name, image, price, discount, available_colours, size_options }) => {

  const { user, wishlist, setWishlist, updateWishlist, cart, updateCart } = useContext(AppContext);

  const [ selectedColour, setSelectedColour ] = useState(null);
  const [ selectedSize, setSelectedSize ] = useState(null);

  const tapePos = [
    '-right-8 -top-8',
    '-left-8 -bottom-8',
    'rotate-90 -left-8 -top-8',
    'rotate-90 -right-8 -bottom-8',
    'mx-auto -bottom-10 -rotate-45',
    'mx-auto -top-10 -rotate-45'
  ];

  const bgs = [
    'bg-[url("/scrapBook/noteBg5.png")]',
    'bg-[url("/scrapBook/noteBg2.png")]',
    'bg-[url("/scrapBook/noteBg3.png")]',
    'bg-[url("/scrapBook/noteBg4.png")]',
    'bg-[url("/scrapBook/noteBg6.png")]',
  ]

  const [tapeClass] = useState(() => tapePos[Math.floor(Math.random() * tapePos.length)]);
  const [notebg] = useState(() => Math.floor(Math.random() * 5));

  const navigate = useNavigate();

  useEffect(()=>{
    if (available_colours !== 'no') {
      const coloursList = available_colours.split(',').map(c => c.trim());
      setSelectedColour(coloursList[0]);
    }
    if (size_options !== 'no') {
      const sizeList = size_options.split(',').map(s => s.trim());
      setSelectedSize(sizeList[0]);
    }
    
    
  },[]);

  return (
    <div
      className='flex md:flex-col justify-between items-center product
      h-50 md:h-120 w-full md:w-90 md:mx-auto pt-2 my-8 shadow-md bg-[#D1A980]
      hover:shadow-xl rounded-md border-0 border-[#D4C9BE] hover:scale-102 transition-transform'
    >
        <div 
          className={`flex justify-end md:justify-center items-center h-full w-2/5 md:w-auto 
          overflow-hidden cursor-pointer
          ${bgs[notebg]} bg-cover bg-no-repeat`} 
          onClick={()=>{navigate(`/products/${prod_id}?colour=${selectedColour}&size=${selectedSize}`)}}
        >
            <img 
              src={image} 
              alt="product_img" 
              className='max-h-4/5 md:max-h-full border-white border-5 max-w-9/10 object-contain rounded-sm'/>
        </div>


        <div 
          className='flex flex-col items-center h-full md:h-2/5 w-full justify-evenly cursor-pointer ' 
          onClick={()=>{navigate(`/products/${prod_id}?colour=${selectedColour}&size=${selectedSize}`)}}
        >
          <p className='text-center text-2xl font-[500] font-caveat'>{name}</p>
          <div className='flex flex-col items-center'>
            <p className='text-slate-700 text-sm'>{discount}% off</p>
            <p>Rs {price}</p>
          </div>
        </div>


        <div className='flex flex-col md:flex-row h-full md:h-1/6 md:w-full rounded-b-xl justify-around items-start text-xl '>
          <button 
            className={`hover:text-red-400 cursor-pointer lg:scale-150 ${wishlist?.find(p => p.prodId === prod_id) ? 'text-red-400' : ''}`}
            onClick={()=>{
              updateWishlist({prodId: prod_id, selectedColour: selectedColour || '', selectedSize: selectedSize || ''}); 
            }}
          >
            <IoMdHeart />
          </button>
          <button 
            className='hover:text-blue-500 cursor-pointer lg:scale-150' 
            onClick={()=>{
              updateCart({ prodId: prod_id, selectedColour: selectedColour || '', selectedSize: selectedSize || '', quantity: 1, price: price }); 
            }}
          >
            {cart.find(item => item.prodId === prod_id && item.selectedColour === (selectedColour || '') && item.selectedSize === (selectedSize || '')) ? <BsCartCheck title='Remove from cart' className='text-green-500'/> :<FaCartPlus title='Add to cart'/>}
          </button>
        </div>

        <img src={tapeCorner} alt="tape" className={`absolute max-h-20 ${tapeClass}`}/>
    </div>
  )
}

export default PCardSmall;