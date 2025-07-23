import React, { useState, useEffect, useContext } from 'react'
import { AppContext } from '../../AppContext';

const HistoryItem = ({order}) => {

    const [items, setItems] = useState([]);
    const { allProducts } = useContext(AppContext);

    useEffect(() => {
        const productIds = JSON.parse(order.products); // assuming it's a JSON string of IDs
        const matched = allProducts.filter(item => productIds.includes(item.id));
        setItems(matched);
    }, [order.products, allProducts]);


  return (
    <div key={order.order_id} className='flex flex-col justify-between mb-4 rounded-lg border px-4 py-2'>
        <div className='flex justify-between'>
            <p>#{order.order_id}</p> 
            <p className='text-right'>{order.created_at}</p>
        </div>
        <div className='flex justify-between items-center'>
            <p>{order.order_for}</p>
            <div className='flex max-h-10 w-auto'>
                {items.map(item => <img src={item.image} alt="" className='w-10 mr-1'/> )}
            </div>
            <p>Rs.{order.amount/100}</p>  
        </div>
    </div>
  )
}

export default HistoryItem