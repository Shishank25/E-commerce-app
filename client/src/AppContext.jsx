import { createContext, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "./utils/axiosInstance";
import axios from "axios";

export const AppContext = createContext();

export const EventProvider = ({ children }) => {

    const [ searchQuery, setSearchQuery ] = useState('');
    const [ allProducts, setAllProducts ] = useState([]);
    const [ searchedProducts, setSearchedProducts ] = useState([]);

    const [ user, setUser ] = useState(null);
    const [ wishlist, setWishlist ] = useState([]);
    const [ cart, setCart ] = useState([]);
    const [ cartImgs, setCartImgs ] = useState([]);

    const [ tabOpen, setTabOpen ] = useState(false);
    const [ focused, setFocused ] = useState(false);

    const [ toastMessage, setToastMessage ] = useState('');
    const [ toastType, setToastType ] = useState('');
    const [ showToast, setShowToast ] = useState(false);

    const toastTimerRef = useRef(null);

    const categoryItems = ['Books','comics','educational','fiction','non-fiction',
      'Electronics','Camera','Headphones','Smartphone','Laptop',
      'Fashion','jacket','jeans','shirt','shoes',
      'Home & Kitchen','Bedding','Cookware','Decor','Furniture',
      'Sports','Accessories','Outdoor Gear','Fitness Equipment','Sportswear'];

    const [ showCategory, setShowCategory ] = useState(false);

    // Fetch User Details
    const getUserInfo = async () => {
      const response = await axiosInstance.get('/get-userInfo');
        if (response.data.user) {
            setUser(response.data.user);
            setWishlist(JSON.parse(response.data.user.wishlist.items));
            setCart(JSON.parse(response.data.user.cart.items) || []);
        }
    }

    // Fetch All Products
    const getAllProducts = async () => {

      try{ 
        const response = await axiosInstance.get('/all-products');
        setAllProducts(response.data);
      } catch (error) {
        console.log(error);
      }
    
    };

    // Fetch Product by ID
    const fetchProduct = (prodId) => {

      if (allProducts.length > 0) {
        const isProduct = allProducts.find((item) => item.id === prodId);
        return isProduct || { name: "Product Not Found" };
      }

    }

    // Logout
    const logout = () => {
      setUser(null);
      setCart([]);
      setWishlist([]);
      setCartImgs([]);
      localStorage.clear();
    }

    // Search Product
    const searchFor = async (searchTerm) => {
      try {
          const response = await axiosInstance.get(`/search-products?q=${searchTerm}`);
          setSearchedProducts(response.data);
          setFocused(false);
        } catch (error) {
          console.log(error);
        }
    }

    // Update Wishlist
    const updateWishlist = async (item) => {
      let updatedWishlist = [...wishlist];
      if (wishlist.find(e => e.prodId === item.prodId)) {
        updatedWishlist = updatedWishlist.filter(i => i.prodId !== item.prodId);
        updateToast('Removed from Wishlist!', 'red')
      }
      else {
        updatedWishlist.push(item);
        updateToast('Added to Wishlist!')
      }
  
      setWishlist(updatedWishlist);
      const response = await axiosInstance.put('/update-wishlist', { newWishlist: JSON.stringify(updatedWishlist) });
      console.log(response);
    };

    // Update Cart
    const updateCart = async (item) => {
      let newCart = [...cart];
      if (cart.find(e => e.prodId === item.prodId && e.selectedColour === item.selectedColour && e.selectedSize === item.selectedSize )) 
        {
          newCart = newCart.filter(id => !(id.prodId === item.prodId && id.selectedColour === item.selectedColour && id.selectedSize === item.selectedSize));
          updateToast('Removed from Cart','red');
        }
      else {
        newCart.push(item);
        updateToast('Added to Cart','green');
      }

      setCart(newCart);
      const response = await axiosInstance.put('/update-cart', { newCart: JSON.stringify(newCart) });
      console.log(response);
    }

    // Update Item Quantity
    const updateQuantity = async (prodId, selectedColour, selectedSize, change) => {
      let newCart = [...cart];
      newCart = newCart.map(item => 
        item.prodId === prodId &&
        item.selectedColour === selectedColour &&
        item.selectedSize === selectedSize
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      );
      setCart(newCart);
      const response = await axiosInstance.put('/update-cart', { newCart: JSON.stringify(newCart) });
      console.log(response);
    }

    // Update Toast
    const updateToast = (msg, type = 'green') => {

      setShowToast(false);
      clearTimeout(toastTimerRef.current);

      toastTimerRef.current = setTimeout(() => {
        setToastMessage(msg);
        setToastType(type);
        setShowToast(true);
    
        toastTimerRef.current = setTimeout(() => {
          setShowToast(false);
        }, 3000);
      }, 500);
    }

    const cartImages = () => {
      const productImages = cart.map(cartItem => {
        const product = allProducts.find(p => p.id === cartItem.prodId);
        return product?.image; // optional chaining to avoid errors
      }).filter(Boolean);
      setCartImgs(productImages);
      console.log(productImages);
    }

  return (
    <AppContext.Provider 
      value={{
        searchQuery, setSearchQuery, 
        getAllProducts, allProducts, fetchProduct, 
        searchedProducts, setSearchedProducts, searchFor,
        getUserInfo, user, setUser, logout, wishlist, setWishlist, updateWishlist,
        cart, setCart, updateCart, updateQuantity, cartImgs, cartImages,
        tabOpen, setTabOpen, focused, setFocused,
        toastMessage, setToastMessage, showToast, toastType, setShowToast, updateToast,
        categoryItems, showCategory, setShowCategory,
    }}>
      {children}
    </AppContext.Provider>
  );
};
