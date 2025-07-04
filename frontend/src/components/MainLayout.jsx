import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import LeftSidebar from './LeftSidebar.jsx'
import { Switch } from './ui/switch'

const MainLayout = () => {
  const [darkMode, setDarkMode] = useState(false)
  const toggleTheme = () => setDarkMode(!darkMode)

  return (
    <div
      className={`min-h-screen flex flex-col md:flex-row transition-colors duration-300 ${
        darkMode ? 'bg-[#0B0B2A]' : 'bg-[#f0f4ff]'
      }`}
      style={{
        backgroundImage: darkMode
          ? 'linear-gradient(135deg, #0B0B2A 0%, #2C0637 100%)'
          : 'linear-gradient(135deg, #e0e8ff 0%, #f5edff 100%)'
      }}
    >
      {/* 🌈 Dreamy Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[10%] left-[15%] w-64 h-64 rounded-full bg-[#8A2BE2] opacity-10 blur-3xl"></div>
        <div className="absolute bottom-[20%] right-[10%] w-80 h-80 rounded-full bg-[#FF1493] opacity-10 blur-3xl"></div>
        <div className="absolute top-[40%] right-[25%] w-72 h-72 rounded-full bg-[#00FFFF] opacity-10 blur-3xl"></div>
      </div>

      {/* Sidebar - hidden on small screens */}
      <div className="hidden md:flex">
        <LeftSidebar darkMode={darkMode} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative z-10">
        {/* Header */}
        <header
          className={`sticky top-0 z-50 h-16 w-full backdrop-blur-lg px-4 flex items-center justify-between border-b transition-all duration-300 ${
            darkMode
              ? 'bg-[rgba(30,30,60,0.7)] border-[rgba(255,255,255,0.1)]'
              : 'bg-[rgba(255,255,255,0.7)] border-[rgba(0,0,0,0.1)]'
          }`}
        >
          <h1
            className={`text-xl md:text-2xl font-bold tracking-wider ${
              darkMode ? 'text-white' : 'text-[#8A2BE2]'
            }`}
            style={{
              textShadow: darkMode
                ? '0 0 10px rgba(138, 43, 226, 0.7)'
                : 'none'
            }}
          >
            Postify
          </h1>

          <div
            className={`hidden sm:block relative max-w-md w-full mx-4 ${
              darkMode ? 'text-white' : 'text-gray-800'
            }`}
          >
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i className="fas fa-search text-sm"></i>
            </div>
            <input
              type="text"
              placeholder="Search Postify..."
              className={`pl-10 pr-4 py-2 w-full rounded-full text-sm ${
                darkMode
                  ? 'bg-[rgba(255,255,255,0.1)] border-[rgba(255,255,255,0.2)] text-white placeholder-gray-400'
                  : 'bg-[rgba(0,0,0,0.05)] border-[rgba(0,0,0,0.1)] text-gray-800 placeholder-gray-500'
              }`}
            />
          </div>

          <div className="flex items-center space-x-2">
            <i
              className={`fas fa-moon ${
                darkMode ? 'text-white' : 'text-gray-600'
              }`}
            />
            <Switch
              checked={darkMode}
              onCheckedChange={toggleTheme}
              className={`${darkMode ? 'bg-[#8A2BE2]' : 'bg-gray-300'}`}
            />
            <i
              className={`fas fa-sun ${
                darkMode ? 'text-gray-400' : 'text-yellow-500'
              }`}
            />
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 pt-6 md:pt-8 md:ml-20">
          <Outlet context={{ darkMode }} />
        </div>
      </div>

      {/* 📱 Mobile Bottom Navbar */}
      <div className="md:hidden fixed bottom-0 left-0 w-full h-16 z-50 bg-white/30 dark:bg-[#1a1a2e]/50 backdrop-blur-xl border-t border-gray-300 dark:border-gray-700 flex justify-around items-center">
        <button className="text-[#8A2BE2] dark:text-white">
          <i className="fas fa-home text-lg"></i>
        </button>
        <button className="text-[#8A2BE2] dark:text-white">
          <i className="fas fa-search text-lg"></i>
        </button>
        <button className="text-[#8A2BE2] dark:text-white">
          <i className="fas fa-plus-circle text-2xl"></i>
        </button>
        <button className="text-[#8A2BE2] dark:text-white">
          <i className="fas fa-envelope text-lg"></i>
        </button>
        <button className="text-[#8A2BE2] dark:text-white">
          <i className="fas fa-user text-lg"></i>
        </button>
      </div>
    </div>
  )
}

export default MainLayout
