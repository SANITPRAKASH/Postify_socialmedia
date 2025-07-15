import { useDispatch } from "react-redux";
import { deleteMessageFromStore } from "@/redux/chatSlice";
import { toast } from "sonner"; // optional, but recommended
import axios from "axios";

const useDeleteMessage = () => {
  const dispatch = useDispatch();

  const deleteMessage = async (messageId) => {
    try {
      const res = await axios.delete(`https://postify-socialmedia.onrender.com/api/v1/message/delete/${messageId}`, { withCredentials: true });
      if (res.data?.success) {
        dispatch(deleteMessageFromStore(messageId));
        toast.success("Message deleted successfully ✨");
      } else {
        toast.error(res.data?.message || "Failed to delete message");
      }
    } catch (err) {
      console.error("deleteMessage error babe:", err);
      toast.error("Something went wrong while deleting 💥");
    }
  };

  return deleteMessage;
};

export default useDeleteMessage;
