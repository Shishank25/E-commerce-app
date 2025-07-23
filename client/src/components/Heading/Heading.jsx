import React from 'react'

const Heading = ({text}) => {
  return (
    <div className='flex items-center mt-10 mb-5 lg:mx-auto lg:w-3/5'>
        <span className='hidden lg:inline w-10 lg:flex-grow bg-black h-[1px]'></span>
        <span className='lg:font-dancing text-gray-800 font-semibold text-3xl px-4 py-1 lg:border rounded-full'>
            {text}
        </span>
        <span className='w-10 hidden lg:inline lg:flex-grow bg-black h-[1px]'></span>
    </div>
  )
}

export default Heading