import React, { useEffect, useState } from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Product from './components/Product';
import Home from './components/Home';
import Profile from './components/Profile';
import Login from './components/Login';
import Signup from './components/Signup';
import Error from './components/Error';
import ForgetPassword from './components/ForgetPassword';
import ResetPassword from './components/ResetPassword';
import ChatList from './components/ChatList';
import AdminDashboard from './Admin/Dashboard';
import ProductDetail from './components/DetailProduct';
import ContactPage from './components/Contact';
import { requestPermission } from './Service/Firebase'; 
import { Toaster, toast } from 'react-hot-toast';
import NotificationPermission from './hooks/NotificationPermission';
// import FCMNotification from './components/FCMNotification';
import { SocketContextProvider } from './socket/Socket';


function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const requestNotificationPermission = async () => {
      const permission = await requestPermission();
      if (permission) {
        console.log('Notification permission granted.');
      } else {
        console.log('Notification permission denied.');
      }
    };

    requestNotificationPermission();
  }, []);

  return (
    <SocketContextProvider>
      <NotificationPermission />
      {/* <FCMNotification /> */}

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/product' element={<Product />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/error' element={<Error />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path='/forgot-Password' element={<ForgetPassword />} />
        <Route path='/resetPassword/:id/:token' element={<ResetPassword />} />
        <Route path='/contact' element={<ContactPage />} />
        <Route path='/chat' element={<ChatList />} />
        <Route path='/dashboard' element={<AdminDashboard />} />
      </Routes>

      {/* React Hot Toast */}
      <Toaster />
    </SocketContextProvider>
  );
}

export default App;
