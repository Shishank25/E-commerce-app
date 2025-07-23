import React from 'react'

const FilterBar = ({priceRange, setPriceRange, setSortOption}) => {
  return (
    <div className='font-inter'>
        <div className='flex space-x-4 ml-4 mt-4 lg:ml-60'>
          <select 
            className='border rounded-md text-gray-600 outline-none cursor-pointer text-sm p-1'
            onChange={(e)=>setPriceRange(e.target.value)}
            value={priceRange}
          >
            <option value="">All Prices</option>
            <option value="under500">Under 500</option>
            <option value="500to1000">500 - 1000</option>
            <option value="above1000">Above 1000</option>
          </select>

          <select
            onChange={(e) => setSortOption(e.target.value)}
            className='border rounded-md text-gray-600 outline-none cursor-pointer text-sm p-1'
          >
            <option value=''>Sort By: None</option>
            <option value='priceLowToHigh'>Price: Low to High</option>
            <option value='priceHighToLow'>Price: High to Low</option>
            <option value='nameAsc'>Name: A to Z</option>
            <option value='nameDesc'>Name: Z to A</option>
            <option value='discount'>Highest Discount</option>
          </select>
        </div>
    </div>
  )
}

export default FilterBar