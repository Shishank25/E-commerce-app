import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../AppContext';

import { FaHome } from "react-icons/fa";
import { TbMenu2 } from "react-icons/tb";
import { IoPerson } from "react-icons/io5";
import { IoPersonOutline } from "react-icons/io5";
import { BsBagHeartFill } from "react-icons/bs";

const NavbarBottom = () => {

    const { searchQuery, setSearchQuery, searchFor, user, categoryItems } = useContext(AppContext);
    const navigate = useNavigate();
    const [ menuVisibility, setMenuVisibility ] = useState(false);
    
  return (
    <>
        <div className='absolute fixed text-lg bottom-0 h-10 w-full z-12 bg-white lg:hidden flex justify-evenly pt-2 border-t-2 border-[#C9B194]'>
            <FaHome onClick={()=> navigate('/')}/>
            <TbMenu2 onClick={() => setMenuVisibility(!menuVisibility)}/>
            <BsBagHeartFill onClick={()=> navigate('/wishlist')}/>
            {user ? <IoPerson onClick={()=>navigate('/your-profile')}/> : <IoPersonOutline onClick={()=>navigate('/sign-in')}/> }
        </div>

        <div 
          className={`absolute fixed bottom-0 h-70/100 w-full bg-white z-10 
          transition-transform duration-700 ease-in-out rounded-t-xl
          ${menuVisibility ? '-translate-y-[0%]' : 'translate-y-[100%]'}`}
        >
            <div className='flex flex-col p-4'>
                <p className='text-xl font-[500]'>Categories</p>
                <div className='flex flex-wrap'>
                    {categoryItems.map((item, index) => <div key={index} className='m-2' onClick={async ()=>{setSearchQuery(item); await searchFor(item); navigate('/search-results/' + item); setMenuVisibility(false)}}>{item}</div>)}
                    <div className='m-2' onClick={async ()=>{setSearchQuery(''); await searchFor(''); navigate('/search-results/' + 'hotdeals'); setMenuVisibility(false)}}>Hot Deals</div>
                </div>
            </div>
        </div>
    </>
  )
}

export default NavbarBottom