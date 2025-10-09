import React, { useState } from "react";
import "./TrueFalseQuestion.css";
import axios from "axios";
import { toast } from "react-toastify";
import { Loader } from "rsuite";
import { uploadImage } from "./uploadImage";
import { uploadBunny } from "./uploadBunny";

const TrueFalseQuestion = ({
  unit_id,
  course_id,
  topic_label,
  getQuestions,
  setIsModalOpen,
}) => {
  const [questionData, setQuestionData] = useState({
    qs_text: "",
    qs_answer: "true",
    explanation: "",
    unit_id,
    course_id,
    topic_label,
  });

  const [videoBunny, setVideoBunny] = useState(null);
  const [videoBunnyFile, setVideoBunnyFile] = useState(null);
  const [uploadVideo, setUploadVideo] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleQuestionChange = (value) => {
    setQuestionData({ ...questionData, question: value, qs_text: value });
  };

  const handleAnswerChange = (value) => {
    setQuestionData({ ...questionData, qs_answer: value, explanation: "" });
  };

  const handleExplanationChange = (value) => {
    setQuestionData({ ...questionData, explanation: value });
  };

  const saveQuestion = async () => {
    let image = null;
    if (questionData?.file) {
      image = await uploadImage(questionData?.file);
    }
    let bunnyVideo = null;
    if (videoBunnyFile) {
      bunnyVideo = await uploadBunny(
        setUploadVideo,
        setUploadProgress,
        setVideoBunny,
        videoBunnyFile,
        questionData.qs_text,
        setQuestionData,
        questionData
      );
    }
    delete questionData?.file;
    axios
      .post(
        "https://camp-coding.tech/quest/platform/admin/true_false_ques/insert_ques.php",
        JSON.stringify({
          ...questionData,
          qs_image_url: image,
          voice_note: bunnyVideo,
        })
      )
      .then((res) => {
        if (res.status == "success") {
          toast.success("Question has added successfully");
          setQuestionData({
            question: "",
            answer: "true",
            explanation: "",
            unit_id,
            course_id,
            topic_label,
          });
          setIsModalOpen(null);
          setQuestionData({});
          if (getQuestions) {
            getQuestions();
          }
        } else if (res.status == "error") {
          toast.error("Question has not added");
        } else {
          toast.error("Something Went Error");
        }
      })
      .catch((err) => console.log(err));
  };
  return (
    <div className="quiz-container">
      <h2 className="quiz-header">True/False Question</h2>
      <div className="quiz-container columnDiv">
        <label htmlFor="bunny">Topic Label</label>
        <input
          className="question-input"
          type="text"
          id="bunny"
          name="bunny"
          value={questionData?.topic_label}
          onChange={(e) => {
            setQuestionData({ ...questionData, topic_label: e.target.value });
          }}
        />
      </div>
      <div className="quiz-container columnDiv">
        <label htmlFor="bunny">Question Image</label>
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
      <div className="question-card">
        <div
          className="questionBank"
          style={{ display: "flex", alignItems: "center", gap: "10px" }}
        >
          <textarea
            value={questionData.qs_text}
            onChange={(e) => handleQuestionChange(e.target.value)}
            placeholder="Enter your question"
            className="question-textarea"
          />
          <select
            value={questionData.qs_answer}
            onChange={(e) => handleAnswerChange(e.target.value)}
            className="answer-select"
          >
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
        </div>
        {/* {questionData.answer === "false" && (
          <textarea
            value={questionData.explanation}
            onChange={(e) => handleExplanationChange(e.target.value)}
            placeholder="Enter explanation for false answer"
            className="explanation-textarea"
          />
        )} */}
      </div>
      <div className="quiz-container columnDiv">
        <label htmlFor="bunny">Hint</label>
        <input
          className="question-input"
          type="text"
          id="bunny"
          name="bunny"
          value={questionData?.hint}
          onChange={(e) => {
            setQuestionData({ ...questionData, hint: e.target.value });
          }}
        />
      </div>
      <div className="quiz-container columnDiv">
        <label htmlFor="bunny">Key Words</label>
        <input
          className="question-input"
          type="text"
          id="bunny"
          name="bunny"
          value={questionData?.question_key_words}
          onChange={(e) =>
            setQuestionData({
              ...questionData,
              question_key_words: e.target.value,
            })
          }
        />
      </div>
      <div className="question-card">
        <div
          className="questionBank"
          style={{ display: "flex", alignItems: "center", gap: "10px" }}
        >
          <label htmlFor="">OverAll</label>
          <textarea
            value={questionData.overall}
            onChange={(e) =>
              setQuestionData({ ...questionData, overall: e.target.value })
            }
            placeholder="Enter your question"
            className="question-textarea"
          />
        </div>
      </div>
      <div className="quiz-container rowDiv upload">
        <div className="columnDiv">
          <label htmlFor="bunny">Voice Note File</label>
          <input
            type="file"
            className="question-input"
            id="bunny"
            name="bunny"
            onChange={(e) => setVideoBunnyFile(e.target.files[0])}
          />
        </div>

        {!uploadVideo ? null : (
          // <div className="btn btn-success" onClick={uploadBunny}>
          //   Upload
          // </div>
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
      <div className="quiz-container columnDiv">
        <label htmlFor="bunny">Voice Note Id</label>
        <input
          className="question-input"
          type="text"
          id="bunny"
          name="bunny"
          value={videoBunny}
          onChange={(e) => setVideoBunny(e.target.value)}
        />
      </div>
      <button className="btn btn-success" onClick={() => saveQuestion()}>
        Save
      </button>
    </div>
  );
};

export default TrueFalseQuestion;
