import useConversation from "../Zustand/getConversation"
import axios from "axios"
const SendMessage = () => {
    const {messages,selectedConversation, setMessages,conversation_Id, setConversationId} = useConversation()

    const apiUrl  = import.meta.env.VITE_APP_API_URL
    const sendMessage = async (newMessage,user)=>{
        try {
            const response = await axios.post(`${apiUrl}/message/send/${selectedConversation._id}`,{
                message: newMessage,
                senderId: user._id
            })
            console.log("send message",response.data.newMessage);
            setConversationId(response.data.conversation.id)
            console.log("conversation_Id",conversation_Id);
            setMessages([...messages,response.data.newMessage])
        } catch (error) {
            console.log(error);
        }
    }
    return {sendMessage}
}

export default SendMessage
