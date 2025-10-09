import axios from "axios";

export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);
  const url = await axios.post(
    "https://camp-coding.tech/quest/platform/admin/image_uplouder.php",
    formData
  );
  return url;
};
