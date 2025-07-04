import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ProtectedRoutes from './components/ProtectedRoutes';
import MainLayout from './components/MainLayout';
import Home from './components/Home';
import Profile from './components/Profile';
import ChatPage from './components/ChatPage';
import Login from './components/Login';
import Signup from './components/Signup';
import socketService from './lib/socketService';
import { setSocketId, setConnectionStatus } from './redux/socketSlice';
import { setOnlineUsers, setMessages } from './redux/chatSlice';
import { setLikeNotification, setMessageNotification } from './redux/rtnSlice';
import EditProfile from './components/EditProfile';

const browserRouter = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoutes><MainLayout /></ProtectedRoutes>,
    children: [
      { path: '/', element: <Home /> },
      { path: '/profile/:id', element: <Profile /> },
      {
        path: '/account/edit', element: <ProtectedRoutes><EditProfile /></ProtectedRoutes>
      },
      { path: '/chat', element: <ChatPage /> },
    ],
  },
  { path: '/login', element: <Login /> },
  { path: '/signup', element: <Signup /> },
]);

function App() {
  const { user } = useSelector(store => store.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      const socketio = socketService.connect('http://localhost:8000', {
        query: { userId: user?._id },
        transports: ['websocket'],
      });

      dispatch(setSocketId(socketio.id));
      dispatch(setConnectionStatus(true));

      // Listen for online users
      socketio.on('getOnlineUsers', (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers));
      });

      // Listen for new messages
      socketio.on('newMessage', (newMessage) => {
        dispatch(setMessages((prevMessages) => [...prevMessages, newMessage]));

        // Dispatch the message notification
        dispatch(setMessageNotification({
          type: 'message',
          userId: newMessage.senderId, // Assuming newMessage contains senderId
          content: newMessage.content, // Assuming newMessage contains the message content
          timestamp: new Date(),
        }));
      });

      // Listen for notifications (like/dislike, etc.)
      socketio.on('notification', (notification) => {
        dispatch(setLikeNotification(notification));
      });

      return () => {
        socketService.disconnect();
        dispatch(setConnectionStatus(false));
        dispatch(setSocketId(null));
      };
    }
  }, [user, dispatch]);

  return <RouterProvider router={browserRouter} />;
}

export default App;
