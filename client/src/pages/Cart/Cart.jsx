import React, { useEffect, useState, useContext } from 'react'
import { AppContext } from '../../AppContext'
import axiosInstance from '../../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';

import Navbar from '../../components/Navbar/Navbar';
import CartItem from '../../components/CartItem/CartItem';

import { FaOpencart } from "react-icons/fa";
import { RiPoliceBadgeFill } from "react-icons/ri";
import { GiTumbleweed } from "react-icons/gi";
import { IoClose } from "react-icons/io5";

const Cart = () => {

  const { cart, updateCart, setCart, user, updateToast } = useContext(AppContext);
  const [ idsInCart, setIdsInCart ] = useState([]);
  const [ itotal, setItotal ] = useState(0);
  const [ total, setTotal ] = useState(0);
  const [ coupon, setCoupon ] = useState('');
  const [ error, setError ] = useState('');

  const navigate = useNavigate();
  const [ summaryPos, setSummaryPos ] = useState(false);

  useEffect(()=>{

    if (cart.length > 0) {let temp = cart.map(element => element.prodId); setIdsInCart(temp); console.log(temp);};

    console.log(cart);
    setTotal(0);
    setItotal(0);
    let itemTotal = 0;
    cart.forEach(element => {
      itemTotal = itemTotal + (element.price * element.quantity);
    });
    setItotal(itemTotal);
    setTotal(itemTotal + (itemTotal*0.05));
    if(itemTotal <= 499.99) setTotal(prev => prev+=60);
  },[cart])

  const checkCoupon = (e) => {
    e.preventDefault();
    coupon ?
    setError('This Code is invalid or has expired') : 
    setError('Please enter a valid code');
  }

  const paymentHandler = async (e) => {
    const response = await axiosInstance.post('/order', { 
      amount: Math.ceil(total * 100), 
      currency: 'INR', 
      receipt: 'test_rec', 
      notes: {
        products: JSON.stringify(idsInCart) // must be a string
      }, 
    });
    const order = await response.data;
    console.log(order);

    var options = {
        "key": "rzp_test_QwL38Q5RZBjzAw", // Enter the Key ID generated from the Dashboard
        "amount": Math.ceil(order.amount), // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        "currency": "INR",
        "name": "e-commerce project", //your business name
        "description": "Test Transaction",
        "image": "https://example.com/your_logo",
        "order_id": order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        "handler": async function (response){
            // alert(response.razorpay_payment_id);
            // alert(response.razorpay_order_id);
            // alert(response.razorpay_signature);

            const request = await axiosInstance.post('/insert-payment', { 
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              userId: user.id,
              name: user.username,
              amount: order.amount,
              products: order.notes.products     
            });
            const clearCart = await axiosInstance.put('/update-cart', { newCart: JSON.stringify([]) });
            setCart([]);

            updateToast('Order Placed! Thank you for shopping.');
            console.log(clearCart);
        },
        "prefill": { //We recommend using the prefill parameter to auto-fill customer's contact information, especially their phone number
            "name": user.name, //your customer's name
            "email": user.email, 
            "contact": "9000090000"  //Provide the customer's phone number for better conversion rates 
        },
        "notes": {
            "address": "Razorpay Corporate Office"
        },
        "theme": {
            "color": "#3399cc"
        }
    };
    var rzp1 = new Razorpay(options);
    rzp1.on('payment.failed', function (response){
            alert(response.error.code);
            alert(response.error.description);
            alert(response.error.source);
            alert(response.error.step);
            alert(response.error.reason);
            alert(response.error.metadata.order_id);
            alert(response.error.metadata.payment_id);
    });
    rzp1.open();
    e.preventDefault();
  }

  return (
    <div className='relative mb-24 overflow-hidden lg:overflow-visible'>
      <header>
        <Navbar />
      </header>
        
      <div className='flex justify-between mt-12'>
        <div className='flex flex-col mt-2 lg:mt-8 lg:ml-12 lg:w-190 w-full'>
          <h1 className='flex items-center font-poppins font-[550] text-2xl text-[#36454F] mb-4 lg:mb-10'><FaOpencart className='mr-1 text-5xl'/>  Your Shopping Cart</h1>

          {Array.isArray(cart) && <div className='flex flex-col items-center w-full px-2'>
            {cart.map((item, index) => <CartItem rank={index + 1} item={item}/> )} 
            <button 
              className='lg:hidden flex justify-center items-center font-semibold text-lg border-2 bg-[#FFD586] border-[#000] rounded-lg w-9/10 h-12 mt-4'
              onClick={()=>setSummaryPos(prev=>!prev)}
            > 
              
              Order Summary 
              <RiPoliceBadgeFill  className='ml-2 text-gray-800 text-2xl'/>
            </button>     
          </div>}

          {cart.length === 0 && <div className='flex flex-col text-slate-400 text-xl font-poppins font-semibold'>
            <p className='w-60'>Your Cart is Empty...</p> <button className='flex w-22 hover:underline cursor-pointer' onClick={()=>navigate('/')}>Explore?</button>
          </div> }

          
        </div>


      {/* Order Summary */}
        {cart.length > 0 && 
        <div 
          className={`flex flex-col justify-between mt-16 mr-48 w-full lg:w-80 h-140 lg:h-100 rounded-3xl bg-white p-4 lg:shadow-[6px_10px_45px_rgba(0,0,0,0.3)]
          fixed lg:relative text-xl lg:text-lg bottom-0 transition-all duration-1200 ${summaryPos ? '-translate-y-10 ' : 'translate-y-140'} lg:translate-y-0`}
        >

          <button className='lg:hidden absolute top-[8px] flex items-center justify-center rounded-full w-10 h-10 self-end bg-slate-300' onClick={()=>setSummaryPos(false)}><IoClose/></button>
          <h2 className='text-2xl lg:text-xl font-semibold px-2 mt-2 rounded-t-lg'>Order Summary</h2>

          <div className='flex justify-between px-2'>
            <p className=' px-4'>Delivery Address:</p> 
            <button onClick={()=>navigate('/your-profile/settings')} className='text-blue-500 hover:underline px-1 rounded-sm ml-5 cursor-pointer'>edit</button>
          </div>
          <p className='flex flex-wrap text-base lg:text-sm text-gray-600 w-7/10 self-center'>{user?.address}</p>
        
          {/* Coupon */}
          <form className='w-8/10 self-center' onSubmit={checkCoupon}>
            <input 
              type="text" 
              placeholder='Have a Coupon?' 
              className='border text-lg lg:text-sm w-full px-2 py-1 rounded-sm outline-none' 
              onChange={({target})=>{setError(''); setCoupon(target.value)}}
            />
            {error && <p className='text-xs text-red-400'>{error}</p>}
          </form>

          {/* Price Details */}
          <div className='px-4 space-y-2 text-base lg:text-sm'>
            <div className='flex justify-between'>
              <span>Sub Total: </span>
              <span>{parseFloat(itotal.toFixed(2))}</span>
            </div>
            <div className='flex justify-between'>
              <span>GST:</span>
              <span>{(itotal * 0.05).toFixed(2)}</span>
            </div>
            <div className='flex justify-between'>
              <span>Shipping Cost:</span>
              <span>{itotal > 499.99 ? 'Free' : '60'}</span>
            </div>
            <div className='flex justify-between font-semibold text-xl lg:text-base'>
              <span>Total</span>
              <span>₹{parseFloat(total.toFixed(2))}</span>
            </div>
          </div>

          {/* Responsive Checkout Button */}
          <div className='self-center'>
            <button 
              className='group relative text-2xl lg:text-lg flex items-center text-center bg-blue-300 w-auto px-8 py-1 lg:py-0 rounded-md mb-2 border border-transparent overflow-hidden
              cursor-pointer transition-transform hover:scale-108 hover:border-black'
              onClick={paymentHandler}
            >
              Checkout <RiPoliceBadgeFill className='group-hover:animate-pop-spin transition-all ml-1'/>
            <span className='absolute w-10 h-20 bg-white -translate-y-0 -translate-x-24 opacity-20 rotate-45 transition-all duration-800 group-hover:translate-x-40'></span>
            </button>
          </div>
        </div>}

      </div>
    </div>
  )
}

export default Cart