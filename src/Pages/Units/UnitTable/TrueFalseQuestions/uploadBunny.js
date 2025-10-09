import axios from "axios";
import { toast } from "react-toastify";

export const uploadBunny = async (
  setUploadVideo,
  setUploadProgress,
  setVideoBunny,
  videoBunnyFile,
  videoTitle,
  setQuestionData,
  questionData
) => {
  let bunny = null;
  const formData = new FormData();
  formData.append("file", videoBunnyFile);
  formData.append("video_title", videoTitle);
  formData.append("video_desc", "True/False Question");

  setUploadVideo(true);
  try {
    const response = await axios.post(
      "https://camp-coding.site/matary_bunny/upload.php",
      formData,
      {
        onUploadProgress: (progressEvent) => {
          const { loaded, total } = progressEvent;
          const progress = Math.round((loaded / total) * 100);
          setUploadProgress(progress);
        },
      }
    );
    if (response?.success) {
      if (setVideoBunny) setVideoBunny(response?.success);
      toast.success("Uploaded Successfully");
      if (setQuestionData)
        setQuestionData((prev) => ({
          ...questionData,
          voice_note: response?.success,
        }));
      bunny = response?.success;
      return response?.success;
    } else {
      toast.error("Failed to upload");
      return null;
    }
  } catch (error) {
    console.error("Error uploading file:", error);
    toast.error("Error when uploading file");
  } finally {
    setUploadVideo(false);
    setUploadProgress(0);
  }
  return bunny;
};
