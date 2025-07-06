import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import useGetAllMessage from "@/hooks/useGetAllMessage";
import useGetRTM from "@/hooks/useGetRTM";
import PropTypes from "prop-types";
import { Trash2, CheckCheck } from "lucide-react";
import useDeleteMessage from "@/hooks/useDeleteMessage";

const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

const Messages = ({ selectedUser }) => {
  useGetRTM();
  useGetAllMessage();

  const { messages } = useSelector((store) => store.chat);
  const { user, darkMode } = useSelector((store) => store.auth);
  const safeMessages = Array.isArray(messages) ? messages : [];

  const deleteMessage=useDeleteMessage();

  return (
    <div className="overflow-y-auto flex-1 px-4 py-6">
      {/* Top Info */}
      <div className="flex flex-col items-center justify-center text-center mb-6">
        <Avatar className="h-20 w-20 border-2 border-[#8A2BE2]">
          <AvatarImage src={selectedUser?.profilePicture} alt="profile" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <span className="mt-2 font-semibold text-zinc-800 dark:text-white text-lg">
          {selectedUser?.username}
        </span>
        <Link to={`/profile/${selectedUser?._id}`}>
          <Button variant="secondary" className="h-8 mt-2">
            View profile
          </Button>
        </Link>
      </div>

      {/* Date Separator */}
      {safeMessages.length > 0 && (
        <div className="flex items-center justify-center my-4">
          <div
            className={`px-3 py-1 rounded-full text-xs ${
              darkMode
                ? "bg-[rgba(255,255,255,0.1)] text-gray-300"
                : "bg-[rgba(0,0,0,0.05)] text-gray-600"
            }`}
          >
            Today,{" "}
            {new Date().toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="space-y-6">
        {safeMessages.map((msg) => {
          const isSelf = msg.senderId === user?._id;

          return (
            <div key={msg._id} className="space-y-1">
              <div className={`flex ${isSelf ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm shadow-md ${
                    isSelf
                      ? "bg-gradient-to-br from-[#8A2BE2] to-[#FF1493] text-white rounded-tr-none"
                      : "bg-[rgba(255,255,255,0.1)] dark:bg-[rgba(255,255,255,0.05)] text-gray-800 dark:text-gray-100 rounded-tl-none"
                  }`}
                  style={{
                    backdropFilter: "blur(10px)",
                    WebkitBackdropFilter: "blur(10px)",
                  }}
                >
                  <p className="whitespace-pre-wrap break-words">{msg.message}</p>
                </div>
              </div>

              {/* Footer Row Outside Bubble */}
              <div
                className={`flex items-center gap-2 text-[10px] px-2 ${
                  isSelf ? "justify-end" : "justify-start"
                } ${darkMode ? "text-gray-300" : "text-gray-400"}`}
              >
                <span>{formatTime(msg.createdAt)}</span>
                {isSelf && <CheckCheck className="h-3 w-3 text-blue-400" />
                && <Trash2

                  className={`h-3 w-3 cursor-pointer ${
                    darkMode
                      ? "text-gray-400 hover:text-red-500"
                      : "text-gray-300 hover:text-red-600"
                  }`}
                  title="Delete message"
                  onClick={() => deleteMessage(msg._id)} // 💣 implement later
                />}
                
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

Messages.propTypes = {
  selectedUser: PropTypes.shape({
    _id: PropTypes.string,
    username: PropTypes.string,
    profilePicture: PropTypes.string,
  }),
};

export default Messages;
