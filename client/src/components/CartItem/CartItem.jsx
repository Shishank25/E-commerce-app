import React, { useState, useContext, useEffect } from 'react'
import { AppContext } from '../../AppContext'
import { useNavigate } from 'react-router-dom';

import { TbTrash } from "react-icons/tb";

const CartItem = ({ item, rank }) => {

  const { allProducts, updateQuantity, updateCart } = useContext(AppContext);
  const [ product, setProduct ] = useState(null);
  const navigate = useNavigate();

  useEffect(()=>{
    const isProduct = allProducts.find(product => product.id === item.prodId);
    setProduct(isProduct);
  },[product, updateQuantity])

    // Item Rank, img, name, price, amount, total, delete
  return (
    <>
    {product !== null && <div className='flex flex-col lg:flex-row justify-between items-center py-2 h-84 lg:h-24 w-full bg-white mb-5 border-1 border-[#808D7C] rounded-lg px-4'>

      <div className='flex lg:flex-row justify-between items-center w-full lg:w-4/10'>
        <p className='hidden lg:block'>{rank}</p>

        <img 
          src={product.image} 
          alt="prod-img" 
          className='flex justify-center max-h-42  lg:max-h-22 w-auto cursor-pointer' 
          onClick={()=>{navigate(`/products/${item.prodId}?colour=${item.selectedColour}&size=${item.selectedSize}`)}}
        />

        <div className='flex flex-col'>
          <p 
            className='flex flex-wrap lg:max-w-30 max-h-24 truncate cursor-pointer' 
            onClick={()=>{navigate(`/products/${item.prodId}?colour=${item.selectedColour}&size=${item.selectedSize}`)}}
          >
            {product.name}
          </p>
          <p className='text-gray-400'>{item.selectedColour}, {item.selectedSize}</p>
        </div>
      </div>

      <div className='flex flex-col lg:flex-row justify-between h-32 lg:h-auto items-end lg:items-center w-full lg:max-w-1/2'>
        <p className='lg:mr-4 text-sm'>Rs. {product.price}</p>

        <form className='flex border border-slate-500 lg:mr-4 rounded-lg h-12 items-center overflow-hidden'>
            <button 
              className='cursor-pointer h-full w-6 hover:bg-red-200' 
              type='button' 
              onClick={()=>updateQuantity(item.prodId, item.selectedColour, item.selectedSize, -1)}
              disabled={item.quantity == 1}
            >
              -
            </button>

            <input 
              type="number"
              disabled
              value={item.quantity}
              onChange={({target})=>updateQuantity(item.prodId, item.selectedColour, item.selectedSize, Number(target.value))} 
              className='w-8 text-center outline-none
              [&::-webkit-outer-spin-button]:appearance-none 
              [&::-webkit-inner-spin-button]:appearance-none [appearance:textfield]'
            />

            <button 
              className='cursor-pointer h-full w-6 hover:bg-green-200' 
              type='button' 
              onClick={()=>updateQuantity(item.prodId, item.selectedColour, item.selectedSize, 1)}
            >
              +
            </button>
        </form>

        <p>Rs. {product.price * item.quantity}</p>

        <button onClick={()=>updateCart(item)} className='hidden lg:block lg:ml-4 hover:text-red-500 cursor-pointer'><TbTrash/></button>
      </div>

      <button className='lg:hidden self-start w-6 text-2xl'><TbTrash/></button>
      </div>}
    </>
  )
}

export default CartItem