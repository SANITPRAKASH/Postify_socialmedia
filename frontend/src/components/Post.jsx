// Post.jsx
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Bookmark, MessageCircle, MoreHorizontal, Send } from "lucide-react";
import { Button } from "./ui/button";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import CommentDialog from "./CommentDialogue.jsx";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { setPosts, setSelectedPost } from "@/redux/postSlice";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import {Link} from 'react-router-dom'
import PropTypes from "prop-types";

const Post = ({ post }) => {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.post);
  const darkMode = useSelector((state) => state.theme?.darkMode || false);

  const [liked, setLiked] = useState(post.likes.includes(user?._id) || false);
  const [postLike, setPostLike] = useState(post.likes.length);
  const [comment, setComment] = useState(post.comments);
  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    setText(inputText.trim() ? inputText : "");
  };

  const likeOrDislikeHandler = async () => {
    try {
      const action = liked ? "dislike" : "like";
      const res = await axios.get(
        `http://localhost:8000/api/v1/post/${post._id}/${action}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        const updatedLikes = liked ? postLike - 1 : postLike + 1;
        setPostLike(updatedLikes);
        setLiked(!liked);

        const updatedPostData = posts.map((p) =>
          p._id === post._id
            ? {
                ...p,
                likes: liked
                  ? p.likes.filter((id) => id !== user._id)
                  : [...p.likes, user._id],
              }
            : p
        );
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const commentHandler = async () => {
    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/post/${post._id}/comment`,
        { text },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        const updatedCommentData = [...comment, res.data.comment];
        setComment(updatedCommentData);

        const updatedPostData = posts.map((p) =>
          p._id === post._id ? { ...p, comments: updatedCommentData } : p
        );
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
        setText("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deletePostHandler = async () => {
    try {
      const res = await axios.delete(
        `http://localhost:8000/api/v1/post/delete/${post?._id}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        const updatedPostData = posts.filter((p) => p?._id !== post?._id);// filter out the deleted post and only keep the rest
        dispatch(setPosts(updatedPostData));//update the posts in the redux store
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.messsage);
    }
  };

  const bookmarkHandler = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/v1/post/${post?._id}/bookmark`,
        { withCredentials: true }
      );
      if (res.data.success) toast.success(res.data.message);
    } catch (error) {
      console.log(error);
    }
  };

  if (!post) return null; // If no post is provided, return null to avoid rendering the component

  return (
    <Card
      className={`w-full max-w-md mx-auto mb-6 overflow-hidden backdrop-blur-md rounded-xl transition-all duration-300 ${
        darkMode
          ? "bg-[rgba(30,30,60,0.4)] border border-[rgba(255,255,255,0.7)]"
          : "bg-[rgba(255,255,255,0.7)] border border-[rgba(0,0,0,0.05)]"
      }`}
      style={{
        boxShadow: darkMode
          ? "0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1), 0 0 0 2px rgba(138, 43, 226, 0.1)"
          : "0 8px 32px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.05), 0 0 0 2px rgba(138, 43, 226, 0.05)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border-2 border-[#8A2BE2]">
            <AvatarImage src={post.author?.profilePicture} alt="avatar" />
            <AvatarFallback className="bg-gradient-to-r from-[#8A2BE2] to-[#FF1493] text-white">
              {post.author?.username?.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-2">
            
            <Link to={`/profile/${post.author?._id}`}>
              <h1
                className={`font-semibold text-sm ${
                  darkMode ? "text-white" : "text-gray-800"
                } hover:underline cursor-pointer`}
              >
                {post.author?.username}
              </h1>
            </Link>
            {user?._id === post.author._id && (
              <Badge variant="secondary">Author</Badge>
            )}
          </div>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer text-gray-500 hover:text-gray-700" />
          </DialogTrigger>
          <DialogContent className="flex flex-col items-center text-sm text-center">
            {post?.author?._id !== user?._id && (
              <Button variant="ghost" className="text-[#ED4956] font-bold">
                Unfollow
              </Button>
            )}
            <Button variant="ghost">Add to favorites</Button>
            {user && user?._id === post?.author._id && (
              <Button
                onClick={deletePostHandler}
                variant="ghost"
                className="text-red-500"
              >
                Delete
              </Button>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Image */}
      <img
        className="rounded-md my-4 w-full aspect-square object-cover"
        src={post.image}
        alt="post_img"
      />

      {/* Actions */}
      <div className="flex items-center justify-between px-4 mb-2">
        <div className="flex items-center gap-10">
          {liked ? (
            <FaHeart
              onClick={likeOrDislikeHandler}
              size={22}
              className="cursor-pointer text-[#FF1493]"
            />
          ) : (
            <FaRegHeart
              onClick={likeOrDislikeHandler}
              size={22}
              className="cursor-pointer hover:text-gray-600"
            />
          )}
          <MessageCircle
            onClick={() => {
              dispatch(setSelectedPost(post));
              setOpen(true);
            }}
            className="cursor-pointer hover:text-gray-600"
          />
          <Send className="cursor-pointer hover:text-gray-600" />
        </div>
        <Bookmark
          onClick={bookmarkHandler}
          className="cursor-pointer hover:text-gray-600"
        />
      </div>

      {/* Likes & Caption */}
      <div className="px-4">
        <span
          className={`font-medium text-sm ${
            darkMode ? "text-white" : "text-gray-800"
          }`}
        >
          {postLike} likes
        </span>
        <p
          className={`text-sm mt-1 ${
            darkMode ? "text-gray-300" : "text-gray-700"
          }`}
        >
          <span
            className={`font-medium mr-2 ${
              darkMode ? "text-white" : "text-gray-800"
            }`}
          >
            {post.author?.username}
          </span>
          {post.caption}
        </p>

        {comment.length > 0 && (
          <span
            onClick={() => {
              dispatch(setSelectedPost(post));
              setOpen(true);
            }}
            className="cursor-pointer text-sm text-gray-400 hover:underline"
          >
            View all {comment.length} comments
          </span>
        )}

        {/* 💬 Always render the dialog */}
        <CommentDialog open={open} setOpen={setOpen} />
      </div>

      {/* Comment Input */}
      <div className="px-4 pt-3 pb-4 flex items-center justify-between">
        <input
          type="text"
          placeholder="Add a comment..."
          value={text}
          onChange={changeEventHandler}
          className="outline-none text-sm w-full bg-transparent text-purple-600 dark:text-purple-600 placeholder:text-purple-600"
        />
        {text && (
          <span
            onClick={commentHandler}
            className="ml-3 text-[#3BADF8] font-medium cursor-pointer hover:underline"
          >
            Post
          </span>
        )}
      </div>
    </Card>
  );
};

Post.propTypes = {
  post: PropTypes.object.isRequired,
};

export default Post;
