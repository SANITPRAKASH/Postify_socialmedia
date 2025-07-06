import { setMessages } from "@/redux/chatSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetRTM = () => {
  const dispatch = useDispatch();
  const { socket } = useSelector((store) => store.socketio);
  const { messages } = useSelector((store) => store.chat);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage) => {
      const updatedMessages = [...messages, newMessage];
      dispatch(setMessages(updatedMessages));
    };

    socket.on("newMessage", handleNewMessage);

    // 🧼 Cleanup safely
    return () => {
      if (socket) {
        socket.off("newMessage", handleNewMessage);
      }
    };
  }, [socket, messages, dispatch]);
};

export default useGetRTM;
