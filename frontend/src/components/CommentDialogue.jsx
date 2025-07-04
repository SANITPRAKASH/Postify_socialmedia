import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import { useDispatch, useSelector } from "react-redux";
import Comment from "./Comment";
import axios from "axios";
import { toast } from "sonner";
import { setPosts } from "@/redux/postSlice";
import PropTypes from "prop-types";

const CommentDialog = ({ open, setOpen }) => {
  const [text, setText] = useState("");
  const { selectedPost, posts } = useSelector((store) => store.post);
  const [comment, setComment] = useState([]);
  const dispatch = useDispatch();
  const darkMode = useSelector((state) => state.theme?.darkMode || false);

  useEffect(() => {
    if (selectedPost) {
      setComment(selectedPost.comments);
    }
  }, [selectedPost]);

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    setText(inputText.trim() ? inputText : "");
  };

  const sendMessageHandler = async () => {
    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/post/${selectedPost?._id}/comment`,
        { text },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        const updatedCommentData = [...comment, res.data.comment]; // ✅ Use it directly
        setComment(updatedCommentData);

        const updatedPostData = posts.map((p) =>
          p._id === selectedPost._id
            ? { ...p, comments: updatedCommentData }
            : p
        );
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
        setText("");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to post comment");
    }
  };

  if (!selectedPost) return null; // If no post is selected, return null to avoid rendering the dialog{
  return (
    <Dialog open={open}>
      <DialogContent
        onInteractOutside={() => setOpen(false)}
        className={`max-w-5xl p-0 flex flex-col overflow-hidden rounded-xl backdrop-blur-md ${
          darkMode
            ? "bg-[rgba(20,20,40,0.4)] border border-[rgba(255,255,255,0.08)]"
            : "bg-[rgba(255,255,255,0.6)] border border-[rgba(0,0,0,0.05)]"
        }`}
        style={{
          boxShadow: darkMode
            ? "0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255,255,255,0.1)"
            : "0 8px 32px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.03)",
        }}
      >
        <div className="flex flex-1 h-[80vh]">
          {/* Left - Image */}
          <div className="w-1/2 bg-black">
            <img
              src={selectedPost?.image}
              alt="post_img"
              className="w-full h-full object-cover rounded-l-xl"
            />
          </div>

          {/* Right - Comments */}
          <div className="w-1/2 flex flex-col justify-between">
            {/* Header */}
            <div className="flex items-center justify-between p-4">
              <div className="flex gap-3 items-center">
                <Link>
                  <Avatar>
                    <AvatarImage src={selectedPost?.author?.profilePicture} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                  <Link
                    to={`/profile/${selectedPost.author?._id}`}
                    className="font-semibold text-xs"
                  >
                    {selectedPost?.author?.username}
                  </Link>
                </div>
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
                    {selectedPost?.caption || "No caption available."}
                  </span>
                </p>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <MoreHorizontal className="cursor-pointer text-muted-foreground" />
                </DialogTrigger>
                <DialogContent className="flex flex-col items-center text-sm text-center">
                  <div className="cursor-pointer w-full text-[#ED4956] font-bold">
                    Unfollow
                  </div>
                  <div className="cursor-pointer w-full">Add to favorites</div>
                </DialogContent>
              </Dialog>
            </div>

            <hr
              className={`${darkMode ? "border-gray-700" : "border-gray-200"}`}
            />

            {/* Comments Scroll */}
            <div className="flex-1 overflow-y-auto max-h-96 p-4 space-y-3">
              {comment.map((c) => (
                <Comment key={c._id} comment={c} />
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-muted">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={text}
                  onChange={changeEventHandler}
                  placeholder="Add a comment..."
                  className={`w-full text-sm p-2 rounded outline-none bg-transparent ${
                    darkMode
                      ? "text-white border border-gray-600 placeholder-gray-400"
                      : "text-black border border-gray-300 placeholder-gray-500"
                  }`}
                />
                <Button
                  disabled={!text.trim()}
                  onClick={sendMessageHandler}
                  variant="outline"
                >
                  Send
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

CommentDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
};

export default CommentDialog;
