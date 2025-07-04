import Post from './Post.jsx'
import { useSelector } from 'react-redux'

const Posts = () => {
  const { posts } = useSelector(store => store.post)//see from store we are getting posts from postSlice.js

  return (
    <div className="w-full flex flex-col gap-8 px-2 sm:px-4 md:px-6 lg:pl-0 lg:pr-20">
      {posts.length > 0 ? (
        posts.map((post) => <Post key={post._id} post={post} />)
      ) : (
        <div className="text-center text-gray-500 mt-10 animate-pulse">
          No posts to show 😥,Create one....!
        </div>
      )}
    </div>
  )
}

export default Posts
