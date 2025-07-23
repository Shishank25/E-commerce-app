import React, {useEffect, useState} from 'react'
import axiosInstance from '../../utils/axiosInstance';
import { useParams } from 'react-router-dom';

const ResetPassword = () => {

    const [ newPassword, setNewPassword ] = useState('');
    const [ confirmPassword, setConfirmPassword ] = useState('');
    const [ error, setError ] = useState(null);
    const [ isValid, setIsValid ] = useState(false);

    const params = useParams();
    const token = params.token;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword.trim() !== '' && newPassword === confirmPassword) {
            try{
                const response = await axiosInstance.post('/change-password', { newPassword, token });
                console.log(response);
                if (response && response.data && error.response.data.message) {
                    console.error('Server Message:', response.data.message);
                } else {
                    console.error('Error:', response);
                }
            } catch (error) {
                if (error.response && error.response.data && error.response.data.message) {
                    setError(error.response.data.message);
                } else {
                    
                    setError(error.message);
                }
            }
        }

        else {
            setError('Some Error Occured');
        }
    }

    const verifyToken = async () => {
        try {
            const request = await axiosInstance.post('/verify-token', { token });
            if (request.data.error === false) setIsValid(true);
            else setError('Token is Invalid');
        } catch (err) {
            if (err.response && err.response.data?.message ) setError(err.response.data.message);
        }
    }

    useEffect(() => {
        verifyToken();
    }, [error])

  return (
    <div className='flex flex-col items-center mt-40 lg:mx-auto font-inter'>
        <h2 className='font-semibold text-2xl'>Create New Password</h2>

        <form 
            className='flex flex-col justify-evenly items-center w-screen lg:w-100 h-60 rounded-lg lg:shadow-[6px_10px_45px_rgba(0,0,0,0.3)]'
            onSubmit={handleSubmit}
        >
            <input 
                type="text" 
                placeholder='Enter New Password' 
                className='px-3 bg-gray-300 outline-none border-b w-50 rounded-t-sm'
                value={newPassword}
                onChange={({target})=>setNewPassword(target.value)}
                required
                disabled={isValid}
            />
            <input 
                type="text" 
                placeholder='Confirm New Password' 
                className='px-3 bg-gray-300 outline-none border-b w-50 rounded-t-sm'
                value={confirmPassword}
                onChange={({target})=>setConfirmPassword(target.value)}
                disabled={isValid}
                required
            />
            {error !== null && <p className='text-red-500 text-sm font-semibold'>{error}</p> }
            <button type='submit' className='rounded-lg px-2 py-1 bg-blue-500 text-white w-20 cursor-pointer transition-transform hover:scale-110'>Submit</button>
        </form>
    </div>
  )
}

export default ResetPassword            