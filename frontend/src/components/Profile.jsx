import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import useGetUserProfile from "@/hooks/useGetUserProfile";
import { Link, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "./ui/button";
import { Heart, MessageCircle } from "lucide-react";
import { updateFollowers } from "@/redux/authSlice";
import axios from "axios";

const Profile = () => {
  const params = useParams();
  const userId = params.id;
  useGetUserProfile(userId);
  const [activeTab, setActiveTab] = useState("posts");
  const [isFollowing, setIsFollowing] = useState(false);
  const dispatch = useDispatch();

  const { userProfile, user } = useSelector((store) => store.auth);
  const darkMode = useSelector((state) => state.theme?.darkMode || false);

  const isLoggedInUserProfile = user?._id === userProfile?._id;

  useEffect(() => {
    if (userProfile && user) {
      setIsFollowing(userProfile.followers.some((f) => f._id === user._id));
    }
  }, [userProfile, user]);

  const handleTabChange = (tab) => setActiveTab(tab);

  const displayedPost =
    activeTab === "posts" ? userProfile?.posts : userProfile?.bookmarks;

  const handleFollowToggle = async () => {
    try {
      const res = await axios.post(
        `https://postify-socialmedia.onrender.com/api/v1/user/followorunfollow/${userProfile._id}`,
        {},
        { withCredentials: true }
      );

      if (res.data.success) {
        setIsFollowing((prev) => !prev);
        dispatch(updateFollowers(user._id));
      }
    } catch (err) {
      console.error("Failed to toggle follow:", err);
    }
  };

  return (
    <div className={`flex flex-col items-center w-full px-4 sm:px-6 lg:px-10 py-8 ${darkMode ? "text-white" : "text-black"}`}>
      <div className={`w-full max-w-5xl rounded-xl backdrop-blur-md border overflow-hidden ${darkMode ? "bg-[rgba(20,20,40,0.4)] border-[rgba(255,255,255,0.08)]" : "bg-[rgba(255,255,255,0.6)] border-[rgba(0,0,0,0.05)]"}`}>
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 px-4 sm:px-10 pt-6">
          <section className="flex items-center justify-center">
            <Avatar className="h-28 w-28 sm:h-32 sm:w-32">
              <AvatarImage src={userProfile?.profilePicture} alt="profilephoto" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </section>

          <section className="flex flex-col gap-5">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-lg font-semibold">{userProfile?.username}</span>

              {isLoggedInUserProfile ? (
                <>
                  <Link to="/account/edit">
                    <Button variant="secondary" className="h-8">Edit profile</Button>
                  </Link>
                  <Button variant="secondary" className="h-8">{userProfile?.gender || "Gender"}</Button>
                </>
              ) : (
                <>
                  <Button
                    variant={isFollowing ? "secondary" : "default"}
                    className={`h-8 ${isFollowing ? "text-red-500 border-red-400 hover:bg-red-100 dark:hover:bg-red-900 dark:border-red-600 dark:text-red-400" : "bg-[#0095F6] hover:bg-[#3192d2] text-white"}`}
                    onClick={handleFollowToggle}
                  >
                    {isFollowing ? "Unfollow" : "Follow"}
                  </Button>
                  {isFollowing && (
                    <Button variant="secondary" className="h-8">Message</Button>
                  )}
                </>
              )}
            </div>

            <div className="flex flex-wrap gap-4 text-sm">
              <p><span className="font-semibold">{userProfile?.posts.length}</span> posts</p>
              <p><span className="font-semibold">{userProfile?.followers.length}</span> followers</p>
              <p><span className="font-semibold">{userProfile?.following.length}</span> following</p>
            </div>

            <div>
              <span className="font-medium">{userProfile?.bio || "bio here..."}</span>
            </div>
          </section>
        </div>

        {/* Tabs */}
        <div className={`border-t mt-8 ${darkMode ? "border-gray-700" : "border-gray-300"}`}>
          <div className="flex items-center justify-center gap-6 sm:gap-10 text-sm pt-3 flex-wrap">
            {["posts", "BookMarks", "People you Know"].map((tab) => (
              <span
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`py-2 sm:py-3 cursor-pointer transition-all duration-200 uppercase tracking-wider ${
                  activeTab === tab
                    ? `${darkMode ? "font-bold text-white border-b-2 border-white" : "font-bold text-black border-b-2 border-black"}`
                    : "text-muted-foreground opacity-70"
                }`}
              >
                {tab}
              </span>
            ))}
          </div>

          {/* Posts or People */}
          {activeTab === "People you Know" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 py-6">
              {/* Followers */}
              <div>
                <h2 className="text-sm font-semibold mb-3 uppercase tracking-wider text-muted-foreground">Followers</h2>
                <div className="flex flex-col gap-4">
                  {userProfile?.followers?.map((follower) => (
                    <Link to={`/profile/${follower._id}`} key={follower._id} className="flex items-center gap-3 hover:bg-muted px-3 py-2 rounded transition-all">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={follower.profilePicture} />
                        <AvatarFallback>{follower.username?.slice(0, 2)?.toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{follower.username}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Following */}
              <div>
                <h2 className="text-sm font-semibold mb-3 uppercase tracking-wider text-muted-foreground">Following</h2>
                <div className="flex flex-col gap-4">
                  {userProfile?.following?.map((following) => (
                    <Link to={`/profile/${following._id}`} key={following._id} className="flex items-center gap-3 hover:bg-muted px-3 py-2 rounded transition-all">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={following.profilePicture} />
                        <AvatarFallback>{following.username?.slice(0, 2)?.toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{following.username}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 px-4 py-4">
              {displayedPost?.map((post) => (
                <div key={post?._id} className="relative group cursor-pointer">
                  <img
                    src={post.image}
                    alt="postimage"
                    className="rounded-sm w-full aspect-square object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 dark:bg-white/10 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex items-center text-white space-x-4">
                      <button className="flex items-center gap-2 hover:text-gray-300">
                        <Heart />
                        <span>{post?.likes.length}</span>
                      </button>
                      <button className="flex items-center gap-2 hover:text-gray-300">
                        <MessageCircle />
                        <span>{post?.comments.length}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
