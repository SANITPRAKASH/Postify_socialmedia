import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";

const SuggestedUsers = () => {
  const { suggestedUsers, user } = useSelector((store) => store.auth);
  const [followingMap, setFollowingMap] = useState({});

  const handleFollowToggle = async (sugUser) => {
    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/user/followorunfollow/${sugUser._id}`,
        {},
        { withCredentials: true }
      );

      if (res.data.success) {
        setFollowingMap((prev) => ({
          ...prev,
          [sugUser._id]: !prev[sugUser._id],
        }));

        toast.success(
          res.data.message.includes("Unfollowed")
            ? `You unfollowed @${sugUser.username}`
            : `You're now following @${sugUser.username}`
        );
      }
    } catch (err) {
      console.error("Follow/unfollow failed", err);
      toast.error("Action failed. Try again.");
    }
  };

  return (
    <div className="my-10 border border-border/60 backdrop-blur-md rounded-xl p-4 bg-white/70 dark:bg-white/5 shadow-md dark:shadow-none transition-all duration-300">
      <div className="flex items-center justify-between text-sm mb-3">
        <h1 className="font-semibold text-muted-foreground">Suggested for you</h1>
      </div>

      <div className="space-y-4">
        {suggestedUsers.map((sugUser) => {
          if (sugUser._id === user?._id) return null;

          const isFollowing =
            followingMap[sugUser._id] ?? sugUser.followers.includes(user?._id);

          return (
            <div
              key={sugUser._id}
              className="flex items-center justify-between gap-2 pb-3 border-b border-border/30 last:border-none"
            >
              <div className="flex items-center gap-3">
                <Link to={`/profile/${sugUser._id}`}>
                  <Avatar className="h-10 w-10 ring-2 ring-transparent hover:ring-purple-500 transition">
                    <AvatarImage src={sugUser.profilePicture} alt="user" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </Link>
                <div className="text-sm">
                  <Link
                    to={`/profile/${sugUser._id}`}
                    className="font-semibold hover:underline"
                  >
                    {sugUser.username}
                  </Link>
                  <p className="text-xs text-muted-foreground">
                    {sugUser.bio || "bio here..."}
                  </p>
                </div>
              </div>
              <Button
                variant={isFollowing ? "outline" : "ghost"}
                size="sm"
                className={`text-xs font-semibold px-3 py-1 rounded-full transition-all duration-200 ${
                  isFollowing
                    ? "text-muted-foreground hover:bg-red-200 dark:hover:bg-red-800"
                    : "text-[#299dc4] hover:text-white hover:bg-[#9d37ba]"
                }`}
                onClick={() => handleFollowToggle(sugUser)}
              >
                {isFollowing ? "Unfollow" : "Follow"}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SuggestedUsers;
