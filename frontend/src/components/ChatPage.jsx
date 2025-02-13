import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { setSelectedUser } from '@/redux/authSlice';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { MessageCircleCode } from 'lucide-react';
import Messages from './Messages.jsx';
import axios from 'axios';
import { setMessages } from '@/redux/chatSlice';

const ChatPage = () => {
    // State for storing the message text
    const [textMessage, setTextMessage] = useState("");

    // Destructure values from Redux store
    const { user, suggestedUsers, selectedUser } = useSelector(store => store.auth);
    const { onlineUsers, messages } = useSelector(store => store.chat);
    const dispatch = useDispatch(); // Dispatch function for interacting with Redux store

    // Function to send the message
    const sendMessageHandler = async (receiverId) => {
        try {
            // Sending message using Axios POST request to the backend
            const res = await axios.post(`http://localhost:8000/api/v1/message/send/${receiverId}`, { textMessage }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true // Ensures cookies are sent for authentication
            });
            
            // If message is successfully sent, update the Redux store with the new message
            if (res.data.success) {
                dispatch(setMessages([...messages, res.data.newMessage])); // Add the new message to the messages array
                setTextMessage(""); // Clear the message input field
            }
        } catch (error) {
            console.log(error); // Log any error
        }
    };

    // Clean up the selected user when the component unmounts or changes
    useEffect(() => {
        return () => {
            dispatch(setSelectedUser(null)); // Clear selected user from Redux when the component is unmounted
        };
    }, [dispatch]);

    return (
        <div className='flex ml-[16%] h-screen'>
            {/* Sidebar section showing suggested users */}
            <section className='w-full md:w-1/4 my-8'>
                <h1 className='font-bold mb-4 px-3 text-xl'>{user?.username}</h1>
                <hr className='mb-4 border-gray-300' />
                <div className='overflow-y-auto h-[80vh]'>
                    {
                        // Mapping through suggested users and displaying them
                        suggestedUsers.map((suggestedUser) => {
                            const isOnline = onlineUsers.includes(suggestedUser?._id); // Check if the user is online
                            return (
                                <div key={suggestedUser?._id} onClick={() => dispatch(setSelectedUser(suggestedUser))} className='flex gap-3 items-center p-3 hover:bg-gray-50 cursor-pointer'>
                                    {/* Avatar for the suggested user */}
                                    <Avatar className='w-14 h-14'>
                                        <AvatarImage src={suggestedUser?.profilePicture} />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                    <div className='flex flex-col'>
                                        <span className='font-medium'>{suggestedUser?.username}</span>
                                        <span className={`text-xs font-bold ${isOnline ? 'text-green-600' : 'text-red-600'} `}>
                                            {/* Display online/offline status */}
                                            {isOnline ? 'online' : 'offline'}
                                        </span>
                                    </div>
                                </div>
                            );
                        })
                    }
                </div>
            </section>

            {/* Main chat section for the selected user */}
            {
                selectedUser ? (
                    <section className='flex-1 border-l border-l-gray-300 flex flex-col h-full'>
                        {/* Header with selected user info */}
                        <div className='flex gap-3 items-center px-3 py-2 border-b border-gray-300 sticky top-0 bg-white z-10'>
                            <Avatar>
                                <AvatarImage src={selectedUser?.profilePicture} alt='profile' />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <div className='flex flex-col'>
                                <span>{selectedUser?.username}</span>
                            </div>
                        </div>

                        {/* Displaying messages with the selected user */}
                        <Messages selectedUser={selectedUser} />

                        {/* Message input area */}
                        <div className='flex items-center p-4 border-t border-t-gray-300'>
                            <Input
                                value={textMessage} 
                                onChange={(e) => setTextMessage(e.target.value)} // Handle input change
                                type="text" 
                                className='flex-1 mr-2 focus-visible:ring-transparent' 
                                placeholder="Messages..." 
                            />
                            <Button onClick={() => sendMessageHandler(selectedUser?._id)}>Send</Button>
                        </div>
                    </section>
                ) : (
                    // Display this message if no user is selected
                    <div className='flex flex-col items-center justify-center mx-auto'>
                        <MessageCircleCode className='w-32 h-32 my-4' />
                        <h1 className='font-medium'>Your messages</h1>
                        <span>Send a message to start a chat.</span>
                    </div>
                )
            }
        </div>
    );
};

export default ChatPage;
