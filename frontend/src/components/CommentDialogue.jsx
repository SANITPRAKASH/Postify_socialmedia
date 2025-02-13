import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'; // Import Avatar components

// Comment component accepts 'comment' as a prop
const Comment = ({ comment }) => {
    return (
        <div className='my-2'>
            {/* Each comment is displayed inside a div with a margin of 2 units on the Y-axis */}
            <div className='flex gap-3 items-center'>
                {/* Avatar for the comment author */}
                <Avatar>
                    <AvatarImage src={comment?.author?.profilePicture} />
                    {/* Fallback text in case the image doesn't load */}
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>

                {/* Comment author name and text */}
                <h1 className='font-bold text-sm'>
                    {/* Author's username */}
                    {comment?.author.username} 
                    <span className='font-normal pl-1'>
                        {/* Comment text */}
                        {comment?.text}
                    </span>
                </h1>
            </div>
        </div>
    );
};

export default Comment;
