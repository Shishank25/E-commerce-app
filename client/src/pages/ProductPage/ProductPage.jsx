import React, { useEffect, useContext, useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { AppContext } from '../../AppContext';
import Navbar from '../../components/Navbar/Navbar';
import ReviewModal from '../../components/ReviewModal/ReviewModal';

import { useParams, useSearchParams , useNavigate } from 'react-router-dom';

import { IoMdHeart } from "react-icons/io";
import { FaCartPlus } from "react-icons/fa";
import { SlNote } from "react-icons/sl";
import { FaStar } from "react-icons/fa";

const ProductPage = () => {

  const { fetchProduct, allProducts, wishlist, updateWishlist, cart, searchFor, updateCart, updateToast, user } = useContext(AppContext);
  const { prodId } = useParams();
  const [searchParams] = useSearchParams();

  const [ product, setProduct ] = useState(null);

  const [ colours, setColours ] = useState([]);
  const [ sizes, setSizes ] = useState([]);

  const [ selectedColour, setSelectedColour ] = useState(searchParams.get('colour') || null);
  const [ selectedSize, setSelectedSize ] = useState(searchParams.get('size') || null);

  const [ quantity, setQuantity ] = useState(1);

  const [ similarProducts, setSimilarProducts ] = useState(null);
  const [ showModal, setShowModal ] = useState(false);

  const [ reviews, setReviews ] = useState(null);

  const handleReviewSubmit = async (data) => {

    const ReviewObj = {
      title: data.title, 
      review: data.review,
      rating: data.rating,
      user_id: user.id,
      username: user.username,
      prod_id: prodId
    };

    console.log('Review submitted:', ReviewObj);
    try {
      const response = await axiosInstance.post('/create-review', ReviewObj);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const tailwindColorMap = {
    red: 'bg-red-400',
    green: 'bg-green-400',
    yellow: 'bg-yellow-400',
    blue: 'bg-blue-400',
    black: 'bg-gray-800'
  };

  const navigate = useNavigate();

  const getSimilar = async () => {
    try {
      if (product) {
        const result = await axiosInstance.get(`/search-products?q=${product.sub_category}`);
        setSimilarProducts(result.data);
        console.log(result);
      }
    } catch (err) {
      console.log(err);
    }
  }

  const fetchReviews = async () => {
    const response = await axiosInstance.get(`/reviews/${prodId}`);
    if (response.data && response.data.reviews) setReviews(response.data.reviews);
    console.log(response.data.reviews);
  }

  useEffect(() => {
    const getProduct = async () => {
      const result = await fetchProduct(prodId);
      setProduct(result);
  
      if (result) {
        if (result.available_colours && result.available_colours !== 'no') {
          const coloursList = result.available_colours.split(',').map(c => c.trim());
          setColours(coloursList);
          selectedColour === null ? setSelectedColour(coloursList[0]) : selectedColour;
        }
        if (result.size_options && result.size_options !== 'no') {
          const sizeList = result.size_options.split(',').map(s => s.trim())
          setSizes(sizeList);
          selectedSize === null ? setSelectedSize(sizeList[0]) : selectedSize;
        }
      }
    };
  
    getProduct();
    fetchReviews();
    window.scrollTo(0,0);
  }, [prodId, allProducts]);

  useEffect(()=>{getSimilar();},[product]);

  const handleSubmitQty = (e) =>{
    e.preventDefault(); 
    if (quantity === 0) return updateToast('Please enter a valid quantity','blue')
    updateCart({ prodId: prodId, selectedColour: selectedColour || '', selectedSize: selectedSize || '', quantity: quantity, price: product.price });
    setQuantity(0);
  };


  return (
    <>
    <header>
      <Navbar />
    </header>

    <div className='bg-[#FFF6E9] w-[85%] mx-auto flex flex-col justify-evenly h-auto my-2 pt-10 pb-20 px-10 mb-10'>
      {product && 
      <>

        {/* Product Category Group */}
        <p className='text-sm text-gray-600 mb-5'>
          <span className='hover:underline cursor-pointer mr-1' onClick={()=>{searchFor(product.category); navigate('/search-results')}}>{product.category}</span>||  
          <span className='hover:underline cursor-pointer ml-1' onClick={()=>{searchFor(product.sub_category); navigate('/search-results')}}>{product.sub_category}</span>
        </p>

        <div className='flex flex-col lg:flex-row justify-evenly lg:w-300'>

          {/* Product Display */}
          <img className='h-auto object-contain max-w-100 lg:max-w-120 mb-3' src={product.image} alt="product_image" />

          {/* Product Details */}
          <div className='flex flex-col mt-10'>

            {/* Product Name */}
            <h2 className='text-2xl'>{product.name}</h2>

            {/* Price and Discount */}
            <div>
              <span className='text-gray-700 text-sm mr-2'>{product.discount}% off</span> <br />
              <span className='text-xl'>Rs {product.price}</span>
            </div>

            {/* Monitor buttons */}

            <div className='hidden lg:flex flex-col justify-between w-120 h-28 text-xl my-5'>
              <div 
                className={`flex flex-col transition-all duration-500 
                ${JSON.stringify(wishlist).includes(prodId) ? 'w-60' : 'w-56'}`}
              >
                <button 
                  className='flex items-center justify-center rounded-md py-1 w-full z-2 
                  bg-[#FFC1DA] hover:translate-y-2 transition-transform cursor-pointer'
                  onClick={()=>{
                    updateWishlist({prodId: prodId, selectedColour: selectedColour || '', selectedSize: selectedSize || ''}); 
                  }}
                >
                  {wishlist.find(item => item.prodId === prodId) ? 'Remove from' : 'Add to'} Wishlist <IoMdHeart />
                </button>

                <div className='w-full h-4 bg-[#FF90BB] -translate-y-2 z-1 rounded-md'></div>
              </div>


              <div 
                className={`flex flex-col transition-all duration-500 
                ${JSON.stringify(cart).includes(prodId) ? 'w-56' : 'w-52'}`}
              >
                <button 
                  className='flex items-center justify-center rounded-md py-1 z-2 
                  w-full bg-[#8B5DFF] text-white hover:translate-y-2 transition-transform cursor-pointer'
                  onClick={()=>{
                    updateCart({ prodId: prodId, selectedColour: selectedColour || '', selectedSize: selectedSize || '', quantity: 1, price: product.price }); 
                  }}
                >
                  {cart.find(item => item.prodId === prodId && item.selectedColour === selectedColour && item.selectedSize === selectedSize) ? 'Remove from' : 'Add to'} Cart <FaCartPlus />
                </button>

                <div className='w-full h-4 bg-[#6A42C2] -translate-y-2 z-1 rounded-md'></div>
              </div>
            </div>

            {/* Custom Quantity */}
            <form 
              className='text-md flex flex-col lg:flex-row justify-evenly lg:justify-start mt-10 mb-5 h-24 lg:h-8 lg:w-auto w-28' 
              onSubmit={(e)=>{
                handleSubmitQty(e);
              }}
            >
              <div className='flex mb-5 lg:mb-0 '>

                {quantity > 0 && 
                  <button 
                    className='px-1 bg-red-200 border rounded-l-lg border-r-0 cursor-pointer' 
                    type='button' 
                    onClick={(e)=>{
                      e.preventDefault(); 
                      setQuantity((prev)=>Number(prev) - 1)}}
                  >
                    -
                  </button>}

                <input 
                  className={`w-10 px-1 border-y outline-none h-8 text-center
                  [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [appearance:textfield] 
                  ${!quantity || quantity === '0' ? 'border-l rounded-l-lg' : ''}`} 
                  type="number" 
                  value={quantity} 
                  onChange={({target})=>{
                    if (target.value < 0) setQuantity(target.value * (-1)); 
                    else setQuantity(target.value);
                  }}
                />

                <button 
                  className='px-1 bg-green-200 border rounded-r-lg border-l-0 cursor-pointer' 
                  type='button' 
                  onClick={(e)=>{
                    e.preventDefault(); 
                    setQuantity((prev)=>Number(prev) + 1)}}
                >
                  +
                </button>
              </div>

              <button 
                className='lg:ml-5 w-auto px-3 py-1 cursor-pointer px-2 rounded-lg bg-[#BAD8B6]' 
                type='submit' 
              >
                {cart.includes(prodId) ? 'Remove all' : 'Add'}
              </button>

            </form>

            {/* Colour */}
            <div className='mt-5'>
              <ul className='flex flex-wrap w-full'>
                {colours.map((c, i) => 
                  <li 
                    key={i} 
                    onClick={() => {setSelectedColour(c); navigate(`/products/${prodId}?colour=${c}&size=${selectedSize}`)}} 
                    className={`h-8 w-8 px-2 rounded-full cursor-pointer transition-transform ${selectedColour === c.trim() ? 'border scale-110' : ''} mr-4 ${tailwindColorMap[c]}`}>
                  </li> )}
              </ul>
            </div>

            {/* Size */}
            <div className='mt-5'>
              <ul className='flex flex-wrap w-full'>
                  {sizes.map((s, i) => 
                    <li 
                      key={i} 
                      onClick={() => {setSelectedSize(s); navigate(`/products/${prodId}?colour=${selectedColour}&size=${s}`)}} 
                      className={`px-2 rounded-lg cursor-pointer border-1 mr-4 transition-transform mb-10 lg:mb-1 ${selectedSize === s.trim() ? 'border-black scale-110' : 'border-gray-400'}`}>
                        {s}
                    </li> )}
              </ul>
            </div>

          </div>
        </div>

        {/* Phone buttons */}
          <div className='flex lg:hidden flex-wrap justify-between w-full h-auto text-3xl my-5'>
            <button className='flex justify-center rounded-lg py-1 bg-[#F7CFD8] w-30'><IoMdHeart /></button>
            <button className='flex justify-center rounded-lg py-1 bg-[#BDDDE4] w-30'><FaCartPlus /></button>
          </div>

        {/* Other details */}
        <p className='lg:mt-10'>Lorem ipsum dolor sit amet. Est illum voluptas ut molestiae deserunt qui deleniti praesentium qui labore dolore qui incidunt officia et temporibus facere qui tenetur soluta. Ut libero eaque et quam nostrum vel sint incidunt ut aspernatur expedita et sunt provident? </p>

        <div className='flex flex-col mt-10'>
          <p className='font-[500] text-lg mb-2'>Product Specifications</p>
          
          <table className='w-60'>
            <tbody>
              <tr><td>Product Id</td><td>{prodId}</td></tr>
            <tr>
              <td>dimensions</td><td>12345</td>
            </tr>
            <tr><td>material</td><td>abcd</td></tr>
            <tr><td>brand</td><td>SellA</td></tr>
            </tbody>
          </table>
        </div>

        <p className='my-20'>Seller Details: <br /> Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui magni iure tempore, explicabo, nostrum id quasi vero accusantium assumenda praesentium ut esse fuga incidunt, non deleniti vitae rem consectetur nobis.</p>


        {/* Similar Products */}
        {similarProducts && 
        <div className='flex flex-col border border-[#FFC1DA] rounded-xl p-2  lg:w-200'>
          <h4 className='text-lg mb-5'>Similar Products</h4>
          <div className='flex overflow-x-auto h-48 justify-between custom-scroll'>

            {similarProducts.map((item, index) => 
              <div 
                key={index}
                onClick={()=>{
                  let url = `/products/${item.id}`;
                  item.available_colours !== 'no' ? url += '?colour=' + item.available_colours.split(',')[0] : url+= '?colour=null';
                  
                  item.size_options !== 'no' ? url += '&size='+ item.size_options.split(',')[0] : url += '&size=null';
                  
                  navigate(url);
                }}  
                className='flex-shrink-0 flex flex-col items-center h-28 w-auto p-1 text-sm'
              >
                <img src={item.image} alt="" className='max-h-28'/>
                <p>Rs. {Math.floor(item.price)}</p>
              </div> 
            )}

          </div>
        </div> }

        {/* Reviews */}
        <div className='mt-12'>
          <div className='text-2xl font-semibold flex items-center'>
            <h3>
              Reviews 
            </h3>
            <span 
              title='Write a review' 
              className='ml-8 h-8 w-8 text-xl border rounded-full flex items-center justify-center cursor-pointer'
              onClick={()=>setShowModal(true)}
            >
                <SlNote />
            </span>
          </div>
          <div className="flex flex-col mt-4 space-y-4">
            {Array.isArray(reviews) && reviews.length > 0 ? (
              reviews.map((review, index) => (
                <div key={review.id || index} className="border border-gray-500 rounded-lg w-80 p-4">
                  <div>
                    <div className="flex flex-col lg:flex-row text-lg font-semibold w-full justify-between items-center">
                      <h4 className="w-full lg:w-2/3 truncate">{review.title}</h4>
                      <p className="w-full lg:w-1/3 text-xs font-medium text-gray-600 text-right">{review.username}</p>
                    </div>
                    <div className="flex mt-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className={i < review.rating ? 'text-yellow-500' : 'text-gray-300'} />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm">{review.review}</p>
                </div>
              ))
            ) : (
              <div className='text-gray-400 font-semibold text-xl'>No Reviews</div>
            )}
          </div>

        </div>

        <ReviewModal 
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSubmit={handleReviewSubmit}
        />
      </>
      }

    </div>
    </>
  )
}

export default ProductPage