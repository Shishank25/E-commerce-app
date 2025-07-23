import React, { useState, useEffect, useContext } from 'react'
import { AppContext } from '../../AppContext'
import Navbar from '../../components/Navbar/Navbar'
import axiosInstance from '../../utils/axiosInstance'

import HistoryItem from '../../components/HistoryItem.jsx/HistoryItem'

const OrderHistory = () => {

    const [ userOrders, setUserOrders ] = useState(null);

    const fetchOrders = async () => {
        try {
            const response = await axiosInstance.get('/fetch-orders');
            setUserOrders(response.data);   
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(()=>{
        fetchOrders();
    },[userOrders]);

  return (
    <>
        <header>
            <Navbar/>
        </header>
        <div className='flex flex-col lg:ml-40 w-full lg:w-240 mx-auto text-sm mb-10 lg:mb-0'>
            <h2 className='text-3xl text-gray-700 font-poppins font-semibold mb-16'>Your Orders</h2>

            {Array.isArray(userOrders) && <div className='flex flex-col'>
                {userOrders.map(order => (
                    <HistoryItem order={order}/>
                ) )}
            </div>}
        </div>
    </>
  )
}

export default OrderHistory