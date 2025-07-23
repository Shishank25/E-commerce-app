import React, { useState, useContext, useEffect } from 'react'
import axiosInstance from '../../utils/axiosInstance.js'
import ReCAPTCHA from "react-google-recaptcha";
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../AppContext';

import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import collage from '../../assets/collageNew.png'

const SignIn = () => {

  useEffect(()=>{
    console.log(import.meta.env.VITE_API_URL);
  },[])

  const { setUser } = useContext(AppContext);

  const recaptchaSiteKey = "6LdRr1IrAAAAAFfZyKqxoAJ3ovnU6I245EbHAV00";

  const [ signInType, setSignInType ] = useState('login');
  const navigate = useNavigate();

  const [ username, setUsername ] = useState('');
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ phone, setPhone ] = useState('');
  const [ confirmPassword, setConfirmPassword ] = useState('');
  const [ captchaToken, setCaptchaToken ] = useState(null);
  const [ error, setError ] = useState(null);

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle Register
    if (signInType === 'register') {
      try {

        if (!username || !email || !password || !confirmPassword || !phone) return setError('Please fill in all fields.');
        if (validateEmail(email) === false) return setError('Invalid email.');
        if (password !== confirmPassword) return setError('Passwords do not match.');
  
        const response = await axiosInstance.post('/register', { 
          username, 
          email: email.toLowerCase(), 
          password,
          phone,
          captchaToken 
        });

        if(response.data && response.data.accessToken) {
          localStorage.setItem('token', response.data.accessToken);
          setUser({ username: username, email: email.toLowerCase() });
          console.log(response.data);
          navigate('/');
        }

        if(response.data && response.data.error){
          setError( response.data.message);
          return 
        }
        
      } catch (error) {
        console.log(error);
        if (error.response && error.response.data && error.response.data.message) setError( error.response.data.message );
        else setError("An unexpected error has occured.");

      }
    }

    // Handle Login
    if (signInType === 'login') {
      try {

        if (!email || !password) return setError('Please fill in all fields.');
        if (validateEmail(email) === false) return setError('Invalid email.');

        const response = await axiosInstance.post('/login', {
          email: email.toLowerCase(),
          password: password,
          captchaToken
        });
        if(response.data && response.data.accessToken) {
          localStorage.setItem('token', response.data.accessToken);
          setUser({ username: response.data.user.username, email: email.toLowerCase() });
          setError(response.data);
          navigate('/');
        }
        if(response.data && response.data.error){
          setError( response.data.message);
          return
        }
        
      } catch (error) {
        console.log(error);
        if (error.response && error.response.data ) setError( error.response.data.error );
        else setError("An unexpected error has occured.");

      }
    }
  }

  return (
    <div className='flex h-screen relative'>
      <img src="/scrapBook/scrapDark.jpg" alt="scrap_page" className='absolute top-0 -z-5 h-full'/>

      {/* Sign-In Box */}
      <div 
        className='flex flex-col mx-5 sm:mx-auto justify-center
        items-center border- border-black animate-float origin-top
        rounded-xl max-h-140 w-auto sm:w-130 py-3 mt-5 bg-[url("/scrapBook/noteNew2.png")] bg-cover'
      >
        

        <form className='flex flex-col items-center justify-evenly h-100' onSubmit={handleSubmit}>
            <h1 className='font-medium text-lg border-b-1'>
              {signInType === 'login' ? 'Login' : 'Sign Up'}
            </h1>

            {signInType === 'register' && <input 
              type="text" 
              className='outline-none py-1 px-4 border-b border-slate-400 rounded-t-xl' 
              placeholder='Name'
              onChange={({target})=>setUsername(target.value)}
            />}

            <input 
              type="email" 
              className='outline-none py-1 px-4 border-b border-slate-400 rounded-t-xl' 
              placeholder='Email'
              onChange={({target})=>setEmail(target.value)}
            />

            {signInType === 'register' && <PhoneInput
              country={'in'}        
              value={phone}
              inputClass="!outline-none !py-2 !pl-12 !border-b !border-slate-400 !rounded-xl w-full"
              buttonClass="!bg-white !border-r !border-slate-400"
              dropdownClass=""
              onChange={setPhone}        
              inputProps={{
                name: 'phone',
                required: true,
                autoFocus: true,
              }}
            />}

            <input 
              type="password" 
              className='outline-none py-1 px-4 border-b border-slate-400 rounded-t-xl' 
              placeholder='Password'
              onChange={({target})=>setPassword(target.value)}
            />

            {signInType === 'register' && <input 
              type="password" 
              className='outline-none py-1 px-4 border-b border-slate-400 rounded-t-xl' 
              placeholder='Confirm Password'
              onChange={({target})=>setConfirmPassword(target.value)}
            />}

            { error && <p>{error}</p> }

            <ReCAPTCHA
              sitekey={recaptchaSiteKey}
              onChange={(token) => setCaptchaToken(token)}
            />

            <button
              type='submit' 
              className='bg-[url("/scrapBook/tape2.png")] bg-cover bg-no-repeat bg-center text-black px-3 py-1 rounded-xl hover:shadow-xl transition-all duration-500 cursor-pointer'
            >
              Submit
            </button>
        </form>

        {signInType === 'login' ? 
          <>
            <p className='text-sm'>Don't have an account?</p>
            <p className='font-medium text-sm underline sm:underline-none hover:underline mt-2 cursor-pointer' onClick={()=>{setSignInType('register')}}>
              Sign up
            </p>
          </> 
        : 
          <>
            <p className='text-sm'>Already have an account?</p>
            <p className='font-medium text-sm underline sm:underline-none hover:underline mt-2 cursor-pointer' onClick={()=>{setSignInType('login')}}>
              Login
            </p>
          </>
        }
        <button className='text-sm mt-4 hover:underline cursor-pointer' onClick={()=>navigate('/forgot-password')}>Forgot Password?</button>
      </div>

      {/* Image */}
      <div>
        <img src={collage} alt="eh" className='h-full -z-5'/>
      </div>
    </div>
  )
}

export default SignIn