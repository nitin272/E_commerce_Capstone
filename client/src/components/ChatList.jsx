import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import { useNavigate, useLocation } from 'react-router-dom';
import useConversation from '../Zustand/getConversation';
import SendMessage from '../hooks/SendMessage';
import getMessages from '../hooks/getMessages';
import { useSocketContext } from '../socket/Socket';
import useListenMessage from '../hooks/useListenMessage';
import { TextField, Button, IconButton, Menu, MenuItem, Badge } from '@mui/material';
import { AccountCircle, Menu as MenuIcon, Send as SendIcon, Message as MessageIcon, KeyboardArrowDown, Notifications as NotificationsIcon } from '@mui/icons-material';

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
    const { socket, onlineUser } = useSocketContext();
    const apiUrl = "https://e-commerce-capstone.onrender.com";
    const [anchorEl, setAnchorEl] = useState(null);
    const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
    const [notifications, setNotifications] = useState({});
    const [totalUnread, setTotalUnread] = useState(0);
    const [userNotifications, setUserNotifications] = useState({});

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
                    const filteredList = response.data.filter(item => 
                        item._id !== user._id && item.role !== 'admin'
                    );
                    setList(filteredList);

                    if (initialUserId) {
                        const conversation = filteredList.find(item => item._id === initialUserId);
                        if (conversation) {
                            setSelectedConversation(conversation);
                        }
                    }
                } else {
                    const adminId = '67bd518848b2f0f3e39fb302';
                    if (user._id !== adminId) {
                        const response = await axios.get(`${apiUrl}/user/${adminId}`, { headers, withCredentials: true });
                        if (response.data) {
                            setSelectedConversation(response.data);
                        }
                    } else {
                        setSelectedConversation(null);
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

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleUserSelect = (user) => {
        setSelectedConversation(user);
        handleMenuClose();
    };

    const handleNotificationClick = (event) => {
        setNotificationAnchorEl(event.currentTarget);
    };

    const handleNotificationClose = () => {
        setNotificationAnchorEl(null);
    };

    useEffect(() => {
        const total = Object.values(notifications).reduce((acc, curr) => acc + curr, 0);
        setTotalUnread(total);
    }, [notifications]);

    useEffect(() => {
        if (!socket || !user?._id) return;

        socket.emit("userOnline", user._id);

        const handleBeforeUnload = () => {
            socket.emit("userOffline", user._id);
        };
        window.addEventListener('beforeunload', handleBeforeUnload);

        socket.on("userOnlineStatus", ({ userId, isOnline, lastSeen }) => {
            setList(prevList => 
                prevList.map(u => 
                    u._id === userId 
                        ? { ...u, IsOnline: isOnline, lastSeen: lastSeen }
                        : u
                )
            );
        });

        return () => {
            socket.emit("userOffline", user._id);
            window.removeEventListener('beforeunload', handleBeforeUnload);
            socket.off("userOnlineStatus");
        };
    }, [socket, user?._id]);

    useEffect(() => {
        if (!socket || !user?.role === 'admin') return;

        socket.on("newMessage", (message) => {
            if (message.senderId !== user._id) {
                setUserNotifications(prev => ({
                    ...prev,
                    [message.senderId]: (prev[message.senderId] || 0) + 1
                }));
            }
        });

        return () => {
            if (socket) {
                socket.off("newMessage");
            }
        };
    }, [socket, user?._id, user?.role]);

    const renderChatHeader = () => (
        <header className="flex items-center p-4 md:p-6 bg-gradient-to-r from-teal-600 to-emerald-500 shadow-lg" 
                style={{ marginTop: "12vh" }}>
            <div className="flex items-center w-full justify-between">
                <div className="flex items-center">
                    {user?.role === 'admin' ? (
                        <Button
                            onClick={handleMenuClick}
                            className="text-white"
                            endIcon={<KeyboardArrowDown />}
                            sx={{
                                color: 'white',
                                textTransform: 'none',
                                fontSize: '1.1rem',
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                },
                            }}
                        >
                            {selectedConversation ? (
                                <div className="flex items-center">
                                    <div className="relative">
                                        {selectedConversation.ownerImg?.[0] ? (
                                            <img 
                                                src={selectedConversation.ownerImg[0]}
                                                alt="User"
                                                className="h-10 w-10 rounded-full object-cover border-2 border-white mr-3"
                                            />
                                        ) : (
                                            <AccountCircle className="h-10 w-10 mr-3" />
                                        )}
                                        <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white 
                                            ${selectedConversation.IsOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}>
                                        </span>
                                    </div>
                                    <div className="ml-2">
                                        <span>{selectedConversation.name || 'Select User'}</span>
                                        <div className="text-xs text-teal-50">
                                            {selectedConversation.IsOnline ? 'Active now' : 'Offline'}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                'Select User'
                            )}
                        </Button>
                    ) : (
                        <div className="flex items-center w-full">
                            {selectedConversation && (
                                <div className="flex items-center">
                                    <div className="relative">
                                        {selectedConversation.ownerImg?.[0] ? (
                                            <img 
                                                src={selectedConversation.ownerImg[0]}
                                                alt="Admin"
                                                className="h-14 w-14 rounded-full object-cover border-2 border-white shadow-md"
                                            />
                                        ) : (
                                            <AccountCircle className="h-14 w-14" />
                                        )}
                                        <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white 
                                            ${selectedConversation.IsOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}>
                                        </span>
                                    </div>
                                    <div className="ml-4">
                                        <h1 className="text-xl font-bold text-white tracking-wide">
                                            {selectedConversation.name || 'Admin Support'}
                                        </h1>
                                        <p className="text-sm text-teal-50 font-medium">
                                            {selectedConversation.IsOnline ? 'Active now' : 'Offline'}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="flex items-center">
                    <IconButton
                        onClick={handleNotificationClick}
                        sx={{ color: 'white' }}
                    >
                        <Badge badgeContent={totalUnread} color="error">
                            <NotificationsIcon />
                        </Badge>
                    </IconButton>
                </div>
            </div>

            <Menu
                anchorEl={notificationAnchorEl}
                open={Boolean(notificationAnchorEl)}
                onClose={handleNotificationClose}
                PaperProps={{
                    sx: {
                        mt: 1,
                        maxHeight: '60vh',
                        width: '300px',
                    },
                }}
            >
                {Object.keys(notifications).length === 0 ? (
                    <MenuItem sx={{ justifyContent: 'center', color: 'gray' }}>
                        No new messages
                    </MenuItem>
                ) : (
                    list.map((chatUser) => {
                        const unreadCount = notifications[chatUser._id] || 0;
                        if (unreadCount === 0) return null;
                        
                        return (
                            <MenuItem 
                                key={chatUser._id}
                                onClick={() => {
                                    handleUserSelect(chatUser);
                                    handleNotificationClose();
                                    setNotifications(prev => ({
                                        ...prev,
                                        [chatUser._id]: 0
                                    }));
                                }}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2,
                                    py: 1.5,
                                }}
                            >
                                <div className="flex items-center justify-between w-full">
                                    <div className="flex items-center gap-2">
                                        {chatUser.ownerImg?.[0] ? (
                                            <img 
                                                src={chatUser.ownerImg[0]}
                                                alt={chatUser.name}
                                                className="h-8 w-8 rounded-full object-cover"
                                            />
                                        ) : (
                                            <AccountCircle sx={{ fontSize: 32 }} />
                                        )}
                                        <div>
                                            <div className="font-medium">{chatUser.name}</div>
                                            <div className="text-sm text-gray-500">
                                                {unreadCount} new message{unreadCount > 1 ? 's' : ''}
                                            </div>
                                        </div>
                                    </div>
                                    <Badge badgeContent={unreadCount} color="error" />
                                </div>
                            </MenuItem>
                        );
                    })
                )}
            </Menu>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                    sx: {
                        mt: 1,
                        maxHeight: '60vh',
                        width: '280px',
                        '& .MuiMenuItem-root': {
                            padding: '12px 16px',
                        },
                    },
                }}
            >
                {list.map((chatUser) => (
                    <MenuItem 
                        key={chatUser._id} 
                        onClick={() => {
                            handleUserSelect(chatUser);
                            setUserNotifications(prev => ({
                                ...prev,
                                [chatUser._id]: 0
                            }));
                        }}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            borderRadius: '8px',
                            margin: '4px 8px',
                            padding: '12px',
                            '&:hover': {
                                backgroundColor: 'rgba(0, 0, 0, 0.04)',
                            },
                        }}
                    >
                        <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    {chatUser.ownerImg?.[0] ? (
                                        <img 
                                            src={chatUser.ownerImg[0]}
                                            alt={chatUser.name}
                                            className="h-10 w-10 rounded-full object-cover"
                                        />
                                    ) : (
                                        <AccountCircle sx={{ fontSize: 40 }} />
                                    )}
                                    <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white 
                                        ${chatUser.IsOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}>
                                    </span>
                                </div>
                                <div>
                                    <div className="font-medium text-gray-800">
                                        {chatUser.name}
                                        {userNotifications[chatUser._id] > 0 && (
                                            <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                                                {userNotifications[chatUser._id]}
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {chatUser.IsOnline ? 'Active now' : 'Offline'}
                                    </div>
                                </div>
                            </div>
                            {userNotifications[chatUser._id] > 0 && (
                                <div className="flex items-center">
                                    <span className="animate-pulse">
                                        <MessageIcon sx={{ color: 'rgb(14, 165, 233)', fontSize: 20 }} />
                                    </span>
                                </div>
                            )}
                        </div>
                    </MenuItem>
                ))}
            </Menu>
        </header>
    );
    
    const renderMessages = () => (
        <div className="flex-1 p-4 md:p-6 overflow-y-auto"
             style={{
                 backgroundImage: 'linear-gradient(to bottom right, #f0f9ff, #e0f2fe, #f0fdf4)',
                 backgroundAttachment: 'fixed',
                 height: 'calc(100vh - 24vh - 80px)',
             }}>
            {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full space-y-6">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400 
                                  flex items-center justify-center animate-pulse shadow-lg">
                        <SendIcon className="text-white" style={{ fontSize: "48px" }} />
                    </div>
                    <div className="text-center space-y-2 animate-fadeIn">
                        <h3 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-emerald-500 bg-clip-text text-transparent">
                            Welcome to Chat
                        </h3>
                        <p className="text-gray-600">Start your conversation with {selectedConversation?.name}</p>
                    </div>
                </div>
            ) : (
                <div className="space-y-4 md:space-y-6">
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`flex ${message.senderId === user._id ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`relative p-3 md:p-4 rounded-2xl max-w-[85%] md:max-w-[70%] ${
                                    message.senderId === user._id
                                        ? 'bg-gradient-to-r from-teal-500 via-emerald-400 to-cyan-400 text-white shadow-teal-200'
                                        : 'bg-white backdrop-blur-sm bg-opacity-90 shadow-lg text-gray-800'
                                }`}
                            >
                                <p className="text-sm md:text-base break-words leading-relaxed">
                                    {message.message}
                                </p>
                                {message.photoUrl && (
                                    <img
                                        src={message.photoUrl}
                                        alt="Sent"
                                        className="mt-3 rounded-lg max-w-xs shadow-md border border-white/20"
                                    />
                                )}
                                <div className="flex items-center justify-end space-x-2 mt-2">
                                    <p className="text-xs opacity-75">
                                        {abstractTime(message.createdAt)}
                                    </p>
                                    {message.senderId === user._id && (
                                        <MessageStatusIndicator status={message.status} />
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                    <div ref={lastMessageRef} className="h-4" />
                </div>
            )}
        </div>
    );
    
    

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
        <div className="p-4 md:p-6 bg-white border-t border-gray-100 shadow-lg">
            <form onSubmit={handleSubmit} 
                  className="flex items-center gap-3 max-w-4xl mx-auto bg-gray-50 p-2 rounded-2xl">
                <TextField
                    type="text"
                    value={newMessage}
                    placeholder="Type your message..."
                    fullWidth
                    onChange={(e) => setNewMessage(e.target.value)}
                    variant="standard"
                    InputProps={{
                        disableUnderline: true,
                        sx: {
                            padding: '8px 16px',
                            fontSize: { xs: '0.875rem', md: '1rem' },
                            '&:hover': {
                                backgroundColor: 'transparent'
                            }
                        }
                    }}
                />
                <Button
                    type="submit"
                    variant="contained"
                    disabled={!newMessage.trim()}
                    sx={{
                        borderRadius: '12px',
                        minWidth: '48px',
                        height: '48px',
                        backgroundColor: '#0d9488',
                        '&:hover': {
                            backgroundColor: '#0f766e',
                            transform: 'translateY(-2px)',
                        },
                        transition: 'all 0.3s ease',
                    }}
                >
                    <SendIcon />
                </Button>
            </form>
        </div>
    );
      
    
      const renderSidebar = () => (
        <div 
            className={`fixed top-0 left-0 h-full bg-white shadow-2xl transition-all duration-300 ease-in-out 
                       ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`} 
            style={{ width: '320px', marginTop: "12vh", zIndex: 50 }}
        >
            <div className="h-full overflow-y-auto">
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Conversations</h2>
                    <div className="space-y-3">
                        {list.length > 0 ? (
                            list.map((item) => (
                                <div
                                    key={item._id}
                                    onClick={() => {
                                        setSelectedConversation(item);
                                        setIsSidebarOpen(false);
                                        setUserNotifications(prev => ({
                                            ...prev,
                                            [item._id]: 0
                                        }));
                                    }}
                                    className={`flex items-center p-4 rounded-xl cursor-pointer transition-all duration-300
                                              transform hover:scale-[1.02] relative ${
                                        selectedConversation?._id === item._id 
                                            ? 'bg-gradient-to-r from-teal-500 to-emerald-400 text-white shadow-lg' 
                                            : 'hover:bg-gray-50'
                                    }`}
                                >
                                    <div className="relative">
                                        {item.ownerImg?.[0] ? (
                                            <img
                                                src={item.ownerImg[0]}
                                                alt="User"
                                                className="h-12 w-12 rounded-full object-cover border-2 border-white shadow-md"
                                            />
                                        ) : (
                                            <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                                                <AccountCircle style={{ fontSize: "40px" }} 
                                                             className={selectedConversation?._id === item._id ? 'text-white' : 'text-gray-400'} />
                                            </div>
                                        )}
                                        <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white 
                                                       ${selectedConversation?._id === item._id ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}>
                                        </span>
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="font-semibold text-lg">{item.name}</h3>
                                        <p className={`text-sm ${selectedConversation?._id === item._id ? 'text-teal-50' : 'text-gray-500'}`}>
                                            {item.username}
                                        </p>
                                    </div>
                                    {userNotifications[item._id] > 0 && (
                                        <div className="absolute -right-2 -top-2 bg-red-500 text-white rounded-full px-2 py-1 text-xs font-bold shadow-lg animate-bounce">
                                            {userNotifications[item._id]}
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                    <AccountCircle className="text-gray-400" style={{ fontSize: "40px" }} />
                                </div>
                                <p className="text-gray-500 text-lg">No conversations available</p>
                            </div>
                        )}
                    </div>
                </div>
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

    useEffect(() => {
        if (!socket) return;

        socket.on("newMessage", (message) => {
            if (message.senderId !== user._id && 
                (!selectedConversation || message.senderId !== selectedConversation._id)) {
                setNotifications(prev => ({
                    ...prev,
                    [message.senderId]: (prev[message.senderId] || 0) + 1
                }));
            }
        });

        return () => {
            if (socket) {
                socket.off("newMessage");
            }
        };
    }, [socket, selectedConversation, user._id]);

    return (
        <div className="flex flex-col h-screen overflow-hidden">
            <Navbar />
            {renderChatHeader()}
            {renderMessages()}
            {renderMessageInput()}
        </div>
    );
};

export default ChatList;
