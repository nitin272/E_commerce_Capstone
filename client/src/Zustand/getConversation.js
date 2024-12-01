import {create} from 'zustand'

const useConversation = create((set)=>({

    selectedConversation : null,
    setSelectedConversation : (selectedConversation) => set({selectedConversation}),
    messages: [],
    setMessages: (messages)=>set({messages}),
    conversation_Id : null,
    setConversationId : (conversation_Id)=>set({conversation_Id}),
}))

export default useConversation