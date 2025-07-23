import React, { useEffect, useContext } from 'react'
import { AppContext } from '../../AppContext';

const Toast = () => {

    const { toastMessage, showToast, toastType } = useContext(AppContext);

    const toastColors = {
      green: 'bg-green-500',
      red: 'bg-red-500',
      yellow: 'bg-yellow-500',
      blue: 'bg-blue-500'
      // add more as needed
    };

    const toastClass = toastColors[toastType] || 'bg-green-500';

  return (
    <div 
        className={`hidden lg:block fixed absolute top-24 right-5 max-w-40 ${toastClass} text-white px-4 py-2 rounded-lg shadow-lg transition-all duration-800 w-40
        ${showToast ? 'opacity-100' : 'translate-x-40 opacity-0'}`}
    >
      {toastMessage}
    </div>
  )
}

export default Toast