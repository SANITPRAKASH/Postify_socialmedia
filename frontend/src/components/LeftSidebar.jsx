import { Home, MessageCircle, Heart, PlusSquare, LogOut } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "@/redux/authSlice";
import { setPosts, setSelectedPost } from "@/redux/postSlice";
import CreatePost from "./CreatePost";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";

const LeftSidebar = () => {
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
  const { likeNotification = [], messageNotification = [] } = useSelector(
    (store) => store.realTimeNotification
  );
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const logoutHandler = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/v1/user/logout", {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setAuthUser(null));
        dispatch(setSelectedPost(null));
        dispatch(setPosts([]));
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const sidebarHandler = (textType) => {
    switch (textType) {
      case "Logout":
        logoutHandler();
        break;
      case "Create":
        setOpen(true);
        break;
      case "Profile":
        navigate(`/profile/${user?._id}`);
        break;
      case "Home":
        navigate("/");
        break;
      case "Messages":
        navigate("/chat");
        break;
      default:
        break;
    }
  };

  const sidebarItems = [
    { icon: <Home size={20} />, text: "Home" },
    { icon: <MessageCircle size={20} />, text: "Messages" },
    { icon: <Heart size={20} />, text: "Notifications" },
    { icon: <PlusSquare size={20} />, text: "Create" },
    {
      icon: (
        <Avatar className="w-6 h-6">
          <AvatarImage src={user?.profilePicture} alt="@user" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      ),
      text: "Profile",
    },
    { icon: <LogOut size={20} />, text: "Logout" },
  ];

  return (
    <aside
      className="fixed top-16 left-0 w-20 h-[calc(100vh-4rem)] flex flex-col items-center py-4 space-y-4 z-50 
  bg-[rgba(255,255,255,0.35)] 
  dark:bg-[rgba(15,15,35,0.85)] 
  backdrop-blur-md 
  border-r border-[rgba(0,0,0,0.1)] 
  dark:border-[rgba(255,255,255,0.05)] 
  shadow-lg transition-all duration-300"
    >
      {sidebarItems.map((item, index) => (
        <div key={index} className="relative group">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => sidebarHandler(item.text)}
            className="w-11 h-11 flex items-center justify-center rounded-lg 
  bg-[rgba(0,0,0,0.05)] dark:bg-[#222255] 
  hover:bg-[#8A2BE2] hover:text-white 
  transition-all duration-300 shadow-sm"
          >
            {item.icon}
          </Button>

          <span className="absolute left-14 top-1/2 -translate-y-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 bg-black text-white text-xs px-2 py-1 rounded shadow-md transition-all duration-200 z-10">
            {item.text}
          </span>

          {/* Like Notification */}
          {item.text === "Notifications" && likeNotification.length > 0 && (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  size="icon"
                  className="absolute -bottom-2 -right-2 h-5 w-5 rounded-full bg-red-600 text-white text-xs font-bold"
                >
                  {likeNotification.length}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64">
                {likeNotification.map((n) => (
                  <div key={n.userId} className="flex gap-2 items-center my-2">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={n.userDetails?.profilePicture} />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">
                      <strong>{n.userDetails?.username}</strong> liked your post
                    </span>
                  </div>
                ))}
              </PopoverContent>
            </Popover>
          )}

          {/* Message Notification */}
          {item.text === "Messages" && messageNotification.length > 0 && (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  size="icon"
                  className="absolute -bottom-2 -right-2 h-5 w-5 rounded-full bg-blue-600 text-white text-xs font-bold"
                >
                  {messageNotification.length}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64">
                {messageNotification.map((n) => (
                  <div key={n.userId} className="flex gap-2 items-center my-2">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={n.userDetails?.profilePicture} />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">
                      <strong>{n.userDetails?.username}</strong> sent a message
                    </span>
                  </div>
                ))}
              </PopoverContent>
            </Popover>
          )}
        </div>
      ))}

      <CreatePost open={open} setOpen={setOpen} />
    </aside>
  );
};

export default LeftSidebar;
