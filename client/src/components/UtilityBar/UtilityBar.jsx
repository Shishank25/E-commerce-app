import React from 'react'
import { useNavigate } from 'react-router-dom';

import { MdPhoneAndroid } from "react-icons/md";
import { FaHome } from "react-icons/fa";
import { IoIosPeople } from "react-icons/io";
import { MdOutlineConnectWithoutContact } from "react-icons/md";

import tape from '../../assets/tapeBorder2.png'

const UtilityBar = () => {

  const navigate = useNavigate();

  return (
    <nav className='flex w-full h-6 pt-1 hidden lg:block absolute bg-[url("/scrapBook/tapeBorder2.png")] bg-contain'>
      {/* <img src={tape} alt="" className='absolute top-0 h-6 w-full z-5'/> */}
      <div className='flex w-screen sm:w-1/3 justify-evenly items-center z-20'>
          <p onClick={()=>navigate('/')} className='rounded-full bg-white h-6 w-6 flex justify-center items-center'><FaHome/></p>
          <p><MdPhoneAndroid /></p>
          <p><IoIosPeople /></p>
          <p><MdOutlineConnectWithoutContact /></p>
      </div>
    </nav>
  )
}

export default UtilityBar;