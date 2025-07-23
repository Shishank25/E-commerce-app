import React,{ useState, useContext, useEffect } from 'react'
import { AppContext } from '../../AppContext'
import { useNavigate } from 'react-router-dom';

import { BsDoorClosedFill } from "react-icons/bs";
import { BsDoorOpenFill } from "react-icons/bs";
import { BsHouseDoorFill } from "react-icons/bs";

const ProfilePage = () => {

    const { user, setUser, getUserInfo, logout } = useContext(AppContext);
    const navigate = useNavigate();

    const [hovered, setHovered] = useState(false);

    useEffect(()=>{
        getUserInfo();
    },[])

  return (
    <div className='h-full'>
    {user !== null && <div className='flex flex-col px-2 pt-16 lg:mx-60 font-poppins bg-[#F7F9F2] h-screen'>
        <button className='lg:hidden flex mb-16 text-xl' onClick={(e)=>{e.preventDefault(); navigate('/')}}><BsHouseDoorFill/></button>
        <div className='flex justify-between'>
            <h2 className='text-4xl font-semibold text-[#685752]'>{user.username},</h2>
            <button
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                className="hidden lg:flex items-center text-xl px-2 cursor-pointer transition-all hover:text-red-500 rounded-lg hover:bg-gray-200"
                title='Sign Out'
                onClick={(e)=>{e.preventDefault(); logout(); navigate('/');}}
            >
                Logout?{hovered ? <BsDoorOpenFill className='text-2xl'/> : <BsDoorClosedFill className='text-2xl'/>}
            </button>
        </div>
        <p className='text-gray-600'>{user.email}</p>

        <div className='flex flex-col lg:flex-row mt-40 h-auto text-white justify-evenly text-xl font-semibold w-full text-center'>
            <button className='w-7/10  lg:w-60 py-2 px-1 profile-buttons border-2 rounded-xl bg-white hover:shadow-2xl transition-all hover:scale-110 cursor-pointer' onClick={()=>navigate('/your-profile/settings')}>Account Settings</button>
            <button className='w-7/10 lg:w-60 py-2 px-1 profile-buttons border-2 rounded-xl bg-white hover:shadow-2xl transition-all hover:scale-110 cursor-pointer' onClick={()=>navigate('/your-profile/orders-history')}>
                Your Orders
            </button>
            <button className='w-7/10 lg:w-60 py-2 px-1 profile-buttons border-2 rounded-xl bg-white hover:shadow-2xl transition-all hover:scale-110 cursor-pointer'>Help Desk</button>
            <button className='lg:hidden text-center translate-y-20 py-1 text-red-400 px-5 border-slate-300 border-1 rounded-xl bg-slate-200'>Sign Out</button>
        </div>
    </div>}
    </div>
  )
}

export default ProfilePage