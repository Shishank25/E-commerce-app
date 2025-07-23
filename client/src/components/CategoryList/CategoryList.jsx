import React, { useContext } from 'react'
import { AppContext } from '../../AppContext'
import boomImage from '../../assets/boom.png';

import { useNavigate } from 'react-router-dom';

const CategoryList = () => {

    const { setShowCategory } = useContext(AppContext);

    const navigate = useNavigate();

    const categories = {
      'Books': ['Fiction', 'Non-Fiction', 'Comics', 'Educational'],
      'Electronics': ['Camera', 'Headphones', 'Smartphone', 'Laptop'],
      'Fashion': ['jacket','jeans','shirt','shoes'],
      'Home & Kitchen': ['Bedding','Cookware','Decor','Furniture'],
      'Sports': ['Outdoor Gear','Fitness Equipment','Sportswear'],
      'Accessories' : []
    };

    const handleClick = async (term) => {
      navigate('/search-results/' + term);
      setShowCategory(false);
    }


  return (
    <div className='flex h-auto w-200 p-1 flex-wrap'>
      <div className="relative flex justify-evenly w-full">
        {Object.entries(categories).map(([main, sub]) => (
          <div className="group relative" key={main}>
            <span className='cursor-pointer hover:underline' onClick={()=>handleClick(main)}>
              {main}
            </span>
            {sub.length > 0 && (
              <ul className="absolute mt-3 px-2 max-h-0 group-hover:max-h-32 overflow-hidden rounded-b-md transition-all duration-300 bg-gray-200">
                {sub.map(item => <li className='text-sm py-1 cursor-pointer hover:underline' key={item} onClick={()=>handleClick(item)}>{item}</li>)}
              </ul>
            )}
          </div>
        ))}
        <div className='group relative'>
          <p className='z-5 cursor-pointer hover:underline' onClick={()=>handleClick('hotdeals')}>Hot Deals!</p>
          <img src={boomImage} alt="boom" className='h-20 w-40 absolute top-0 left-0 -translate-y-7 transition-all -z-5 group-hover:scale-120'/>
        </div>
      </div>

    </div>
  )
}

export default CategoryList