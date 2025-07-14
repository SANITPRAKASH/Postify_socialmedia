import {
  Home,
  MessageCircle,
  Heart,
  PlusSquare,
  LogOut,
  X,
} from "lucide-react";
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
import { clearLikeNotifications } from "@/redux/rtnSlice";

const LeftSidebar = () => {
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
  const { likeNotification } = useSelector(
    (store) => store.realTimeNotification
  );
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [showPopover, setShowPopover] = useState(false);

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
      toast.error(error.response?.data?.message || "Logout failed");
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
          {/* Notification Popover Trigger */}
          {item.text === "Notifications" && likeNotification.length > 0 ? (
            <Popover open={showPopover} onOpenChange={setShowPopover}>
              <PopoverTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="w-11 h-11 flex items-center justify-center rounded-lg 
                  bg-[rgba(0,0,0,0.05)] dark:bg-[#222255] 
                  hover:bg-[#8A2BE2] hover:text-white 
                  transition-all duration-300 shadow-sm"
                >
                  {item.icon}
                  {/* Notification Count Badge */}
                  <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {likeNotification.length}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent
                align="start"
                side="right"
                className="w-72 transform skew-x-[-6deg] 
  bg-white/80 text-zinc-800 
  dark:bg-[#111827]/90 dark:text-zinc-100
  backdrop-blur-md rounded-2xl shadow-2xl 
  border border-white/20 dark:border-white/10 p-4 transition-colors duration-300"
              >
                <div className="transform skew-x-[6deg]">
                  {/* ❌ Close and Clear Button */}
                  <button
                    onClick={() => {
                      dispatch(clearLikeNotifications());
                      setShowPopover(false);
                    }}
                    className="absolute top-3 right-3 text-zinc-500 hover:text-red-500 transition-all"
                  >
                    <X size={18} />
                  </button>

                  <h3 className="text-sm font-semibold text-zinc-800 dark:text-white mb-4">
                    Likes Notification
                  </h3>

                  {likeNotification.length === 0 ? (
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      No new notifications
                    </p>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {likeNotification.map((notification) => (
                        <div
                          key={notification.userId}
                          className="flex items-center gap-3 px-2 py-1 
            hover:bg-zinc-100 dark:hover:bg-zinc-800 
            rounded-lg transition-all"
                        >
                          <Avatar className="w-9 h-9">
                            <AvatarImage
                              src={notification.userDetails?.profilePicture}
                            />
                            <AvatarFallback>CN</AvatarFallback>
                          </Avatar>
                          <p className="text-sm text-zinc-700 dark:text-zinc-200">
                            <span className="font-bold">
                              {notification.userDetails?.username}
                            </span>{" "}
                            liked your post
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          ) : (
            <Button
              size="icon"
              variant="ghost"
              onClick={() => sidebarHandler(item.text)}
              data-testid={item.text === "Logout" ? "logout" : undefined} 
              className="w-11 h-11 flex items-center justify-center rounded-lg 
              bg-[rgba(0,0,0,0.05)] dark:bg-[#222255] 
              hover:bg-[#8A2BE2] hover:text-white 
              transition-all duration-300 shadow-sm"
            >
              {item.icon}
            </Button>
          )}

          {/* Tooltip on hover */}
          <span className="absolute left-14 top-1/2 -translate-y-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 bg-black text-white text-xs px-2 py-1 rounded shadow-md transition-all duration-200 z-10">
            {item.text}
          </span>
        </div>
      ))}

      <CreatePost open={open} setOpen={setOpen} />
    </aside>
  );
};

export default LeftSidebar;
