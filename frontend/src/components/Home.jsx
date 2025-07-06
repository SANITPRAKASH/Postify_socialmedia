import Feed from "./Feed.jsx";
import RightSidebar from "./RightSidebar.jsx";
import { Outlet, useOutletContext } from "react-router-dom";
import useGetAllPost from "@/hooks/useGetAllPost";
import useGetSuggestedUsers from "@/hooks/useGetSuggestedUsers";

const Home = () => {
  useGetAllPost();
  useGetSuggestedUsers();

  const { darkMode } = useOutletContext();

  return (
    <div className="flex flex-row min-h-screen w-full">
      {/* Left sidebar spacer */}
      <div className="w-20 fixed left-0 top-0 bottom-0" />

      {/* Main content area */}
      <div className="flex flex-1  lg:mr-80">
        {" "}
        {/* Responsive right margin */}
        <div className="flex flex-col flex-1 items-center max-w-[680px] w-full  px-4 mx-auto">
          <Feed />
          <Outlet />
        </div>
      </div>

      {/* Right sidebar - fixed to right edge, hidden on mobile */}
      <div className="hidden lg:block w-96 fixed right-0 top-0 bottom-0 pt-16">
        <RightSidebar darkMode={darkMode} />
      </div>
    </div>
  );
};

export default Home;
