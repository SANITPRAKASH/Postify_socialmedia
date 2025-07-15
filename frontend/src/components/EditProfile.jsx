import { useRef, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AvatarFallback, AvatarImage, Avatar } from './ui/avatar'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from './ui/select'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { logoutUser, setAuthUser } from '@/redux/authSlice'
import Cropper from 'react-easy-crop'
import getCroppedImg from '@/lib/cropImage'

const EditProfile = () => {
  const imageRef = useRef()
  const { user } = useSelector((store) => store.auth)
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [input, setInput] = useState({
    profilePhoto: user?.profilePicture,
    username: user?.username,
    bio: user?.bio,
    gender: user?.gender
  })

  const [selectedImage, setSelectedImage] = useState(null)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [preview, setPreview] = useState(null)

  const fileChangeHandler = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setSelectedImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels)
  }, [])

  const validateForm = () => {
    if (!input.bio.trim()) {
      toast.error('Bio cannot be empty.')
      return false
    }
    if (!input.username.trim()) {
      toast.error('Username cannot be empty.')
      return false
    }
    return true
  }

  const editProfileHandler = async () => {
    if (!validateForm()) return

    let finalImage = input.profilePhoto

    try {
      if (selectedImage && croppedAreaPixels) {
        finalImage = await getCroppedImg(selectedImage, croppedAreaPixels)
      }

      const formData = new FormData()
      formData.append('bio', input.bio)
      formData.append('gender', input.gender)
      formData.append('username', input.username)
      if (finalImage instanceof File || finalImage instanceof Blob) {
        formData.append('profilePhoto', finalImage)
      }

      setLoading(true)
      const res = await axios.post('https://postify-socialmedia.onrender.com/api/v1/user/profile/edit', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      })

      if (res.data.success) {
        dispatch(
          setAuthUser({
            ...user,
            username: res.data.user.username,
            bio: res.data.user.bio,
            profilePicture: res.data.user.profilePicture,
            gender: res.data.user.gender
          })
        )
        toast.success(res.data.message)
        navigate(`/profile/${user._id}`)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }
   const deleteUserHandler = async () => {
    const confirmed = window.confirm("Are you 100% sure you wanna delete your account forever? 😢")
    if (!confirmed) return

    try {
      setLoading(true)
      const res = await axios.delete("https://postify-socialmedia.onrender.com/api/v1/user/delete", {
        withCredentials: true
      })

      if (res.data.success) {
        dispatch(logoutUser())
        toast.success("Account deleted successfully 💀")
        navigate("/register")
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || "Error deleting account.")
    } finally {
      setLoading(false)
    }
  }
  

  return (
    <div className='flex max-w-2xl mx-auto pl-10'>
      <section className='flex flex-col gap-6 w-full my-8'>
        <h1 className='font-bold text-xl'>Edit Profile</h1>

        {/* Profile Image + Preview */}
        <div className='flex items-center justify-between bg-gray-100 rounded-xl p-4'>
          <div className='flex items-center gap-3'>
            <Avatar>
              <AvatarImage src={preview || user?.profilePicture} alt='preview' />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div>
              <h1 className='font-bold text-sm'>{user?.username}</h1>
              <span className='text-gray-600'>{user?.bio || 'Bio here...'}</span>
            </div>
          </div>
          <input
            ref={imageRef}
            onChange={fileChangeHandler}
            type='file'
            accept='image/*'
            className='hidden'
          />
          <Button
            onClick={() => imageRef?.current.click()}
            className='bg-[#0095F6] h-8 hover:bg-[#318bc7]'
          >
            Change photo
          </Button>
        </div>

        {/* Cropper */}
        {selectedImage && (
          <div className='relative w-full h-[300px] bg-black'>
            <Cropper
              image={selectedImage}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
            <Button
              onClick={async () => {
                const croppedBlob = await getCroppedImg(selectedImage, croppedAreaPixels)
                const previewURL = URL.createObjectURL(croppedBlob)
                setInput({ ...input, profilePhoto: croppedBlob })
                setPreview(previewURL)
                setSelectedImage(null)
              }}
              className='absolute bottom-2 right-2 z-10 bg-[#0095F6]'
            >
              Crop & Save
            </Button>
          </div>
        )}

        {/* Username */}
        <div>
          <h1 className='font-bold text-xl mb-2'>Username</h1>
          <input
            value={input.username}
            onChange={(e) => setInput({ ...input, username: e.target.value })}
            className='w-full border px-3 py-2 rounded-md focus:outline-none'
            placeholder='Enter new username'
          />
        </div>

        {/* Bio */}
        <div>
          <h1 className='font-bold text-xl mb-2'>Bio</h1>
          <Textarea
            value={input.bio}
            onChange={(e) => setInput({ ...input, bio: e.target.value })}
            name='bio'
            className='focus-visible:ring-transparent'
          />
        </div>

        {/* Gender */}
        <div>
          <h1 className='font-bold mb-2'>Gender</h1>
          <Select defaultValue={input.gender} onValueChange={(val) => setInput({ ...input, gender: val })}>
            <SelectTrigger className='w-full'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value='male'>Male</SelectItem>
                <SelectItem value='female'>Female</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

       {/* Submit + Delete */}
        <div className='flex justify-between items-center'>
          {loading ? (
            <Button className='w-fit bg-[#0095F6] hover:bg-[#2a8ccd]'>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              Please wait
            </Button>
          ) : (
            <Button onClick={editProfileHandler} className='w-fit bg-[#0095F6] hover:bg-[#2a8ccd]'>
              Submit
            </Button>
          )}

          <Button
            onClick={deleteUserHandler}
            className='bg-red-500 hover:bg-red-600 ml-4'
          >
            Delete Account
          </Button>
        </div>
      </section>
    </div>
  )
}

export default EditProfile
