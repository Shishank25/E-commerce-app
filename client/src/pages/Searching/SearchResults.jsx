import React, { useContext, useEffect, useMemo, useState } from 'react'
import { AppContext } from '../../AppContext'
import { useParams } from 'react-router-dom'

import Navbar from '../../components/Navbar/Navbar'
import FilterBar from '../../components/FilterBar/FilterBar'
import PCardSmall from '../../components/PCardSmall/PCardSmall'
import hotBanner from '../../assets/hotBanner.png'

const SearchResults = () => { 

    const { searchQuery, searchedProducts, searchFor } = useContext(AppContext)

    const { query } = useParams();

    const [ searchTerm, setSearchTerm ] = useState('');
    const [ priceRange, setPriceRange ] = useState('');
    const [ sortOption, setSortOption ] = useState('');

    const hotDeals = async () => {
        setSearchTerm('');
        setSortOption('discount');
        await searchFor('');
      }

    useEffect(()=>{
      if (query !== 'hotdeals') {
        setSearchTerm(query);
        searchFor(query);
      }
      else {
        hotDeals();
      }
    },[query]);

    const filteredProducts = useMemo(() => {
      let result = searchedProducts.filter((product) => {
        const priceMatch = (() => {
          if (!priceRange) return true;

          const price = product.price;
          if (priceRange === 'under500') return price < 500;
          if (priceRange === '500to1000') return price >= 500 && price <= 1000;
          if (priceRange === 'above1000') return price > 1000;
          return true;
        })();
        return priceMatch;
      });

      // Sort the result based on selected option
      if (sortOption === 'priceLowToHigh') {
        result.sort((a, b) => a.price - b.price);
      } else if (sortOption === 'priceHighToLow') {
        result.sort((a, b) => b.price - a.price);
      } else if (sortOption === 'nameAsc') {
        result.sort((a, b) => a.name.localeCompare(b.name));
      } else if (sortOption === 'nameDesc') {
        result.sort((a, b) => b.name.localeCompare(a.name));
      } else if (sortOption === 'discount') {
        result.sort((a, b) => b.discount - a.discount);
      }

      return result;
    }, [searchedProducts, priceRange, sortOption, query]);

  return (
    <div className='flex flex-col'>
        <header>
          <Navbar />
        </header>
        <div className='mt-16'>
          { query === 'hotdeals' && <div className='hot-deals w-screen'><img src={hotBanner} alt="" className='max-h-100 mx-auto'/></div>}
          <FilterBar priceRange={priceRange} setPriceRange={setPriceRange} setSortOption={setSortOption}/>
        </div>
        {searchTerm && <p className='md:ml-10 lg:ml-50 lg:text-xl my-5 '>Showing search results for "{searchTerm}"</p>} 
        <div className='flex flex-col sm:flex-row sm:flex-wrap gap-5 lg:w-[80%] h-auto md:px-2 py-2 md:mx-auto'>
          {filteredProducts.map((product) => (

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
        </div>
    </div>
  )
}

export default SearchResults