import Feed from './Feed.jsx'
import RightSidebar from './RightSidebar.jsx'
import { Outlet, useOutletContext } from 'react-router-dom'
import useGetAllPost from '@/hooks/useGetAllPost'
import useGetSuggestedUsers from '@/hooks/useGetSuggestedUsers'

const Home = () => {
  useGetAllPost()
  useGetSuggestedUsers()

  const { darkMode } = useOutletContext()

  return (
    <div className="flex flex-row min-h-screen w-full">
      <div className="w-20 fixed left-0 top-0 bottom-0" />
      <div className="flex flex-1 ml-20">
        <div className="flex flex-col flex-1 items-center max-w-[680px] w-full py-8 px-4">
          <Feed />
          <Outlet />
        </div>
        <div className="hidden lg:block w-[320px]">
          <RightSidebar darkMode={darkMode} />
        </div>
      </div>
    </div>
  )
}

export default Home
