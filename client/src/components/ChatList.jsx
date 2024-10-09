import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import { useNavigate, useLocation } from 'react-router-dom';
import useConversation from '../Zustand/getConversation';
import SendMessage from '../hooks/SendMessage';
import getMessages from '../hooks/getMessages';
import { useSocketContext } from '../socket/Socket';
import useListenMessage from '../hooks/useListenMessage';
import { TextField, Button, IconButton } from '@mui/material';
import { AccountCircle, Menu as MenuIcon, Send as SendIcon } from '@mui/icons-material';

const ChatList = () => {
    const [user, setUser] = useState({});
    const [list, setList] = useState([]); // List of users for admin
    const [newMessage, setNewMessage] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { selectedConversation, setSelectedConversation } = useConversation();
    const { sendMessage } = SendMessage();
    const { messages } = getMessages(user);
    const lastMessageRef = useRef();
    const { onlineUser } = useSocketContext();
    const apiUrl = import.meta.env.VITE_APP_API_URL;

    useListenMessage();

    const { state } = location;
    const initialUserId = state?.userId; // Get userId from location state
    console.log('initialUserId:', initialUserId); // Log the initialUserId for debugging

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`${apiUrl}/login/success`, {
                    withCredentials: true,
                });
                setUser(response.data.user); // Set the logged-in user
            } catch (error) {
                navigate('/error'); // Navigate to error page on failure
            }
        };

        const fetchList = async () => {
            try {
                const headers = {
                    'Content-Type': 'application/json',
                };

                // Admins can fetch the full list of users
                if (user?.role === 'admin') {
                    const response = await axios.get(`${apiUrl}/users`, { headers, withCredentials: true });
                    const filteredList = response.data.filter(item => item._id !== user._id); // Exclude self from the list
                    setList(filteredList);

                    // If an initialUserId exists, find and set the conversation
                    if (initialUserId) {
                        const conversation = filteredList.find(item => item._id === initialUserId);
                        if (conversation) {
                            setSelectedConversation(conversation); // Set the selected conversation
                        }
                    }
                } else {
                    // Regular user logic: Fetch conversation based on initialUserId or hardcoded user ID
                    if (!initialUserId) {
                        // Fetch hardcoded user ID for normal user if no initialUserId is provided
                        const hardcodedUserId = '66b068ce8e6eb1b9d3ab587d'; // Replace with actual hardcoded ID
                        const response = await axios.get(`${apiUrl}/user/${hardcodedUserId}`, { headers, withCredentials: true });
                        setSelectedConversation(response.data); // Set self as the conversation
                    } else {
                        // If an initialUserId exists for regular users, fetch the conversation directly
                        const response = await axios.get(`${apiUrl}/user/${initialUserId}`, { headers, withCredentials: true });
                        setSelectedConversation(response.data);
                    }
                }
            } catch (error) {
                console.error(error); // Log any errors
            }
        };

        fetchUser(); // Fetch the user data
        fetchList(); // Fetch the list of users and set the conversation
    }, [user?.role, initialUserId, apiUrl, navigate]); // Dependencies for useEffect


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newMessage) return;
        await sendMessage(newMessage, user);
        setNewMessage("");
    };

    const padZero = (number) => number.toString().padStart(2, '0');

    const abstractTime = (timestamp) => {
        const date = new Date(timestamp);
        return `${padZero(date.getHours())}:${padZero(date.getMinutes())}`;
    };

    const renderChatHeader = () => (
        <header className="flex items-center justify-between p-3 md:p-5 bg-white shadow-md border-b border-gray-200"
            style={{ marginTop: "12vh" }}>
            
            {/* Sidebar Toggle for Admins */}
            {user.role === 'admin' && (
                <IconButton
                    onClick={() => setIsSidebarOpen(prev => !prev)}
                    className="text-gray-600 md:text-gray-700"
                >
                    <MenuIcon style={{ fontSize: "30px" }} /> {/* Reduced font size for better fit */}
                </IconButton>
            )}
    
            {/* If conversation is selected */}
            {selectedConversation ? (
                <div className="flex items-center flex-grow">
                    {/* User Avatar */}
                    {selectedConversation.ownerImg?.[0] ? (
                        <img 
                            src={selectedConversation.ownerImg[0]} 
                            alt="User" 
                            className="h-10 w-10 md:h-12 md:w-12 rounded-full object-cover border-2 border-gray-300 shadow-sm"
                        />
                    ) : (
                        <AccountCircle style={{ fontSize: "40px", color: 'gray' }} />
                    )}
                    
                    {/* User Details */}
                    <div className="ml-3 overflow-hidden">
                        <h1 className="text-base md:text-lg font-semibold text-gray-800 truncate">{selectedConversation.name || 'Unknown'}</h1>
                        {/* <p className="text-xs md:text-sm text-gray-600 truncate">{selectedConversation.username || 'No email available'}</p> */}
                    </div>
                </div>
            ) : (
                <div className="flex-grow ml-4">
                    <h1 className="text-lg font-semibold text-gray-800">No Conversation Selected</h1>
                </div>
            )}
        </header>
    );
    

    const renderMessages = () => {
        if (!selectedConversation) return null;
    
        return (
            <div className="flex-1 p-4 overflow-auto"
                style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/white-wall.png")', backgroundColor: '#f4f7fc' }}>
                
                {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-lg md:text-xl text-gray-600 text-center">
                            Start a conversation with {selectedConversation.name}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {messages.map((message, index) => (
                            <div 
                                key={index} 
                                ref={lastMessageRef} 
                                className={`flex flex-col ${message.senderId === user._id ? 'items-end' : 'items-start'}`}
                            >
                                <div className={`relative p-4 rounded-2xl max-w-[75%] md:max-w-[60%] shadow-md 
                                    ${message.senderId === user._id ? 
                                    'bg-gradient-to-r from-green-400 to-green-500 text-white' : 
                                    'bg-white border border-gray-200 text-gray-800'}`}
                                >
                                    <p className="text-base md:text-lg break-words">
                                        {message.message}
                                    </p>
                                </div>
    
                                {/* Aligned timestamp below the message */}
                                <p className={`text-xs md:text-sm text-gray-500 mt-1 ${message.senderId === user._id ? 'text-right' : 'text-left'}`}>
                                    {abstractTime(message.createdAt)}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };
    
    
    

   const renderMessageInput = () => (
    <div 
        className='p-4 bg-gray-100 border-t border-gray-300 flex justify-center items-center' 
        style={{
            position: 'sticky', 
            bottom: 0, 
            zIndex: 10,
            backgroundColor: '#f9fafb' // Light background color for a cleaner look
        }}
    >
        <form 
            onSubmit={handleSubmit} 
            className='flex items-center w-full max-w-4xl' // Maximum width for larger screens
        >
            <TextField
                type="text"
                size='small'
                value={newMessage}
                placeholder='Type a message...'
                fullWidth
                onChange={(e) => setNewMessage(e.target.value)}
                InputProps={{
                    style: {
                        borderRadius: '25px', // More rounded corners for modern look
                        padding: '10px 14px',
                        backgroundColor: '#fff', // Keeping input background white
                        border: '1px solid #ddd', // Subtle border for input
                        fontSize: '16px', // Base font size
                    },
                }}
                style={{
                    flexGrow: 1, 
                    marginRight: '10px' // Space between input and button
                }}
            />
            <Button
                type='submit'
                variant='contained'
                color='primary'
                style={{
                    borderRadius: '50%', // Circular button for a sleek design
                    padding: '10px',
                    minWidth: '50px',
                    height: '50px',
                    backgroundColor: '#00796b', // Consistent teal color
                    color: 'white',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    boxShadow: '0 3px 6px rgba(0, 0, 0, 0.1)', // Soft shadow for elevation
                    transition: 'background-color 0.3s ease', // Smooth hover effect
                    zIndex: 10,
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#005f56'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#00796b'}
            >
                <SendIcon style={{ fontSize: '24px' }} />
            </Button>
        </form>
    </div>
);

    
    const renderSidebar = () => (
        <div
            className={`fixed top-0 left-0 h-full bg-white shadow-lg transition-transform duration-500 ease-in-out z-10 sidebar ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
            style={{
                width: isSidebarOpen ? '30vw' : '0',
                marginTop: "12vh",
                maxWidth: '400px',
                minWidth: '250px',
                zIndex: 50
            }}
        >
            {/* <h1 className='text-gray-800 text-3xl font-bold mb-6 text-center drop-shadow-md'>Chats</h1> */}
            <div className='overflow-y-auto h-[calc(100vh-12vh)]'>
                {list.length > 0 ? (
                    list.map((item) => (
                        <div
                            key={item._id}
                            onClick={() => {
                                setSelectedConversation(item);
                                setIsSidebarOpen(false);
                            }}
                            className={`flex items-center p-4 rounded-lg cursor-pointer mb-3 transition-all duration-200 ease-in-out hover:bg-gray-200 ${selectedConversation?._id === item._id ? 'bg-teal-500 text-white shadow-md' : 'bg-transparent text-gray-800'}`}
                        >
                            {item.ownerImg[0] ? (
                                <img src={item.ownerImg[0]} alt="User" className='h-12 w-12 rounded-full object-cover border-2 border-teal-500 shadow-md' />
                            ) : (
                                <AccountCircle color='inherit' style={{ fontSize: "48px", color: 'gray' }} />
                            )}
                            <div className='ml-4 overflow-hidden'>
                                <h1 className='font-semibold text-lg text-gray-900 truncate'>{item.name}</h1>
                                <p className='text-sm text-gray-600 truncate'>{item.username}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 text-center">No chats available</p>
                )}
            </div>
        </div>
    );
    
    
    
    
    
    

    useEffect(() => {
        const handleClickOutside = (event) => {
            const sidebar = document.querySelector('.sidebar');
            if (sidebar && !sidebar.contains(event.target) && isSidebarOpen) {
                setIsSidebarOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isSidebarOpen]);

    return (
        <div className={`flex h-screen transition-all ${isSidebarOpen ? 'ml-78' : 'ml-0' } overflow-hidden `}>
            {user.role === 'admin' && renderSidebar()}
            <div className='flex flex-col flex-1'>
                <Navbar />
                {renderChatHeader()}
                {renderMessages()}
                {renderMessageInput()}
            </div>
        </div>
    );
};

export default ChatList;
