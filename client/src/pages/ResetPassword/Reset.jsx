import React, { useState } from 'react'
import Navbar from '../../components/Navbar/Navbar';
import axiosInstance from '../../utils/axiosInstance';

const ResetPassword = () => {

    const [ focused, setFocused ] = useState(false);
    const [ email, setEmail ] = useState('');
    const [ error, setError ] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(email && email.trim() !== '') {
            try {
                const response = await axiosInstance.post('/forgot-password', { email });
                console.log(response);
            } catch (error) {
                console.log(error);
            }
        }

    }

  return (
    <>
    <Navbar />
    <div className='flex flex-col justify-around h-44 lg:justify-evenly items-center mt-20 lg:mx-auto rounded-lg lg:w-240 lg:h-60 lg:shadow-[6px_10px_45px_rgba(0,0,0,0.3)]'>
        <h1 className='mt-4 font-inter font-semibold text-xl'>Reset Password</h1>

        <form className='flex flex-col lg:flex-row' onSubmit={handleSubmit}>
            <div className='relative'>
                <input type="email" 
                    className='outline-none bg-gray-300 px-2 text-center lg:text-left py-1' 
                    placeholder='Enter Email Address'
                    value={email}
                    onChange={({target})=>setEmail(target.value)}
                    onFocus={()=>setFocused(true)} 
                    onBlur={()=>setFocused(false)}
                    required
                />
                <span className={`transition-all ease-out duration-600 h-[1px] left-0 bottom-0 absolute bg-black ${focused ? 'w-full' : 'w-0'}`}></span>
            </div>
            <button type='submit' className='ml-4 lg:mt-0 mt-4 font-semibold text-gray-500 hover:text-gray-800 transition-all cursor-pointer'>Submit</button>
        </form>
    </div>
    </>
  )
}

export default ResetPassword