import { setMessages } from "@/redux/chatSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetRTM = () => {
    const dispatch = useDispatch();
    const { socket } = useSelector(store => store.socketio);

    useEffect(() => {
        const handleNewMessage = (newMessage) => {
            // Use the previous state to ensure correct updates
            dispatch(setMessages(prevMessages => [...prevMessages, newMessage]));
        };

        socket?.on('newMessage', handleNewMessage);

        return () => {
            socket?.off('newMessage', handleNewMessage);
        };
    }, [dispatch, socket]); // Now, only `dispatch` and `socket` are dependencies
};

export default useGetRTM;
