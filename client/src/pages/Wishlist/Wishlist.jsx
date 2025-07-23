import React,{ useContext, useEffect, useState } from 'react'
import { AppContext } from '../../AppContext'
import PCardSmall from '../../components/PCardSmall/PCardSmall';
import Navbar from '../../components/Navbar/Navbar';

import { BsBagHeartFill } from "react-icons/bs";

const Wishlist = () => {

    const { wishlist, allProducts, user } = useContext(AppContext);
    const [ items, setItems ] = useState([]);

    useEffect(()=>{
        const wishlistIds = new Set(wishlist.map(item => item.prodId));
        const wishlistItems = allProducts.filter(product => wishlistIds.has(product.id));
        setItems(wishlistItems);
        console.log(wishlistItems);
    },[user])

  return (
    <div className='flex flex-col'>
        <header>
            <Navbar />
        </header>
        <main className='pt-16 flex flex-col'>
            <h1 className='flex text-5xl font-[600] text-[#A08963] font-caveat mb-10  sm:ml-10 lg:ml-48'> Your Wishlist  <BsBagHeartFill className='ml-4'/> </h1>

            {user !== null ? <div className='flex flex-col sm:flex-row sm:flex-wrap gap-5 lg:w-[80%] h-auto md:px-2 py-2 md:mx-auto'>
                {items.map((product) => (

                <PCardSmall 
                    key={product.id}
                    prod_id={product.id} 
                    name={product.name} 
                    image={product.image} 
                    price={product.price}
                    discount={product.discount}
                    available_colours={product.available_colours}
                    size_options={product.size_options}
                />

                ))}
            </div> : 
            <div className='text-xl text-gray-600 font-caveat'>Please Sign-In to create a wishlist.</div> }
        </main>
    </div>
  )
}

export default Wishlist