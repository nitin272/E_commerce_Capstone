import React from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom'
// import Form from './components/Form'
import Product from './components/Product'
import Home from './components/Home'
import Profile from './components/Profile'
import Login from './components/Login'
import Signup from './components/Signup'
import Error from './components/Error'

import ForgetPassword from './components/ForgetPassword'
import ResetPassword from './components/ResetPassword'


import ChatList from './components/ChatList'
import AdminDashboard from './Admin/Dashboard'
import ProductDetail from './components/DetailProduct'
import ContactPage from './components/Contact'
function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<Home />}></Route>

        <Route path='/profile' element={<Profile />}></Route>
        <Route path='/product' element={<Product />}></Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/signup' element={<Signup />}></Route>
        <Route path='/error' element={<Error />}></Route>
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path='/forgetPassword' element={<ForgetPassword />}></Route>
        <Route path='/resetPassword/:id/:token' element={<ResetPassword />}></Route>
        <Route path='/contact' element={<ContactPage />}></Route>
        <Route path='/chat' element={<ChatList />}></Route>
        <Route path='/dashboard' element={<AdminDashboard />}></Route>

      </Routes>
    </>
  )
}

export default App
