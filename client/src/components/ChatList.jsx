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
        <header className='flex items-center p-5 bg-gray-100 shadow-md border-b border-gray-300'
        style={{marginTop:"12vh"}}>
            {user.role === 'admin' && (
                <IconButton
                style={{fontSize:"50px"}}
                    onClick={() => setIsSidebarOpen(prev => !prev)}
                    className='text-gray-600'
                >
                    <MenuIcon />
                </IconButton>
            )}
            {selectedConversation ? (
                <>
                    {selectedConversation.ownerImg?.[0] ? (
                        <img src={selectedConversation.ownerImg[0]} alt="User" className='h-12 w-12 rounded-full object-cover border-2 border-gray-300' />
                    ) : (
                        <AccountCircle color='inherit' style={{ fontSize: "48px", color: 'gray' }} />
                    )}
                    <div className='ml-4'>
                        <h1 className='font-semibold text-lg text-gray-800'>{selectedConversation.name || 'Unknown'}</h1>
                        <p className='text-sm text-gray-600'>{selectedConversation.username || 'No email available'}</p>
                    </div>
                </>
            ) : (
                <div className='ml-4'>
                    <h1 className='font-semibold text-lg text-gray-800'>No Conversation Selected</h1>
                </div>
            )}
        </header>
    );

    const renderMessages = () => {
        if (!selectedConversation) return null;

        return (
            <div className='flex-1 p-4 overflow-auto bg-gray-50'>
                {messages.length === 0 ? (
                    <div className='flex items-center justify-center h-full'>
                        <p className='text-md text-gray-500'>Start a conversation with {selectedConversation.name}</p>
                    </div>
                ) : (
                    <div>
                        {messages.map((message, index) => (
                            <div key={index} ref={lastMessageRef} className={`mb-2 ${message.senderId === user._id ? 'text-right' : 'text-left'}`}>
                                <div className={`inline-block p-3 rounded-lg ${message.senderId === user._id ? 'bg-blue-500 text-white' : 'bg-white text-gray-800 border border-gray-300'}`}>
                                    {message.message}
                                </div>
                                <p className={`text-xs ${message.senderId === user._id ? 'text-right' : 'text-left'} text-gray-500`}>
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
        <div className='p-4 bg-gray-200 border-t border-gray-300'> {/* Changed background color to a lighter shade */}
            <form onSubmit={handleSubmit} className='flex items-center'>
                <TextField
                    type="text"
                    size='small'
                    value={newMessage}
                    placeholder='Type a message'
                    fullWidth
                    onChange={(e) => setNewMessage(e.target.value)}
                    InputProps={{
                        style: {
                            borderRadius: '20px', 
                            padding: '8px', 
                            backgroundColor: '#fff', // Keeping the white background for the input
                            border: '1px solid #ccc', // Light border for better visibility
                        },
                    }}
                />
                <Button
                    type='submit'
                    variant='contained'
                    color='primary'
                    style={{
                        marginLeft: '8px',
                        borderRadius: '20px',
                        padding: '8px 16px',
                        backgroundColor: '#00796b', // Using a teal color for the button to match the theme
                        color: 'white', // Ensuring the text is white for contrast
                        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)', // Adding a subtle shadow for depth
                    }}
                >
                    <SendIcon />
                </Button>
            </form>
        </div>
    );
    
    const renderSidebar = () => (
        <div
            className={`fixed top-0 left-0 h-full bg-gradient-to-b from-teal-400 to-teal-700 p-6 transition-transform duration-500 ease-in-out z-10 sidebar ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
            style={{ width: '320px', marginTop: "12vh", boxShadow: "0 4px 30px rgba(0, 0, 0, 0.5)" }} // Increased width to 400px
        >
            <h1 className='text-white text-4xl font-bold mb-8 text-center drop-shadow-lg'>Chats</h1> {/* Increased font size */}
            <div className='overflow-y-auto h-[calc(100vh-12vh)]'>
                {list.map((item) => (
                    <div
                        key={item._id}
                        onClick={() => {
                            setSelectedConversation(item);
                            setIsSidebarOpen(false);
                        }}
                        className={`flex items-center p-4 rounded-lg cursor-pointer mb-3 transition-all duration-200 ease-in-out hover:bg-teal-500 ${selectedConversation?._id === item._id ? 'bg-teal-500 shadow-md' : 'bg-teal-300'}`} // Shadow on selected item
                    >
                        {item.ownerImg[0] ? (
                            <img src={item.ownerImg[0]} alt="User" className='h-14 w-14 rounded-full object-cover border-2 border-white shadow-lg' /> // Slightly larger image
                        ) : (
                            <AccountCircle color='inherit' style={{ fontSize: "56px", color: 'white' }} /> // Larger icon for better visibility
                        )}
                        <div className='ml-4 overflow-hidden'> {/* Added overflow-hidden to prevent overflow */}
                            <h1 className='font-semibold text-lg text-gray-900'>{item.name}</h1> {/* Darker font for name */}
                            <p className='text-sm text-gray-800 truncate'>{item.username}</p> {/* Added truncate for username */}
                        </div>
                    </div>
                ))}
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
        <div className={`flex h-screen transition-all ${isSidebarOpen ? 'ml-80' : 'ml-0' } overflow-hidden `}>
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
