import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { setSelectedUser } from "@/redux/authSlice";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { MessageCircleCode } from "lucide-react";
import Messages from "./Messages";
import axios from "axios";
import { setMessages } from "@/redux/chatSlice";

const ChatPage = () => {
  const [textMessage, setTextMessage] = useState("");
  const { user, suggestedUsers, selectedUser } = useSelector((store) => store.auth);
  const { onlineUsers, messages } = useSelector((store) => store.chat);
  const dispatch = useDispatch();

  const darkMode = document.documentElement.classList.contains("dark");

  const sendMessageHandler = async (receiverId) => {
    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/message/send/${receiverId}`,
        { textMessage },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(setMessages([...messages, res.data.newMessage]));
        setTextMessage("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    return () => dispatch(setSelectedUser(null));
  }, []);

  return (
    <div className="flex flex-col md:flex-row md:ml-[80px] h-[calc(100vh-4rem)]">
      {/* Left Panel - Users */}
<section
  className={`w-full md:w-1/4 p-4 space-y-4 overflow-y-auto backdrop-blur-md transition-all
    ${darkMode
      ? "bg-[rgba(30,30,60,0.4)] border-r border-[rgba(255,255,255,0.1)] text-white"
      : "bg-[rgba(255,255,255,0.4)] border-r border-[rgba(0,0,0,0.1)] text-gray-800"}`}
>
  {/* Current user info */}
  <div className="flex items-center gap-3 mb-2 px-1">
    <Avatar className="w-10 h-10">
      <AvatarImage src={user?.profilePicture} />
      <AvatarFallback>U</AvatarFallback>
    </Avatar>
    <div className="flex flex-col">
      <h1 className="font-bold text-lg leading-tight">{user?.username}</h1>
      <p className="text-xs text-zinc-400 dark:text-zinc-500">You</p>
    </div>
  </div>

  <hr className="border-zinc-300 dark:border-zinc-700" />

  {/* Suggested users */}
  <div className="space-y-3">
    {suggestedUsers.map((suggestedUser) => {
      const isOnline = onlineUsers.includes(suggestedUser?._id);
      return (
        <div
          key={suggestedUser?._id}
          onClick={() => dispatch(setSelectedUser(suggestedUser))}
          className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer group transition 
            ${
              darkMode
                ? "hover:bg-[rgba(255,255,255,0.05)]"
                : "hover:bg-[rgba(0,0,0,0.05)]"
            }`}
        >
          <Avatar className="w-12 h-12 border-2 border-[#8A2BE2]">
            <AvatarImage src={suggestedUser?.profilePicture} />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>

          <div className="flex flex-col flex-1 truncate">
            <span className="font-medium truncate">
              {suggestedUser?.username}
            </span>
            <span
              className={`text-xs font-bold ${
                isOnline ? "text-green-500" : "text-red-500"
              }`}
            >
              {isOnline ? "online" : "offline"}
            </span>
          </div>
        </div>
      );
    })}
  </div>
</section>

      {/* Right Panel - Chat */}
      {selectedUser ? (
        <section
          className={`flex-1 flex flex-col backdrop-blur-md transition-all
            ${darkMode
              ? "bg-[rgba(25,25,40,0.75)] border-l border-[rgba(255,255,255,0.1)]"
              : "bg-[rgba(255,255,255,0.4)] border-l border-[rgba(0,0,0,0.1)]"}`}
        >
          {/* Chat Header */}
          <div
            className={`flex items-center gap-3 p-4 sticky top-0 z-10 border-b backdrop-blur-sm
              ${darkMode
                ? "bg-[rgba(25,25,40,0.9)] border-[rgba(255,255,255,0.1)] text-white"
                : "bg-[rgba(255,255,255,0.9)] border-[rgba(0,0,0,0.1)] text-gray-800"}`}
          >
            <Avatar>
              <AvatarImage src={selectedUser?.profilePicture} alt="profile" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <span className="font-semibold">{selectedUser?.username}</span>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 py-4">
            <Messages selectedUser={selectedUser} />
          </div>

          {/* Input */}
          <div
            className={`flex items-center gap-3 p-4 border-t backdrop-blur-md
              ${darkMode
                ? "border-[rgba(255,255,255,0.1)]"
                : "border-[rgba(0,0,0,0.1)]"}`}
          >
            <Input
              value={textMessage}
              onChange={(e) => setTextMessage(e.target.value)}
              type="text"
              placeholder="Type your message..."
              className={`flex-1 rounded-full px-4 py-2 text-sm transition-all border
                ${darkMode
                  ? "bg-[rgba(255,255,255,0.1)] border-[rgba(255,255,255,0.2)] text-white placeholder-gray-400"
                  : "bg-[rgba(0,0,0,0.05)] border-[rgba(0,0,0,0.1)] text-gray-800 placeholder-gray-500"}`}
            />
            <Button
              onClick={() => sendMessageHandler(selectedUser?._id)}
              className="rounded-full bg-gradient-to-br from-[#8A2BE2] to-[#FF1493] text-white px-4 py-2"
            >
              Send
            </Button>
          </div>
        </section>
      ) : (
        <div
          className={`flex-1 flex flex-col items-center justify-center text-center backdrop-blur-md
            ${darkMode ? "bg-[rgba(25,25,40,0.85)] text-white" : "bg-white text-gray-800"}`}
        >
          <MessageCircleCode className="w-24 h-24 text-zinc-400 dark:text-zinc-600 mb-4" />
          <h2 className="text-xl font-semibold">Your messages</h2>
          <p className="text-gray-500 dark:text-gray-400">Send a message to start a chat.</p>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
