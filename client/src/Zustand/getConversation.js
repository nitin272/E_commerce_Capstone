import {create} from 'zustand'

const useConversation = create((set)=>({
    //store the selected user for conversation
    selectedConversation : null,
    setSelectedConversation : (selectedConversation) => set({selectedConversation}),

    //store the message 
    messages: [],
    setMessages: (messages)=>set({messages}),

    //storing the conversation Id
    conversation_Id : null,
    setConversationId : (conversation_Id)=>set({conversation_Id}),

    //selected navbar option
    // navbarOption : '',
    // setNavbarOption : (navbarOption) => set({navbarOption})
    
}))

export default useConversation