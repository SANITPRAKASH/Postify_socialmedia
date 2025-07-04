import PropTypes from "prop-types";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";

const Comment = ({ comment }) => {
  const { author, text } = comment || {};
  const initials = author?.username?.slice(0, 2)?.toUpperCase() || "NA";

  return (
    <div className="my-3">
      <div className="flex gap-3 items-start">
        <Avatar className="h-8 w-8">
          <AvatarImage
            src={author?.profilePicture || "/default-avatar.png"}
            alt="User Avatar"
          />
          <AvatarFallback>{initials || "U"}</AvatarFallback>
        </Avatar>

        {/* Bubble Wrapper Starts */}
        <div className="bg-[rgba(255,255,255,0.05)] dark:bg-[rgba(255,255,255,0.06)] px-4 py-2 rounded-xl backdrop-blur-sm max-w-xs sm:max-w-sm text-sm leading-snug">
          <Link to={author?._id ? `/profile/${author._id}` : "#"}>
            <span className="font-semibold hover:underline cursor-pointer">
              {author?.username}
            </span>
          </Link>
          <span className="text-muted-foreground pl-1">{text}</span>
        </div>
        {/* Bubble Wrapper Ends */}
      </div>
    </div>
  );
};

Comment.propTypes = {
  comment: PropTypes.shape({
    author: PropTypes.shape({
      username: PropTypes.string,
      profilePicture: PropTypes.string,
    }),
    text: PropTypes.string,
  }).isRequired,
};

export default Comment;
