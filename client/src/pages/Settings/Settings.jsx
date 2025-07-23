import React, { useState, useEffect, useContext } from 'react'
import { AppContext } from '../../AppContext';
import { PiGearLight } from "react-icons/pi";
import { FaPencilAlt } from "react-icons/fa";
import { LuCheck } from "react-icons/lu";
import { IoClose } from "react-icons/io5";
import axiosInstance from '../../utils/axiosInstance';
import Toast from '../../components/Toast/Toast';
import PhoneInput from 'react-phone-input-2';

import Navbar from '../../components/Navbar/Navbar';

const Settings = () => {

  const { updateToast } = useContext(AppContext);
  const [ requestType, setRequestType ] = useState('');

  const [ name, setName ] = useState('');
  const [ address, setAddress ] = useState('');
  const [ phone, setPhone ] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (requestType === 'username') {
      try {
        if (name || name.trim() !== '') {
          const request = await axiosInstance.post('/update-username', { username: name });
          console.log(request.data);

          setName('');
        }
      } catch (error) {
        console.log(error);
      }
    }

    else if (requestType === 'address') {
      try {
        if (address || address.trim() !== '') {
          const request = await axiosInstance.post('/update-address', { address });
          console.log(request.data);

          setAddress('');
        }
      } catch (error) {
        console.log(error);
      }
    }

    else if (requestType === 'phone') {
      try {
        if(phone || phone.trim() !== '') {
          const request = await axiosInstance.post('/update-phone', { phone });
          console.log(request);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  const changePassword = () => {
    updateToast('Check your mail box','blue')
  }

  return (
    
    <>
    <header>
      <Navbar />
    </header>
    <div className='lg:ml-60 mt-20 font-inter h-1vh relative'>
        <div className='flex items-center text-5xl text-gray-500 font-semibold '><PiGearLight />Settings</div>

        <div className='flex flex-col space-y-6 mt-10 lg:border-0 border-[#B7B7B7] lg:w-200 rounded-lg p-8 lg:shadow-[6px_10px_45px_rgba(0,0,0,0.3)]'>
            <form className='flex flex-col lg:flex-row z-5' onSubmit={handleSubmit}>
              <label
                htmlFor="username" 
                className='flex items-center font-semibold cursor-pointer z-5 border-1 rounded-lg p-3 profile-buttons text-white' 
                onClick={()=>setRequestType('username')}
              >
                <FaPencilAlt className='mr-2'/> Username
              </label>
              <input
                id="username"
                type="text"
                className={`${requestType === 'username' ? 'opacity-100 translate-x-8 w-44' : 'opacity-0 -translate-x-10 z-0 w-0'} 
                transition-all duration-800 outline-none border-b bg-gray-300 px-2`} 
                placeholder='Enter New Username'
                value={name}
                onChange={({target})=>setName(target.value)}
              />
              <button type='submit' className={`${requestType === 'username' ? 'opacity-100 translate-x-8' : 'opacity-0 -translate-x-10 z-0'} 
                transition-all duration-800 outline-none border-b bg-gray-300 px-2 ml-2 cursor-pointer hover:bg-gray-400 transition-all`}>
                  <LuCheck />
              </button>
              <button 
                type='button' 
                className={`${requestType === 'username' ? 'opacity-100 translate-x-8' : 'opacity-0 -translate-x-10 z-0'} 
                transition-all duration-800 outline-none border-b bg-gray-300 px-2 ml-2 cursor-pointer hover:bg-gray-400 transition-all`}
                onClick={()=>{setName(''); setRequestType('')}}
              >
                <IoClose />
              </button>
            </form>

            <form className='flex flex-col lg:flex-row z-5' onSubmit={handleSubmit}>
              <label 
                htmlFor='address'
                className='flex items-center font-semibold cursor-pointer z-5 border-1 rounded-lg p-3 profile-buttons text-white' 
                onClick={()=>setRequestType('address')}
              >
                <FaPencilAlt className='mr-2'/> Address
              </label>
              <input 
                id='address'
                type="text"
                className={`${requestType === 'address' ? 'opacity-100 translate-x-8 w-72' : 'opacity-0 -translate-x-10 z-0 w-0'} 
                transition-all duration-800 outline-none border-b bg-gray-300 px-2`} 
                placeholder='Enter New Address'
                value={address}
                onChange={({target})=>setAddress(target.value)}
              />
              <button type='submit' className={`${requestType === 'address' ? 'opacity-100 translate-x-8' : 'opacity-0 -translate-x-10 z-0'} 
                transition-all duration-800 outline-none border-b bg-gray-300 px-2 ml-2 cursor-pointer hover:bg-gray-400 transition-all`}>
                  <LuCheck />
              </button>
              <button 
                type='button' 
                className={`${requestType === 'address' ? 'opacity-100 translate-x-8' : 'opacity-0 -translate-x-10 z-0'} 
                transition-all duration-800 outline-none border-b bg-gray-300 px-2 ml-2 cursor-pointer hover:bg-gray-400 transition-all`}
                onClick={()=>{setAddress(''); setRequestType('')}}
              >
                <IoClose />
              </button>
            </form>

            <form className='flex items-center flex-col lg:flex-row z-5' onSubmit={handleSubmit}>
              <label 
                htmlFor='phone'
                className='flex items-center font-semibold cursor-pointer z-5 border-1 rounded-lg p-3 profile-buttons text-white' 
                onClick={()=>setRequestType('phone')}
              >
                <FaPencilAlt className='mr-2'/> Phone No.
              </label>
              <PhoneInput
                country={'in'}        
                value={phone}
                containerClass={`!max-h-9 transition-all duration-900 ${requestType === 'phone' ? '!opacity-100 translate-x-8 !max-w-76' : '!opacity-0 !-translate-x-10 z-0 !max-w-0'}`}
                inputClass={`!outline-none !py-2 !pl-12 !bg-[#DBDBDB] !border !border-slate-400 !max-h-9 !rounded-xl max-w-full `}
                buttonClass={`!bg-white !border-r !border-slate-400 !max-h-9`}
                dropdownClass=""
                onChange={setPhone}        
                inputProps={{
                  name: 'phone',
                  required: true,
                  autoFocus: true,
                }}
              />
              <button type='submit' className={`${requestType === 'phone' ? 'opacity-100 translate-x-8' : 'opacity-0 -translate-x-10 z-0'} 
                transition-all duration-800 outline-none border-b bg-gray-300 px-2 ml-2 cursor-pointer hover:bg-gray-400 transition-all h-9`}>
                  <LuCheck />
              </button>
              <button 
                type='button' 
                className={`${requestType === 'phone' ? 'opacity-100 translate-x-8' : 'opacity-0 -translate-x-10 z-0'} h-9
                transition-all duration-800 outline-none border-b bg-gray-300 px-2 ml-2 cursor-pointer hover:bg-gray-400 transition-all`}
                onClick={()=>{setPhone(''); setRequestType('')}}
              >
                <IoClose />
              </button>
            </form>

            <button 
              className='flex w-44 items-center font-semibold cursor-pointer z-5 border-1 rounded-lg p-3 profile-buttons text-white'
              onClick={changePassword}
            >
              Change Password?
            </button>
        </div>
        <Toast />
    </div>
    </>
  )
}

export default Settings