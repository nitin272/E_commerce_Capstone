import React from 'react'
import logo from '../assets/logo.png'

const Footer = () => {
  return (
    <div className='bg-white p-6'>
      <div className='flex flex-col items-center'>
        <img src={logo} className='h-[80px]' alt="logo" />
        <h1 className='text-xl font-serif font-semibold mt-2'>Scale Mart</h1>
      </div>
      <hr className='w-full border-gray-300 my-4'/>
      <div className='flex justify-center'>
        <h1 className='text-base'>© {new Date().getFullYear()} Scale Mart. All rights reserved.</h1>
      </div>
    </div>
  )
}

export default Footer
