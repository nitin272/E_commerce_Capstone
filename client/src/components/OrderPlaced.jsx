import React, { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Button,Alert,AlertTitle } from '@mui/material'
import { useNavigate } from 'react-router-dom'

const OrderPlaced = () => {
  const searchQuery = useSearchParams()[0]
  const navgate = useNavigate()
  const referenceValue = searchQuery.get('reference')
  const [alert,setAlert] = useState(true)

  window.addEventListener('click',()=>{
    setAlert(false)
  })
  return (
    <>
    {alert &&
      <Alert severity="info" style={{ fontSize: "3vh", width:"25vw",margin:"auto", borderRadius: '20px' }}>
        <AlertTitle style={{ fontWeight: '900', fontSize: '2vw' }}>Info</AlertTitle>
        Please check your mail
      </Alert>}
      <div className='text-center flex flex-col items-center justify-center mt-[30vh]'>
        <h1 className='text-5xl '>Order Placed</h1>
        <p className='text-3xl font-serif m-5 '>Your payment id is <span className='text-4xl text-[#5151f8]'>{referenceValue}</span></p>
        <Button
          variant='contained'
          color='primary'
          size='large'
          onClick={() => navgate('/product')}
        >Back to product</Button>
      </div>
    </>
  )
}

export default OrderPlaced
