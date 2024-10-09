import { createContext, useContext, useEffect, useState } from "react";
import io from 'socket.io-client'
import axios from "axios";
import useConversation from '../Zustand/getConversation'
export const SocketContext = createContext()

export const useSocketContext = () => {
  return useContext(SocketContext)
}
export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null)
  const [run, setRun] = useState(false)
  const [onlineUser, setOnlineUser] = useState([])
  const [user, setUser] = useState(null)
  const {selectedConversation,conversation_Id } = useConversation()

  const apiUrl = import.meta.env.VITE_APP_API_URL
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
      // console.log("selectedConversation",selectedConversation);
      // console.log('selectedConversation',selectedConversation? selectedConversation._id: null);
      console.log("conversation_Id in getMEssage",conversation_Id);

      const socket = io(`${apiUrl}`, {
        query: {
          userId: user._id,
          conversationId : conversation_Id
        }
      })
      // console.log("socket", socket);
      setRun(true)
      socket.on('getOnlineUSer', (users) => {
        setOnlineUser(users)
      })

      setSocket(socket)

      return () => socket.close()
    } else {
      setSocket(null)
      setOnlineUser([])
      // if (socket) {
      //   socket.close()
      //   setSocket(null)
      // }
    }

  }, [user,run,selectedConversation,conversation_Id])
  return <SocketContext.Provider value={{ socket, onlineUser }}>{children}</SocketContext.Provider>
}