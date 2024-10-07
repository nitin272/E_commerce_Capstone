// Sidebar.jsx
import React, { useRef, useEffect } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
import { AccountCircle } from '@mui/icons-material';

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen, list, setSelectedConversation, onlineUser }) => {
    const sidebarRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                setIsSidebarOpen(false); // Close sidebar if clicked outside
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [setIsSidebarOpen]);

    return (
        <div
            ref={sidebarRef}
            className={`fixed top-0 left-0 w-72 h-full bg-gray-800 p-4 shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
                isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
        >
            <div className='flex items-center mb-6'>
                <IconButton
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className=''
                >
                    <MenuIcon style={{ backgroundColor: 'red' }} />
                </IconButton>
                <h1 className='text-white text-2xl font-bold ml-4'>Chat</h1>
            </div>
            {list.map((item) => (
                <div
                    key={item._id}
                    onClick={() => {
                        setSelectedConversation(item);
                        setIsSidebarOpen(false); // Close sidebar on item click
                    }}
                    className={`flex items-center p-4 rounded-lg cursor-pointer mb-3 transition-all hover:bg-gray-700 ${
                        selectedConversation && selectedConversation._id === item._id ? 'bg-blue-600' : 'bg-gray-900'
                    }`}
                >
                    <div className='relative'>
                        {item.ownerImg[0] ? (
                            <img src={item.ownerImg[0]} alt="User" className='h-12 w-12 rounded-full object-cover' />
                        ) : (
                            <AccountCircle color='inherit' style={{ fontSize: '48px', color: 'gray' }} />
                        )}
                    </div>
                    <div className='ml-4'>
                        <p className='text-white font-semibold'>{item.name}</p>
                        <p className='text-gray-400 text-sm'>{item.username}</p>
                        {onlineUser.includes(item._id) && <p className='text-green-400 text-xs mt-1'>Online</p>}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Sidebar;
