// const uploadBunny = async () => {
//     const formData = new FormData();
//     formData.append("file", videoBunnyFile);
//     formData.append("video_title", questionData.qs_text);
//     formData.append("video_desc", "True/False Question");

//     setUploadVideo(true);
//     try {
//       const response = await axios.post(
//         "https://camp-coding.site/matary_bunny/upload.php",
//         formData,
//         {
//           onUploadProgress: (progressEvent) => {
//             const { loaded, total } = progressEvent;
//             const progress = Math.round((loaded / total) * 100);
//             setUploadProgress(progress);
//           },
//         }
//       );

//       if (response?.success) {
//         setVideoBunny(response?.success);
//         toast.success("Uploaded Successfully");
//         console.log(response);
//       } else {
//         toast.error("Failed to upload");
//       }
//     } catch (error) {
//       console.error("Error uploading file:", error);
//       toast.error("Error when uploading file");
//     } finally {
//       setUploadVideo(false);
//       setUploadProgress(0);
//     }
//   };