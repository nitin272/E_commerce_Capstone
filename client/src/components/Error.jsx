import React from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'
//MUI component
import { Button } from '@mui/material'
const Error = () => {
  const navigate = useNavigate()
  return (
    <div>
      <div className=' flex justify-center items-center my-[20vh] flex-col'>
        <img src={logo} alt="Logo" className='h-[35vh] w-[23vw]' />
        <h1 className='font-serif text-2xl mb-5'>Please login first</h1>
        <Button
          variant='contained'
          className='w-50'
          size='large'
          onClick={() => navigate('/')}>Back to home</Button>

      </div>
    </div>
  )
}

export default Error
