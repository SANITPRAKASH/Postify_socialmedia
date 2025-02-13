import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Link } from 'react-router-dom';
import { MoreHorizontal } from 'lucide-react';
import { Button } from './ui/button';
import { useDispatch, useSelector } from 'react-redux';
import Comment from './Comment.jsx';
import axios from 'axios';
import { toast } from 'sonner';
import { setPosts } from '@/redux/postSlice';

const CommentDialog = ({ open, setOpen }) => {
  const [text, setText] = useState(""); // To store the comment text
  const { selectedPost, posts } = useSelector(store => store.post); // Fetch selected post and all posts from the store
  const [comment, setComment] = useState([]); // To store the current comments for the selected post
  const dispatch = useDispatch();

  // Effect hook to set comments when the selectedPost changes
  useEffect(() => {
    if (selectedPost) {
      setComment(selectedPost.comments); // Update the comment state with the selected post's comments
    }
  }, [selectedPost]);

  // Event handler for input change to set the comment text
  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    setText(inputText.trim() ? inputText : ""); // Set text only if not empty
  };

  // Send the comment when user clicks "Send"
  const sendMessageHandler = async () => {
    try {
      const res = await axios.post(`http://localhost:8000/api/v1/post/${selectedPost?._id}/comment`, { text }, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });

      if (res.data.success) {
        const updatedCommentData = [...comment, res.data.comment]; // Add the new comment
        setComment(updatedCommentData); // Update the local comment state

        const updatedPostData = posts.map(p =>
          p._id === selectedPost._id ? { ...p, comments: updatedCommentData } : p
        ); // Update the post with the new comment
        dispatch(setPosts(updatedPostData)); // Update the Redux store
        toast.success(res.data.message); // Show success message
        setText(""); // Clear the input field
      }
    } catch (error) {
      console.log(error); // Handle any errors
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent onInteractOutside={() => setOpen(false)} className="max-w-5xl p-0 flex flex-col">
        {/* Dialog content for the comment section */}
        <div className='flex flex-1'>
          {/* Left side: Post image */}
          <div className='w-1/2'>
            <img
              src={selectedPost?.image}
              alt="post_img"
              className='w-full h-full object-cover rounded-l-lg'
            />
          </div>

          {/* Right side: Post author, comments and comment input */}
          <div className='w-1/2 flex flex-col justify-between'>
            <div className='flex items-center justify-between p-4'>
              {/* Post author information */}
              <div className='flex gap-3 items-center'>
                <Link>
                  <Avatar>
                    <AvatarImage src={selectedPost?.author?.profilePicture} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                  <Link className='font-semibold text-xs'>{selectedPost?.author?.username}</Link>
                </div>
              </div>

              {/* More options for the post */}
              <Dialog>
                <DialogTrigger asChild>
                  <MoreHorizontal className='cursor-pointer' />
                </DialogTrigger>
                <DialogContent className="flex flex-col items-center text-sm text-center">
                  <div className='cursor-pointer w-full text-[#ED4956] font-bold'>
                    Unfollow
                  </div>
                  <div className='cursor-pointer w-full'>
                    Add to favorites
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <hr />
            <div className='flex-1 overflow-y-auto max-h-96 p-4'>
              {/* Render the list of comments */}
              {comment.map((comment) => <Comment key={comment._id} comment={comment} />)}
            </div>
            <div className='p-4'>
              {/* Input field for adding a comment */}
              <div className='flex items-center gap-2'>
                <input
                  type="text"
                  value={text}
                  onChange={changeEventHandler}
                  placeholder='Add a comment...'
                  className='w-full outline-none border text-sm border-gray-300 p-2 rounded'
                />
                <Button
                  disabled={!text.trim()} // Disable the button if the text is empty
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

export default CommentDialog;
