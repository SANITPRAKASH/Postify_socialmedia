import PropTypes from "prop-types";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Trash2 } from "lucide-react";

const Comment = ({ comment,onDelete }) => {
  const { author, text, createdAt, _id } = comment;
  const { user } = useSelector((state) => state.auth);
  const initials = author?.username?.slice(0, 2)?.toUpperCase() || "NA";

  const formattedTime = new Date(createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="my-3">
      <div className="flex gap-3 items-start justify-between">
        <div className="flex gap-3 items-start">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={author?.profilePicture || "/default-avatar.png"}
              alt="User Avatar"
            />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>

          <div className="bg-[rgba(255,255,255,0.05)] dark:bg-[rgba(255,255,255,0.06)] px-4 py-2 rounded-xl backdrop-blur-sm max-w-xs sm:max-w-sm text-sm leading-snug">
            <Link to={author?._id ? `/profile/${author._id}` : "#"}>
              <span className="font-semibold hover:underline cursor-pointer">
                {author?.username}
              </span>
            </Link>
            <span className="text-muted-foreground pl-1">{text}</span>

            <div className="flex justify-between items-center mt-1 text-[0.7rem] text-gray-400">
              <span>{formattedTime}</span>
              {user?._id === author?._id && (
                <Trash2
                  className="w-4 h-4 ml-2 cursor-pointer hover:text-red-500"
                  onClick={() => onDelete(_id)}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Comment.propTypes = {
  comment: PropTypes.shape({
    _id: PropTypes.string,
    author: PropTypes.shape({
      username: PropTypes.string,
      profilePicture: PropTypes.string,
      _id: PropTypes.string,
    }),
    text: PropTypes.string,
    createdAt: PropTypes.string,
  }).isRequired,
  postId: PropTypes.string,
  onDelete: PropTypes.func,
};

export default Comment;
