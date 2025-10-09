import React, { useState } from "react";
import "./MatchingQuestions.css";
import axios from "axios";
import { toast } from "react-toastify";
import { Loader } from "rsuite";
import { uploadImage } from "../TrueFalseQuestions/uploadImage";
import { uploadBunny } from "../TrueFalseQuestions/uploadBunny";

const MatchingQs = ({
  unit_id,
  course_id,
  topic_label,
  getQuestions,
  setIsModalOpen,
}) => {
  const [questionData, setQuestionData] = useState({
    course_id,
    unit_id,
    topic_label,
    matching_title: "",
    matching_body: "",
    image_url: "",
    voice_url: "",
  });

  const [videoBunny, setVideoBunny] = useState(null);
  const [videoBunnyFile, setVideoBunnyFile] = useState(null);
  const [uploadVideo, setUploadVideo] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setQuestionData({ ...questionData, [name]: value });
  };

  const handleFileChange = (e) => {
    setQuestionData({ ...questionData, image_url: e.target.files[0] });
  };

  const saveQuestion = async () => {
    let image = null;
    if (questionData?.image_url) {
      image = await uploadImage(questionData?.image_url);
    }

    let bunnyVideo = null;
    if (videoBunnyFile) {
      bunnyVideo = await uploadBunny(
        setUploadVideo,
        setUploadProgress,
        setVideoBunny,
        videoBunnyFile,
        questionData.matching_title,
        setQuestionData,
        questionData
      );
    }

    axios
      .post(
        "https://camp-coding.tech/quest/platform/admin/matching_qs/insert_ques.php",
        JSON.stringify({
          ...questionData,
          image_url: image,
          voice_url: bunnyVideo,
        })
      )
      .then((res) => {
        if (res.status === "success") {
          toast.success("Question has been added successfully");
          setQuestionData({
            course_id,
            unit_id,
            topic_label,
            matching_title: "",
            matching_body: "",
            image_url: "",
            voice_url: "",
          });
          setIsModalOpen(null);
          if (getQuestions) {
            getQuestions();
          }
        } else if (res.status === "error") {
          toast.error("Question has not been added");
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
        <label htmlFor="topic_label">Topic Label</label>
        <input
          className="question-input"
          type="text"
          id="topic_label"
          name="topic_label"
          value={questionData.topic_label}
          onChange={handleInputChange}
        />
      </div>
      <div className="quiz-container columnDiv">
        <label htmlFor="matching_title">Matching Title</label>
        <input
          className="question-input"
          type="text"
          id="matching_title"
          name="matching_title"
          value={questionData.matching_title}
          onChange={handleInputChange}
        />
      </div>
      <div className="quiz-container columnDiv">
        <label htmlFor="matching_body">Matching Body</label>
        <textarea
          className="question-textarea"
          id="matching_body"
          name="matching_body"
          value={questionData.matching_body}
          onChange={handleInputChange}
        />
      </div>
      <div className="quiz-container columnDiv">
        <label htmlFor="image_url">Question Image</label>
        <input
          className="question-input"
          type="file"
          id="image_url"
          name="image_url"
          onChange={handleFileChange}
        />
      </div>
      <div className="quiz-container columnDiv">
        <label htmlFor="voice_url">Voice Note File</label>
        <input
          type="file"
          className="question-input"
          id="voice_url"
          name="voice_url"
          onChange={(e) => setVideoBunnyFile(e.target.files[0])}
        />
      </div>
      {uploadVideo && (
        <div
          className={`loader-container ${uploadProgress < 40 ? "" : "active"}`}
        >
          <div className="loader" style={{ width: `${uploadProgress}%` }}></div>
          <span>{uploadProgress}%</span>
          <Loader />
        </div>
      )}
      <button className="btn btn-success" onClick={saveQuestion}>
        Save
      </button>
    </div>
  );
};

export default MatchingQs;
