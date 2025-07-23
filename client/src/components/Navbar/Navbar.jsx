import React, { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

import { AppContext } from '../../AppContext';
import Searchbar from '../../components/SearchBar/Searchbar';
import NavbarBottom from './NavbarBottom';
import Toast from '../Toast/Toast';

import { FaAngleDown } from "react-icons/fa6";
import { FaShoppingCart } from "react-icons/fa";
import { FiUser } from "react-icons/fi";
import { FaHome } from "react-icons/fa";

const Navbar = () => {

    const { getUserInfo, user, logout, tabOpen, setTabOpen, focused, setFocused, getAllProducts, cart, cartImages, cartImgs } = useContext(AppContext);
    const navigate = useNavigate();
    const [ cartTotal, setCartTotal ] = useState(0);

    const calTotal = () => {
      let total = 0;
      cart.forEach(item =>
        total += item.price * item.quantity
      );
      setCartTotal(total);
    }

    useEffect(()=>{
        getAllProducts();
        const accessToken = localStorage.getItem('token');
        if (accessToken) getUserInfo();
        calTotal();
        cartImages();
    },[])

    useEffect(()=>{
      calTotal();
      cartImages();
    },[cart])

  return (
    <>
    <nav 
      className={`flex justify-end sticky top-0 h-14 flex-wrap items-start pt-4 pb-2 transition-all z-50 
      border-b-1 border-orange-200 px-3 relative bg-[#B1C29E]`}
    >
        <span className='h-12 w-full absolute left-0 -bottom-12 z-5 bg-[url("/scrapBook/ribbonTear.png")] bg-cover bg-center bg-no-repeat'></span>

        <span 
          className='hidden lg:flex absolute bg-white rounded-xl h-8 w-8 items-center justify-center
          text-xl left-30 z-15 mt-1 hover:scale-110 transition-transform cursor-pointer' 
          onClick={()=>{navigate('/'); window.scrollTo(0, 0);}}
        >
          <FaHome />
        </span>

        <Searchbar className='z-50' focused={focused} setFocused={setFocused} tabOpen={tabOpen} setTabOpen={setTabOpen}/>

        <div 
          className={`flex justify-end md:mr-36 h-auto flex-grow`}
        >

          {/* Cart Button */}
          <div 
            className='flex flex-col justify-evenly items-center h-11 w-20 text-slate-500 border-2 border-[#6F826A] 
            transition-all duration-400 hover:text-black cursor-pointer relative group z-50
            bg-[#FEFAE0] hover:bg-[#CCE0AC] hover:font-semibold px-3 rounded-xl'
            onClick={()=>navigate('/cart')}
          >
              <p className='flex items-center'>{cart.length}<FaShoppingCart className='ml-2'/></p>
              <p className='hidden md:block text-xs text-ellipsis'>Rs {Math.ceil(cartTotal)}</p>

              <div className="absolute overflow-hidden overflow-y-auto left-0 top-9 mt-2 flex max-h-0 group-hover:max-h-40 w-20 flex-col bg-white px-2 rounded shadow-lg z-10 space-y-2 transition-all duration-500">
                {cart.length === 0 ? (
                  <span className="text-sm text-gray-500">Cart is empty</span>
                ) : (
                  cartImgs.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt={`Cart Item ${i}`}
                      className="w-16 h-16 rounded border"
                    />
                  ))
                )}
              </div>
          </div>

          {/* Profile Button */}
            <div 
              className={`hidden lg:flex flex-col items-center justify-between text-black 
              transition-all absolute right-[18%] rounded-xl w-20 duration-1000   
              ${tabOpen ? 'h-40 lg:h-36' : 'h-8 ease-out'}
              ${focused ? 'ml-2' : ' delay-600'}`}
            >
                    <div 
                      className={`flex justify-center items-start pb-4 w-24 bg-[#B1C29E] z-5`}
                    >
                        <p className='cursor-default bg-white pl-3 py-2 rounded-l-lg'>{user?.username?.[0].toUpperCase() || <FiUser className='cursor-pointer' onClick={()=>navigate('/sign-in')}/> }</p>
                        <span className='bg-white h-auto flex pr-3 py-3 rounded-r-lg items-center'>
                          {user !== null && <FaAngleDown 
                            onClick={()=>setTabOpen((prev)=>!prev)} 
                            className={`transition-all duration-500 cursor-pointer align-top ${tabOpen ? 'rotate-180' : 'rotate-0' }`} 
                        />}
                        </span>
                    </div>


                    <div 
                    className={`flex flex-col items-center transition-all h-60 w-full font-medium justify-between
                    ${tabOpen ? 'lg:h-40 translate-y-6 duration-1000' : ':h-0 -translate-y-12 delay-400 duration-1200 -z-50' }`}
                    >
                        <span 
                          className={`text-slate-500 hover:text-black cursor-pointer lg:text-sm relative w-full h-0`} 
                          onClick={()=>{setTabOpen(false); navigate('/your-profile')}}
                        >
                          <img src="/scrapBook/smolNote.png" alt="" className='absolute scale-120 -rotate-2'/>
                        </span>

                        <span className='w-[2px] bg-amber-700 transition-all -z-53'></span>

                        <span 
                          className={`text-slate-500 hover:text-black cursor-pointer lg:text-sm relative w-full h-0 bg-black -z-51`}
                          onClick={()=>{navigate('/wishlist'); setTabOpen(false)}}
                        >
                          <img src="/scrapBook/wishlist.png" alt="" className='absolute scale-100  '/>
                        </span>

                        <span className='w-[2px] bg-amber-700 transition-all -z-53'></span>
                        
                        <span 
                          className={`text-slate-500 hover:text-black cursor-pointer lg:text-sm relative w-full -z-52`}
                          onClick={()=>{logout(); setTabOpen(false);}}
                        >
                          <img src="/scrapBook/logout.png" alt="" className='absolute scale-100'/>
                        </span>
                    </div>
            </div>
            
        </div>
    </nav>
    <NavbarBottom />
    <Toast />
    </>
  )
}

export default Navbar