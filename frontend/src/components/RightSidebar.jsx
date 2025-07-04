import PropTypes from 'prop-types'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import SuggestedUsers from './SuggestedUsers.jsx'

const trendingThreads = [
  { id: 1, title: '#CyberDreams', posts: '12.5K' },
  { id: 2, title: '#NeonFuture', posts: '8.7K' },
  { id: 3, title: '#DigitalNomads', posts: '6.3K' },
  { id: 4, title: '#HolographicLife', posts: '5.9K' },
]

const RightSidebar = ({ darkMode }) => {
  const { user } = useSelector(store => store.auth)

  return (
    <aside
      className={`
        w-full h-screen overflow-y-auto flex flex-col gap-10 px-6 py-6
        ${darkMode
          ? 'bg-[rgba(30,30,60,0.4)] text-white'
          : 'bg-[rgba(255,255,255,0.5)] text-gray-900'}
        backdrop-blur-md border-l
        ${darkMode ? 'border-[rgba(255,255,255,0.1)]' : 'border-[rgba(0,0,0,0.05)]'}
      `}
    >
      {/* User Card */}
      <div className="flex items-center gap-4  dark:bg-slate-800 p-4 rounded-lg shadow-md">
        <Link to={`/profile/${user?._id}`}>
          <Avatar className="w-12 h-12 border-2 border-[#8A2BE2]">
            <AvatarImage src={user?.profilePicture} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </Link>
        <div className="flex flex-col">
          <Link
            to={`/profile/${user?._id}`}
            className="font-semibold text-sm hover:underline"
          >
            {user?.username}
          </Link>
          <span className="text-xs opacity-70">
            {user?.bio || 'No bio yet...'}
          </span>
        </div>
      </div>

      {/* Suggested Users */}
      <div>
        <h3 className="text-sm font-semibold mb-3">Suggested Users</h3>
        <SuggestedUsers darkMode={darkMode} />
      </div>

      {/* Trending Threads */}
      <div>
        <h3 className="text-sm font-semibold mb-3">Trending Threads</h3>
        <div className="space-y-3">
          {trendingThreads.map((thread) => (
            <div
              key={thread.id}
              className={`
                p-3 rounded-lg cursor-pointer transition-all
                ${darkMode
                  ? 'hover:bg-[rgba(255,255,255,0.1)]'
                  : 'hover:bg-[rgba(0,0,0,0.05)]'}
              `}
            >
              <p className="text-sm font-medium text-purple-600">{thread.title}</p>
              <p className="text-xs opacity-60 ">{thread.posts} posts</p>
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}

RightSidebar.propTypes = {
  darkMode: PropTypes.bool.isRequired,
}

export default RightSidebar
