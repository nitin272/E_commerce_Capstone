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

import CheckIcon from '@mui/icons-material/Check';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import Tooltip from '@mui/material/Tooltip';



const ChatList = () => {
    const [user, setUser] = useState({});
    const [list, setList] = useState([]); 
    const [newMessage, setNewMessage] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { selectedConversation, setSelectedConversation } = useConversation();
    const { sendMessage } = SendMessage();
    const { messages } = getMessages(user);
    const lastMessageRef = useRef();
    const { onlineUser } = useSocketContext();
    const apiUrl = "https://e-commerce-capstone.onrender.com";

    useListenMessage();

    const { state } = location;
    const initialUserId = state?.userId; 

    

useEffect(() => {
    if (lastMessageRef.current) {
        lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
}, [messages]); 


    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`${apiUrl}/login/success`, {
                    withCredentials: true,
                });
                setUser(response.data.user); 
            } catch (error) {
                navigate('/error'); 
            }
        };

        const fetchList = async () => {
            try {
                const headers = {
                    'Content-Type': 'application/json',
                };

                if (user?.role === 'admin') {
                    const response = await axios.get(`${apiUrl}/users`, { headers, withCredentials: true });
                    const filteredList = response.data.filter(item => item._id !== user._id); // Exclude self from the list
                    setList(filteredList);

                    if (initialUserId) {
                        const conversation = filteredList.find(item => item._id === initialUserId);
                        if (conversation) {
                            setSelectedConversation(conversation); 
                        }
                    }
                } else {
                    if (!initialUserId) {
                        const hardcodedUserId = '66b068ce8e6eb1b9d3ab587d'; 
                        const response = await axios.get(`${apiUrl}/user/${hardcodedUserId}`, { headers, withCredentials: true });
                        setSelectedConversation(response.data); 
                    } else {
                        
                        const response = await axios.get(`${apiUrl}/user/${initialUserId}`, { headers, withCredentials: true });
                        setSelectedConversation(response.data);
                    }
                }
            } catch (error) {
                console.error(error); 
            }
        };

        fetchUser(); 
        fetchList(); 
    }, [user?.role, initialUserId, apiUrl, navigate]); 


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
        <header className="flex items-center justify-between p-3 md:p-5 bg-white shadow-md border-b border-gray-200" style={{ marginTop: "12vh" }}>
            {user.role === 'admin' && (
                <IconButton
                    onClick={() => setIsSidebarOpen(prev => !prev)}
                    className="text-gray-600 md:text-gray-700 hover:text-gray-800 transition duration-150 ease-in-out"
                >
                    <MenuIcon style={{ fontSize: "30px" }} /> 
                </IconButton>
            )}
            {selectedConversation ? (
                <div className="flex items-center flex-grow">
        
                    {selectedConversation.ownerImg?.[0] ? (
                        <img 
                            src={selectedConversation.ownerImg[0]} 
                            alt="User" 
                            className="h-12 w-12 rounded-full object-cover border-2 border-gray-300 shadow-sm"
                        />
                    ) : (
                        <AccountCircle style={{ fontSize: "48px", color: 'gray' }} />
                    )}
                    <div className="ml-5 overflow-hidden ">
                        <h1 className="text-lg font-semibold text-gray-800 truncate">{selectedConversation.name || 'Unknown'}</h1>
                        
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
            <div
                className="flex-1 p-4 overflow-auto"
                style={{
                    backgroundImage: 'url("https://www.transparenttextures.com/patterns/white-wall.png")',
                    backgroundColor: '#f4f4f4',
                    // Hide the default scrollbar while keeping scrolling enabled
                    overflowY: 'scroll', // Allow vertical scrolling
                }}
            >
                {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-lg md:text-xl text-gray-700 text-center font-medium">
                            Start a conversation with{' '}
                            <span className="font-bold text-gray-900">{selectedConversation.name}</span>
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`flex ${message.senderId === user._id ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`relative p-3 rounded-lg max-w-[75%] shadow-md transition duration-300 ease-in-out
                                        ${message.senderId === user._id
                                            ? 'bg-gradient-to-r from-teal-400 to-green-300 text-gray-900'
                                            : 'bg-white border border-gray-200 text-gray-800'
                                        }`}
                                    style={{
                                        background: message.senderId === user._id
                                            ? 'linear-gradient(135deg, #a0e9ce, #72c7a1)'
                                            : '#fff',
                                    }}
                                >
                                    <p className="text-base md:text-lg break-words">{message.message}</p>
    
                                    {message.photoUrl && (
                                        <img
                                            src={message.photoUrl}
                                            alt={`Image sent by ${
                                                message.senderId === user._id ? 'you' : selectedConversation.name
                                            }`}
                                            className="mt-2 rounded-lg max-w-xs shadow-md border border-gray-300"
                                            onLoad={() => console.log('Image loaded')}
                                        />
                                    )}
    
                                    {message.senderId === user._id && (
                                        <div className="flex items-center justify-between text-xs mt-1">
                                            <p className="text-gray-500">{abstractTime(message.createdAt)}</p>
                                            <MessageStatusIndicator status={message.status} />
                                        </div>
                                    )}
                                </div>
    
                                {index === messages.length - 1 && <div ref={lastMessageRef} className="h-4" />}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };
    
    

const MessageStatusIndicator = ({ status }) => {
  const statusIcons = {
    offline: (
      <Tooltip title="Message not delivered">
        <CheckIcon className="text-gray-400" />
      </Tooltip>
    ), 
    delivered: (
      <Tooltip title="Message delivered">
        <DoneAllIcon className="text-gray-400" />
      </Tooltip>
    ), 
    read: (
      <Tooltip title="Message read">
        <DoneAllIcon className="text-blue-500 animate-pulse" />
      </Tooltip>
    ), 
  };

  return (
    <div className="flex items-center space-x-1">
      {statusIcons[status] || (
        <Tooltip title="Message not delivered">
          <CheckIcon className="text-gray-400" />
        </Tooltip>
      )} 
    </div>
  );
};

    
    
    
    
    
    
    const renderMessageInput = () => (
        <div
          className="p-4 border-t border-gray-300 flex justify-center items-center"
          style={{
            position: 'sticky',
            bottom: 0,
            zIndex: 10,
            backgroundColor: '#f9fafb',
          }}
        >
          <form
            onSubmit={handleSubmit}
            className="flex items-center w-full max-w-4xl"
            style={{
              marginBottom: 'env(safe-area-inset-bottom)', // Prevent overlapping on iOS devices with bottom bars
            }}
          >
            <TextField
              type="text"
              size="small"
              value={newMessage}
              placeholder="Type a message..."
              fullWidth
              onChange={(e) => setNewMessage(e.target.value)}
              InputProps={{
                style: {
                  borderRadius: '25px', // More rounded corners
                  marginBottom: '50px',
                  backgroundColor: '#fff',
                  border: '1px solid #ddd',
                  fontSize: '16px',
                },
              }}
              style={{
                flexGrow: 1,
                marginRight: '10px',
              }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              style={{
                borderRadius: '50%',
                padding: '10px',
                minWidth: '50px',
                marginBottom: '50px',
                height: '50px',
                backgroundColor: '#00796b',
                color: 'white',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                boxShadow: '0 3px 6px rgba(0, 0, 0, 0.1)',
                transition: 'background-color 0.3s ease',
                zIndex: 10,
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#005f56')}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#00796b')}
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
                zIndex: 50,
            }}
        >
            <div 
                className='overflow-y-auto h-[calc(100vh-12vh)] scrollbar-none' // Hides the scrollbar
                style={{
                    paddingBottom: '4rem', // Ensures space for the last user
                }}
            >
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
                                <img
                                    src={item.ownerImg[0]}
                                    alt="User"
                                    className='h-12 w-12 rounded-full object-cover border-2 border-teal-500 shadow-md'
                                />
                            ) : (
                                <AccountCircle
                                    color='inherit'
                                    style={{ fontSize: "48px", color: 'gray' }}
                                />
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
