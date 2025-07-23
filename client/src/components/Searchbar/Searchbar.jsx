import React, { useContext, useState, useRef, useEffect } from 'react'
import { BiSearch } from "react-icons/bi";
import { MdCancel } from "react-icons/md";
import { CiCircleList } from "react-icons/ci";

import { useNavigate } from 'react-router-dom';

import { AppContext } from '../../AppContext';
import axiosInstance from '../../utils/axiosInstance';
import CategoryList from '../CategoryList/CategoryList';

const Searchbar = ({ focused, setFocused, tabOpen, setTabOpen }) => {

  const { searchQuery, setSearchQuery, setSearchedProducts, showCategory, setShowCategory, searchFor  } = useContext(AppContext);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
    
  const handleSearch = async (e) => {
    e.preventDefault();
    navigate('/search-results/'+ searchQuery);
    if (searchQuery) {
      try {
        const response = await axiosInstance.get(`/search-products?q=${searchQuery}`);
        setSearchedProducts(response.data);
        setFocused(false);
      } catch (error) {
        console.log(error);
      }
    } else {
      navigate('/');
      setFocused(false);
    }
  }

  const clearSearch = () => {
    setSearchQuery('');
    inputRef.current?.focus();
  }
  
  useEffect(()=>{
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setShowCategory(false);
    };

    if (showCategory) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
    
  },[showCategory]);

  return (
    <form
      className={`flex justify-between items-center bg-[#FBE4D6] absolute left-0 z-50
      h-10 px-4 rounded-full border-2 border-[#6F826A] md:w-120 w-60/100 transition-all ease-out order-last ml-2 sm:ml-10 lg:ml-60
      ${focused ? 'duration-1500 order-lastlg:translate-y-0' : 'duration-700 order-last'}
      ${tabOpen ? '' : ''}`}
      onFocus={()=>{setFocused(true); setTabOpen(false)}}
      onBlur={()=>setFocused(false)}
      onSubmit={handleSearch}
    >
        <input
            ref={inputRef} 
            type="text" 
            placeholder='Looking for...'
            className={`outline-none transition-all duration-700 py-1 w-75/100 ${tabOpen ? 'w-38' : 'w-48 delay-500'}`}
            value={searchQuery}
            onChange={({target})=>setSearchQuery(target.value)}
        />
        {searchQuery !== '' && <button type='button' className={`absolute transition-all duration-1000 right-10 cursor-pointer ${focused ? '' : ''}`} onClick={clearSearch}><MdCancel /></button>}
        <button type='submit' className='text-xl cursor-pointer'><BiSearch /></button>

        <div
          tabIndex={0}
          className={`hidden lg:flex flex justify-center items-center cursor-pointer absolute -right-32 bg-[#FCEFCB] transition-opacity text-sm text-gray-700
          border-2 border-[#A5B68D] px-3 rounded-full h-10 ${showCategory ? 'z-0 opacity-0 -translate-y-100' : 'z-5 opacity-100'}`}
          onClick={()=>{setShowCategory(prev => !prev)}}
        >
          <CiCircleList className='mr-2'/> Categories
        </div>
        <div
          ref={dropdownRef} 
          className={`hidden lg:block absolute bg-blue-pink p-2 rounded-xl transition-opacity translate-y-16 border-1 border-[#B6B09F]
          ${showCategory ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'}`}
        >
          <CategoryList />
        </div>
    </form>
  )
}

export default Searchbar