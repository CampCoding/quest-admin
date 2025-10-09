import axios from "axios";

export const uploadPdf = async (book) => {
  const formData = new FormData();
  formData.append("file_attachment", book);
  const url = await axios.post(
    "https://camp-coding.tech/quest/platform/admin/uploud_pdf.php",
    formData
  );
  console.log(url);
  return url;
};
