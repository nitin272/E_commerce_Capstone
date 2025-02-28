import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client'
import axios from "axios";
import useConversation from '../Zustand/getConversation'

const SocketContext = createContext()

export const useSocketContext = () => {
  const context = useContext(SocketContext)
  if (!context) {
    throw new Error('useSocketContext must be used within a SocketContextProvider')
  }
  return context
}

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null)
  const [run, setRun] = useState(false)
  const [onlineUsers, setOnlineUsers] = useState([])
  const [user, setUser] = useState(null)
  const {selectedConversation,conversation_Id } = useConversation()

  const apiUrl = import.meta.env.VITE_APP_API_URL;
  const fetchUser = async () => {
    try {
      const id = localStorage.getItem('id')

      const response = await axios.get(`${apiUrl}/login/success`, (!id) ? { withCredentials: true } : {
        headers: {
          'Authorization': `Bearer ${id}`,
        }

      },)
      setUser(response.data.user)
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    fetchUser()
  },[])
  useEffect(() => {
    if (user ) {
      console.log("conversation_Id in getMEssage",conversation_Id);

      const socket = io(`${apiUrl}`, {
        query: {
          userId: user._id,
          conversationId : conversation_Id
        }
      })
      setRun(true)
      socket.on('getOnlineUSer', (users) => {
        setOnlineUsers(users)
      })

      setSocket(socket)

      return () => socket.close()
    } else {
      setSocket(null)
      setOnlineUsers([])

    }

  }, [user,run,selectedConversation,conversation_Id])

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_APP_API_URL);
    setSocket(newSocket);

    newSocket.on("getOnlineUsers", (users) => {
      setOnlineUsers(users);
    });

    return () => {
      if (newSocket) newSocket.close();
    };
  }, []);

  return <SocketContext.Provider value={{ socket, onlineUsers }}>{children}</SocketContext.Provider>
}