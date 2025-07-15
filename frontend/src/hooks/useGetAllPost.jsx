import { setPosts } from "@/redux/postSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetAllPost = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const controller = new AbortController(); // Create an AbortController
        const { signal } = controller; // Get the signal to associate with the request

        const fetchAllPost = async () => {
            try {
                const res = await axios.get('https://postify-socialmedia.onrender.com/api/v1/post/all', {
                    withCredentials: true,
                    signal, // Pass the signal to axios to allow aborting the request
                });

                if (res.data.success) {
                    console.log(res.data.posts);
                    dispatch(setPosts(res.data.posts));
                }
            } catch (error) {
                // Handle the error gracefully
                if (error.name !== 'AbortError') {
                    console.log(error);
                }
            }
        };

        fetchAllPost();

        // Cleanup function to abort the request if the component unmounts
        return () => {
            controller.abort();
        };
    }, [dispatch]); // Re-run the effect if dispatch changes (which doesn't happen in practice)

};

export default useGetAllPost;
