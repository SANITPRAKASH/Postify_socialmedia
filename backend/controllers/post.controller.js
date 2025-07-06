import sharp from "sharp";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import { Comment } from "../models/comment.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const addNewPost = async (req, res) => {
    try {
        const { caption } = req.body;
        const image = req.file;
        const authorId = req.id;

        if (!image) return res.status(400).json({ message: 'Image required' });

        // image upload 
        const optimizedImageBuffer = await sharp(image.buffer)
            .resize({ width: 800, height: 800, fit: 'inside' })
            .toFormat('jpeg', { quality: 80 })
            .toBuffer();

        // buffer to data uri
        const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString('base64')}`;
        const cloudResponse = await cloudinary.uploader.upload(fileUri);
        const post = await Post.create({
            caption,
            image: cloudResponse.secure_url,
            author: authorId
        });
        const user = await User.findById(authorId);
        if (user) {
            user.posts.push(post._id);
            await user.save();
        }

        await post.populate({ path: 'author', select: '-password' });

        return res.status(201).json({
            message: 'New post added',
            post,
            success: true,
        });

    } catch (error) {
        console.log(error);
    }
}

export const getAllPost = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 })//sorting the posts by the date of creation
            .populate({ path: 'author', select: 'username , profilePicture' })//populating the author of the post
            .populate({
                path: 'comments',
                sort: { createdAt: -1 },//sorting the comments by the date of creation
                populate: {
                    path: 'author',
                    select: 'username , profilePicture'//selecting the username and profile picture of the author
                }
            });
        return res.status(200).json({
            posts,//sending the posts to the client
            success: true
        });
    } catch (error) {
        console.log(error);
    }
};

export const getUserPost = async (req, res) => {
    try {
        const authorId = req.id;
        const posts = await Post.find({ author: authorId }).sort({ createdAt: -1 }).populate({
            path: 'author',
            select: 'username, profilePicture'
        }).populate({
            path: 'comments',
            sort: { createdAt: -1 },
            populate: {
                path: 'author',
                select: 'username, profilePicture'
            }
        });
        return res.status(200).json({
            posts,
            success: true
        });
    } catch (error) {
        console.log(error);
    }
}

export const likePost = async (req, res) => {
    try {
        const userIdLiking = req.id;
        const postId = req.params.id;
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: 'Post not found', success: false });

        // like logic started
        await post.updateOne({ $addToSet: { likes: userIdLiking } });// addToSet makes sure that the user is not added twice
        await post.save();

        // implement socket io for real time notification
        const user = await User.findById(userIdLiking).select('username, profilePicture');
// remove myself liking the post from the notification
        const postOwnerId = post.author.toString();
        if(postOwnerId !== userIdLiking){
            // emit a notification event
            const notification = {
                type:'like',
                userId:userIdLiking,
                userDetails:user,
                postId,
               
                message:'Your post was liked'
            }
            const postOwnerSocketId = getReceiverSocketId(postOwnerId);
            io.to(postOwnerSocketId).emit('notification', notification);
        }

        return res.status(200).json({message:'Post liked', success:true});
    } catch (error) {
        console.log(error);
    }
}

export const dislikePost = async (req, res) => {
    try {
        const userIdLiking = req.id;
        const postId = req.params.id;
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: 'Post not found', success: false });

        // like logic started
        await post.updateOne({ $pull: { likes: userIdLiking } });
        await post.save();

        // implement socket io for real time notification
        const user = await User.findById(userIdLiking).select('username profilePicture');
        const postOwnerId = post.author.toString();
        if(postOwnerId !== userIdLiking){
            // emit a notification event
            const notification = {
                type:'dislike',
                userId:userIdLiking,
                userDetails:user,
                postId,
                message:'Your post was disliked'
            }
            const postOwnerSocketId = getReceiverSocketId(postOwnerId);
            io.to(postOwnerSocketId).emit('notification', notification);
        }

        return res.status(200).json({message:'Post disliked', success:true});
    } catch (error) {
        console.log(error);
    }
}

export const addComment = async (req, res) => {
    try {
        const postId = req.params.id;
        const userIdCommenting = req.id;
        const { text } = req.body;

        const post = await Post.findById(postId);

        if (!text) return res.status(400).json({ message: 'Text is required', success: false });

        const comment = await Comment.create({
            text,
            author: userIdCommenting,
            post: postId
        });

        await comment.populate({
            path: 'author',
            select: "username, profilePicture"
        });

        post.comments.push(comment._id);
        await post.save();

        return res.status(201).json({
            message: 'Comment Added',
            comment,
            success: true
        });

    } catch (error) {
        console.log(error);
    }
};

export const getCommentsOfPost = async (req, res) => {
    try {
        const postId = req.params.id;

        const comments = await Comment.find({ post: postId }).populate('author', 'username, profilePicture');

        if (!comments) return res.status(404).json({ message: 'No comments found for this post', success: false });

        return res.status(200).json({ success: true, comments });

    } catch (error) {
        console.log(error);
    }
}

export const deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const authorId = req.id;

        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: 'Post not found', success: false });

        // check if the logged-in user is the owner of the post
        if (post.author.toString() !== authorId) return res.status(403).json({ message: 'Unauthorized' });

        // delete post
        await Post.findByIdAndDelete(postId);

        // after deleting the post, remove the post id from the user's post
        let user = await User.findById(authorId);
        user.posts = user.posts.filter(id => id.toString() !== postId);// filter out  and give the posts id not equal to the post id from the deleted post id
        await user.save();

        // delete associated comments
        await Comment.deleteMany({ post: postId });

        return res.status(200).json({
            success: true,
            message: 'Post deleted'
        });

    } catch (error) {
        console.log(error);
    }
}

export const bookmarkPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const authorId = req.id;
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: 'Post not found', success: false });

        const user = await User.findById(authorId);
        if (user.bookmarks.includes(post._id)) {
            // already bookmarked -> remove from the bookmark
            await user.updateOne({ $pull: { bookmarks: post._id } });
            await user.save();
            return res.status(200).json({ type: 'unsaved', message: 'Post removed from bookmark', success: true });

        } else {
            // bookmark post
            await user.updateOne({ $addToSet: { bookmarks: post._id } });
            await user.save();
            return res.status(200).json({ type: 'saved', message: 'Post bookmarked', success: true });
        }

    } catch (error) {
        console.log(error);
    }
}
export const deleteComment = async (req, res) => {
  const { postId, commentId } = req.params;
  const userId = req.id;

  const post = await Post.findById(postId);
  if (!post) {
    return res.status(404).json({ success: false, message: "Post not found" });
  }

  const comment = await Comment.findById(commentId);
  if (!comment) {
    return res.status(404).json({ success: false, message: "Comment not found" });
  }

  if (comment.author.toString() !== userId.toString()) {
    return res.status(403).json({ success: false, message: "Unauthorized" });
  }

  await Comment.findByIdAndDelete(commentId);

  // Pull the comment ref from Post.comments array
  await Post.findByIdAndUpdate(postId, {
    $pull: { comments: commentId }
  });

  return res.status(200).json({ success: true, message: "Comment deleted" });
};
