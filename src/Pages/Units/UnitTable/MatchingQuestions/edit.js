import React, { useState } from "react";
// import "./TrueFalseQuestion.css";
import axios from "axios";
import { toast } from "react-toastify";
import { Loader } from "rsuite";
import { uploadImage } from "../TrueFalseQuestions/uploadImage";

const MatchingQuestionEdit = ({
  unit_id,
  course_id,
  topic_label,
  getQuestions,
  questionRowData,
  setRowData,
}) => {
  const [questionData, setQuestionData] = useState({
    matching_title: "",
    matching_body: "",
    image_url: "",
    voice_url: "",
    unit_id,
    course_id,
    topic_label,
    ...questionRowData,
  });

  const [videoBunny, setVideoBunny] = useState(null);
  const [videoBunnyFile, setVideoBunnyFile] = useState(null);
  const [uploadVideo, setUploadVideo] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleInputChange = (field, value) => {
    setQuestionData({ ...questionData, [field]: value });
  };

  const uploadBunny = async () => {
    const formData = new FormData();
    formData.append("file", videoBunnyFile);
    formData.append("video_title", questionData.matching_title);
    formData.append("video_desc", "Matching Question");

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
        setVideoBunny(response?.success);
        setQuestionData({ ...questionData, voice_url: response?.success });
        toast.success("Uploaded Successfully");
      } else {
        toast.error("Failed to upload");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Error when uploading file");
    } finally {
      setUploadVideo(false);
      setUploadProgress(0);
    }
  };

  const saveQuestion = async () => {
    let image = null;
    if (questionData?.file) {
      image = await uploadImage(questionData?.file);
    }
    delete questionData?.file;
    delete questionData?.matching_qs;
    axios
      .post(
        "https://camp-coding.tech/quest/platform/admin/matching_qs/update_ques_info.php",
        JSON.stringify({
          ...questionData,
          image_url: image ? image : questionData?.image_url,
        })
      )
      .then((res) => {
        console.log(res);
        if (res.status === "success") {
          toast.success("Question has been updated successfully");
          setQuestionData({
            matching_title: "",
            matching_body: "",
            image_url: "",
            voice_url: "",
            unit_id,
            course_id,
            topic_label,
          });
          setRowData(null);
          if (getQuestions) {
            getQuestions();
          }
        } else if (res.status === "error") {
          toast.error("Question has not been updated");
        } else {
          toast.error("Something went wrong");
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="quiz-container">
      <h2 className="quiz-header">Matching Question</h2>
      <div className="quiz-container columnDiv">
        <label htmlFor="matching-title">Matching Title</label>
        <input
          className="question-input"
          type="text"
          id="matching-title"
          name="matching-title"
          value={questionData.matching_title}
          onChange={(e) => handleInputChange("matching_title", e.target.value)}
        />
      </div>
      <div className="quiz-container columnDiv">
        <label htmlFor="matching-body">Matching Body</label>
        <textarea
          className="question-textarea"
          id="matching-body"
          name="matching-body"
          value={questionData.matching_body}
          onChange={(e) => handleInputChange("matching_body", e.target.value)}
          placeholder="Enter the body of the matching question"
        />
      </div>
      <div className="quiz-container columnDiv">
        <label htmlFor="image-url">Image URL</label>
        <input
          className="question-input"
          type="text"
          id="image-url"
          name="image-url"
          value={questionData.image_url}
          onChange={(e) => handleInputChange("image_url", e.target.value)}
        />
      </div>
      <div className="quiz-container columnDiv">
        <label htmlFor="bunny">Upload New Image</label>
        <input
          className="question-input"
          type="file"
          id="bunny"
          name="bunny"
          onChange={(e) => {
            setQuestionData({ ...questionData, file: e.target.files[0] });
          }}
        />
      </div>
      <div className="quiz-container columnDiv">
        <label htmlFor="voice-url">Voice URL</label>
        <input
          className="question-input"
          type="text"
          id="voice-url"
          name="voice-url"
          value={questionData.voice_url}
          onChange={(e) => handleInputChange("voice_url", e.target.value)}
        />
      </div>
      <div className="quiz-container rowDiv upload">
        <div className="columnDiv">
          <label htmlFor="bunny">Upload New Voice Note</label>
          <input
            type="file"
            className="question-input"
            id="bunny"
            name="bunny"
            onChange={(e) => setVideoBunnyFile(e.target.files[0])}
          />
        </div>

        {!uploadVideo ? (
          <div className="btn btn-success" onClick={uploadBunny}>
            Upload
          </div>
        ) : (
          <div
            className={
              uploadProgress < 40
                ? "loader-container"
                : "loader-container active"
            }
          >
            <div
              className="loader"
              style={{ width: `${uploadProgress}%` }}
            ></div>
            <span>{uploadProgress}%</span>
            <Loader />
          </div>
        )}
      </div>
      <audio
        src={questionData?.voice_url || questionRowData?.voice_url}
        controls
        className="audioNote"
      />
      <button className="btn btn-success" onClick={saveQuestion}>
        Save
      </button>
    </div>
  );
};

export default MatchingQuestionEdit;
