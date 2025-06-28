import { useEffect, useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import axios from 'axios';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthUser } from '@/redux/authSlice';

const Login = () => {
  const [input, setInput] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useSelector(store => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const signupHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post('http://localhost:8000/api/v1/user/login', input, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });

      if (res.data.success) {
        dispatch(setAuthUser(res.data.user));
        navigate("/");
        toast.success(res.data.message);
        setInput({ email: "", password: "" });
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Login failed!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-cover bg-center bg-no-repeat relative overflow-hidden" 
      style={{ 
        backgroundImage: `url('https://readdy.ai/api/search-image?query=cosmic%20dreamy%20galaxy%20background%20with%20purple%20pink%20and%20blue%20gradient%2C%20high%20resolution%2C%20detailed%20stars%20and%20nebula%2C%20soft%20ethereal%20glow%2C%20mystical%20atmosphere%2C%20digital%20art%2C%208k%20wallpaper%2C%20space%20theme&width=1440&height=1024&seq=bg1&orientation=landscape')`
      }}
    >
      <div className="absolute inset-0 bg-black/30 backdrop-blur-md z-0"></div>

      <form onSubmit={signupHandler} className="z-10 relative shadow-2xl flex flex-col gap-5 p-8 w-full max-w-md rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 text-white">
        <div className="my-4 text-center">
          <h1 className="text-4xl font-bold text-white tracking-tight relative inline-block">
            <span className="relative z-10">Postify</span>
            <span className="absolute inset-0 animate-pulse bg-gradient-to-r from-purple-500 to-blue-500 opacity-50 blur-lg rounded-full"></span>
          </h1>
          <p className="text-blue-100 mt-2 opacity-80">Login to see the galaxy of friends</p>
        </div>

        <div className="relative">
          <label className="text-sm text-white/90 block mb-1">Email</label>
          <Input
            type="email"
            name="email"
            value={input.email}
            onChange={changeEventHandler}
            placeholder="you@example.com"
            className="bg-white/10 border-purple-500/30 text-white placeholder-white/50 h-12 px-4 pl-12 rounded-xl border-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
          />
            <i className="fas fa-envelope absolute left-3 top-12 transform -translate-y-1/2 text-purple-300"></i>
        </div>

        <div className="relative">
          <label className="text-sm text-white/90 block mb-1">Password</label>
          <Input
            type={showPassword ? "text" : "password"}
            name="password"
            value={input.password}
            onChange={changeEventHandler}
            placeholder="••••••••"
            className="bg-white/10 border-purple-500/30 text-white placeholder-white/50 h-12 px-4 pr-10 pl-12 rounded-xl border-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
          />
            <i className="fas fa-lock absolute left-3 top-12 transform -translate-y-1/2 text-purple-300"></i>
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-9 transform -translate-y-1/2 text-purple-300 hover:text-white"
          >
            <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
          </button>
        </div>

        {
          loading ? (
            <Button disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button type="submit" className="w-full h-12 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white font-medium text-lg shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300">
              Login
            </Button>
          )
        }

        <span className="text-center text-white/80">
          Don&apos;t have an account? <Link to="/signup" className="text-blue-300 hover:text-blue-200 transition-colors">Signup</Link>
        </span>
      </form>

      {/* Floating stars */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/30 blur-sm"
            style={{
              width: `${Math.random() * 10 + 2}px`,
              height: `${Math.random() * 10 + 2}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.3,
              animation: `float ${Math.random() * 10 + 10}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes float {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          50% {
            opacity: 0.8;
          }
          100% {
            transform: translateY(-100vh) translateX(${Math.random() * 100 - 50}px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;
