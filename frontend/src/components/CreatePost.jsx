import { useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader } from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "@/redux/postSlice";
import PropTypes from "prop-types";
import Cropper from "react-easy-crop";
import getCroppedImg from "@/lib/cropImage"; // your crop function

const CreatePost = ({ open, setOpen }) => {
  const imageRef = useRef();
  const [caption, setCaption] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [cropMode, setCropMode] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [loading, setLoading] = useState(false);

  const { user } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.post);
  const dispatch = useDispatch();

  const fileChangeHandler = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);
      setCropMode(true);
    };
    reader.readAsDataURL(file);
  };

  const onCropComplete = (_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const cropImageAndPost = async () => {
    try {
      setLoading(true);
      const croppedFile = await getCroppedImg(imagePreview, croppedAreaPixels);
      const formData = new FormData();
      formData.append("caption", caption);
      formData.append("image", croppedFile);

      const res = await axios.post("https://postify-socialmedia.onrender.com/api/v1/post/addpost", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      if (res.data.success) {
        dispatch(setPosts([res.data.post, ...posts]));
        toast.success(res.data.message);
        setOpen(false);
      }
    } catch {
      toast.error("Image upload failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent onInteractOutside={() => setOpen(false)}>
        <DialogHeader className="text-center font-semibold">Create New Post</DialogHeader>

        <div className="flex gap-3 items-center">
          <Avatar>
            <AvatarImage src={user?.profilePicture} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <h1 className="font-semibold text-xs">{user?.username}</h1>
        </div>

        <Textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="focus-visible:ring-transparent border-none"
          placeholder="Write a caption..."
        />

        {imagePreview && cropMode && (
          <div className="relative w-full h-64 bg-black">
            <Cropper
              image={imagePreview}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
        )}

        <input
          ref={imageRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={fileChangeHandler}
        />

        <Button
          onClick={() => imageRef.current.click()}
          className="w-fit mx-auto bg-gradient-to-r from-purple-600 via-indigo-600 to-violet-700 text-white hover:brightness-110 transition-all duration-300"
        >
          Select from computer
        </Button>

        {imagePreview && (
          <div className="w-full mt-3">
            {loading ? (
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button onClick={cropImageAndPost} className="w-full">
                Post
              </Button>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

CreatePost.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
};

export default CreatePost;
