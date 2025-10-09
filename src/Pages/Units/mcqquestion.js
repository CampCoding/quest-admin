import React, { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Row,
  Col,
  Container,
  Modal,
  ModalHeader,
  ModalBody,
  Card,
  CardBody,
  Input,
  CloseButton,
} from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { AiOutlinePlusCircle } from "react-icons/ai";
import axios from "axios";
import { toast } from "react-toastify";
import { Loader, SelectPicker } from "rsuite";
import McqQuestionList from "./UnitTable/McqQuestionList";
import { userData } from "../../store/getProfileData";
import { MenuItem, Select } from "@mui/material";

const TopicsMCQQuestions = ({ CourseId }) => {
  const location = useLocation();
  const allunitdata = location?.state?.unitData;
  const topicData = location?.state?.topicData;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mcqquestions, setmcqquestions] = useState([]);
  const [getLoading, setGetLoading] = useState(false);
  const [uploadloading, setuploadloading] = useState(false);

  const [addQuestionData, setAddQuestionData] = useState({
    question_text: "",
    help_video: "",
    valid_answer: "",
    question_image_url: "",
    help_pdf: "",
    pdf_page: "",
    video_time: "",
    help_text: "",
    overall_image: [],
    overall: "",
    question_key_words: "",
    topic_label: "",
  });

  const [answers, setAnswers] = useState([{ text: "" }]);
  const [img, setImg] = useState(null);
  const [overallImg, setOverallImg] = useState(null);
  const [ebooks, setEbooks] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [videoType, setVideoType] = useState("");
  const [MCQ_Show, setMCQShow] = useState(false);
  // Get MCQs
  const getmcqQuestions = () => {
    setGetLoading(true);
    axios
      .post(
        "https://camp-coding.tech/quest/platform/admin/mcq/new_mcq/select_unit_mcqs.php",
        JSON.stringify({ unit_id: allunitdata?.unit_id })
      )
      .then((res) => setmcqquestions(res.message))
      .finally(() => setGetLoading(false));
  };

  const [Folders, SetFolders] = useState([]);
  const getFolders = () => {
    axios
      .get(
        "https://camp-coding.tech/quest/platform/admin/images_data/select_folders_data.php"
      )
      .then((res) => {
        if (Array.isArray(res)) {
          SetFolders(res?.filter((item, index) => index > 1));
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (MCQ_Show) getFolders();
  }, [MCQ_Show]);

  // Get videos & ebooks
  const getEbooks = async () => {
    try {
      const res = await axios.get(
        "https://camp-coding.tech/quest/platform/admin/books_store/select_books.php"
      );
      setEbooks(Array.isArray(res?.message) ? res.message : []);
    } catch {
      setEbooks([]);
    }
  };

  useEffect(() => {
    getmcqQuestions();
  }, []);

  useEffect(() => {
    if (isModalOpen) getEbooks();
  }, [isModalOpen]);

  // Handlers
  const handleAnswerChange = (i, value) => {
    const newAns = [...answers];
    newAns[i].text = value;
    setAnswers(newAns);
  };

  const handleExplanationChange = (i, value) => {
    const newAns = [...answers];
    newAns[i].explanation = value;
    setAnswers(newAns);
  };

  const handleValidAnswerSelect = (i) =>
    setAddQuestionData({ ...addQuestionData, valid_answer: i });

  const handleAddAnswer = () =>
    setAnswers([...answers, { text: "", explanation: "" }]);

  const handleRemoveAnswer = (i) =>
    setAnswers(answers.filter((_, idx) => idx !== i));
  const [uploadLoading, setUploadLoading] = useState(false);

  const uploadExcel = async (e, type) => {
    setUploadLoading(true);
    const formData = new FormData(e?.target);
    const form = e.target;

    formData.append("file_attachment", e.target.file_attachment.files[0]);
    formData.append("unit_id",allunitdata?.unit_id);
    // formData.append("course_id", unitData?.course_id);
    // formData.append("unit_id", unitData?.unit_id);
    const excelUploading = await axios.post(
      type == "questions"
        ? "https://camp-coding.tech/quest/platform/admin/mcq/upload_questions_new.php"
        : type == "tweets"
        ? "https://camp-coding.tech/quest/platform/admin/tweets/upload_excel_tweets_dashboard.php"
        : type == "flash_cards"
        ? "https://camp-coding.tech/quest/platform/admin/flash_cards/upload_excel_file_flash_dashboard.php"
        : type == "WQ"
        ? ""
        : "",
      formData
    );

    if (excelUploading) {
      await getmcqQuestions();
      toast.success(
        "Uploaded Successfully - Number Of Pages: " + excelUploading
      );
      setMCQShow(false);

      form.reset();
    } else {
      toast.error(excelUploading.message);
    }
    setUploadLoading(false);
  };
  // Upload images
  const handleuploadimg = async () => {
    if (!img) return;
    setuploadloading(true);
    const formdata = new FormData();
    formdata.append("image", img);
    try {
      const res = await axios.post(
        "https://camp-coding.tech/quest/platform/admin/image_uplouder.php",
        formdata
      );
      setAddQuestionData({ ...addQuestionData, question_image_url: res });
    } finally {
      setuploadloading(false);
    }
  };

  const handleuploadOverallimg = async () => {
    if (!overallImg?.length) return;
    setuploadloading(true);
    const overAllImages = [];
    await Promise.all(
      Object.values(overallImg).map(async (file) => {
        const formdata = new FormData();
        formdata.append("image", file);
        const res = await axios.post(
          "https://camp-coding.tech/quest/platform/admin/image_uplouder.php",
          formdata
        );
        overAllImages.push(res);
      })
    );
    setAddQuestionData({ ...addQuestionData, overall_image: overAllImages });
    setuploadloading(false);
  };

  // Submit Question
  const handleAddQuestion = (e) => {
    e.preventDefault();

    const answersStr = answers
      .map((a) => `${a.text}**${a.explanation}`)
      .join("**matary**");

    const valid_answer =
      addQuestionData.valid_answer !== "" &&
      answers[addQuestionData.valid_answer]
        ? answers[addQuestionData.valid_answer].text
        : "";

    const data_send = {
      unit_id: allunitdata.unit_id,
      question_text: addQuestionData.question_text,
      answers: answersStr,
      valid_answer,
      exam_id: "0",
      course_id: allunitdata.course_id,
      topic_id: topicData?.topic_id,
      question_image_url: addQuestionData.question_image_url,
      help_text: addQuestionData.help_text,
      help_pdf: searchValue,
      help_video: addQuestionData.help_video,
      help_pdf_page: addQuestionData.pdf_page,
      video_time: addQuestionData.video_time,
      key_words: addQuestionData.question_key_words,
      topic_label: addQuestionData.topic_label,
      overall_image: addQuestionData.overall_image.join("**matary**"),
      overall: addQuestionData.overall,
    };

    axios
      .post(
        "https://camp-coding.tech/quest/platform/admin/mcq/new_mcq/insert_mcq.php",
        JSON.stringify(data_send)
      )
      .then((res) => {
        if (res.status === "success") {
          toast.success("Question added successfully");
          getmcqQuestions();
          setIsModalOpen(false);
          setAddQuestionData({
            question_text: "",
            help_video: "",
            valid_answer: "",
            question_image_url: "",
            help_pdf: "",
            pdf_page: "",
            video_time: "",
            help_text: "",
            overall_image: [],
            overall: "",
          });
          setAnswers([{ text: "" }]);
        } else {
          toast.error("Failed to add question");
        }
      });
  };

  const permissions = userData?.permissions;

  return (
    <React.Fragment>
      <Container fluid={true}>
        <Breadcrumbs
          title="MCQ Questions"
          breadcrumbItem="MCQ Questions List"
        />
        <Row>
          <Col lg={12}>
            <Card>
              <CardBody>
                {permissions?.includes("*6_1") ||
                permissions?.startsWith("6_1") ||
                permissions === "all" ? (
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button
                      type="button"
                      className="btn btn-success mb-4"
                      onClick={() => setIsModalOpen(true)}
                    >
                      <i className="mdi mdi-plus me-1"></i> Add MCQQuestion
                    </button>
                    <button
                      type="button"
                      className="btn btn-success mb-4"
                      onClick={() => setMCQShow(true)}
                    >
                      <i className="mdi mdi-plus me-1"></i> upload MCQQuestion
                      excel
                    </button>
                    <a
                      type="button"
                      className="btn btn-success mb-4"
                      download={"MCQQuestion_excel_template.xlsx"}
                      href="http://camp-coding.site/qs-quest-temp.xlsx"
                    >
                      <i className="mdi mdi-plus me-1"></i> download MCQQuestion
                      excel template
                    </a>
                  </div>
                ) : null}
                {!getLoading ? (
                  <McqQuestionList
                    getmcqQuestions={getmcqQuestions}
                    Units={mcqquestions}
                  />
                ) : (
                  <Loader />
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Modal */}
      <Modal isOpen={isModalOpen} size="lg">
        <ModalHeader toggle={() => setIsModalOpen(false)}>
          Add New MCQ Question
        </ModalHeader>
        <ModalBody>
          <form onSubmit={handleAddQuestion}>
            {/* Question */}
            <div className="mb-3">
              <label>Question Text</label>
              <Input
                type="text"
                value={addQuestionData.question_text}
                onChange={(e) =>
                  setAddQuestionData({
                    ...addQuestionData,
                    question_text: e.target.value,
                  })
                }
              />
            </div>

            {/* Answers */}
            <div className="mb-3">
              <label>Answers</label>
              {answers.map((a, i) => (
                <div
                  key={i}
                  style={{ display: "flex", gap: "8px", margin: "10px 0" }}
                >
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                    }}
                  >
                    <Input
                      type="text"
                      placeholder={`Answer ${i + 1}`}
                      value={a.text}
                      onChange={(e) => handleAnswerChange(i, e.target.value)}
                    />
                    <Input
                      type="text"
                      placeholder={`answer explanation ${i + 1}`}
                      value={a.answer_explanation}
                      onChange={(e) =>
                        handleExplanationChange(i, e.target.value)
                      }
                    />
                  </div>

                  <input
                    type="radio"
                    name="valid_answer"
                    checked={addQuestionData.valid_answer === i}
                    onChange={() => handleValidAnswerSelect(i)}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveAnswer(i)}
                    style={{ color: "red" }}
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="btn btn-primary mt-2"
                onClick={handleAddAnswer}
              >
                + Add Answer
              </button>
            </div>

            {/* Overall */}
            <div className="mb-3">
              <label>Question Overall</label>
              <Input
                type="text"
                value={addQuestionData.overall}
                onChange={(e) =>
                  setAddQuestionData({
                    ...addQuestionData,
                    overall: e.target.value,
                  })
                }
              />
            </div>

            {/* Upload Images */}
            <div className="mb-3">
              <label>Question Image</label>
              <Input type="file" onChange={(e) => setImg(e.target.files[0])} />
              <img
                onClick={handleuploadimg}
                className="up_img"
                src={require("../../assets/images/upload.png")}
                alt=""
              />
            </div>

            <div className="mb-3">
              <label>Overall Images</label>
              <Input
                type="file"
                multiple
                onChange={(e) => setOverallImg(e.target.files)}
              />
              <img
                onClick={handleuploadOverallimg}
                className="up_img"
                src={require("../../assets/images/upload.png")}
                alt=""
              />
            </div>

            {/* PDF Select */}
            <div className="mb-3">
              <label>Choose PDF</label>
              <div>
                <input
                  type="radio"
                  name="pdf"
                  value="vlist"
                  onChange={() => setVideoType("vlist")}
                />{" "}
                From List
                <input
                  type="radio"
                  name="pdf"
                  value="vsid"
                  onChange={() => setVideoType("vsid")}
                />{" "}
                By Code
              </div>
              {videoType === "vsid" && (
                <Input
                  type="text"
                  placeholder="Book Code"
                  onChange={(e) => setSearchValue(e.target.value)}
                />
              )}
              {videoType === "vlist" && ebooks.length > 0 && (
                <SelectPicker
                  label="Select Book"
                  data={ebooks.map((b) => ({
                    label: b.book_title,
                    value: b.book_code,
                  }))}
                  onChange={setSearchValue}
                  style={{ width: 224 }}
                />
              )}
            </div>

            <button className="btn btn-success" type="submit">
              Save Question
            </button>
          </form>
        </ModalBody>
      </Modal>
      <Modal title="Upload Excel File" isOpen={MCQ_Show}>
        <form
          action="#"
          style={{
            padding: "15px",
            display: "flex",
            flexDirection: "column",
          }}
          onSubmit={(e) => {
            e.preventDefault();
            return !uploadLoading ? uploadExcel(e, "questions") : null;
          }}
        >
          <CloseButton
            onClick={() => {
              setUploadLoading(false);
              setMCQShow(false);
            }}
            style={{ marginLeft: "auto" }}
          />
          <label style={{ fontSize: "22px" }} htmlFor="">
            Folders
          </label>
          <Select
            style={{
              width: "100%",
              borderRadius: "4px",
              margin: "10px 0",
            }}
            type="text"
            name="folder_name"
            id="folder_name"
          >
            {Folders.map((item, index) => {
              return (
                <MenuItem value={item} key={index}>
                  {item}
                </MenuItem>
              );
            })}
          </Select>
          <div className="input_Field">
            <label forHtml="course_id">Excel File</label>
            <div className="input_Field">
              <input type="file" name="file_attachment" />
            </div>
          </div>
          <button
            className="btn btn-success"
            style={{ margin: "10px 0 0 auto" }}
          >
            {" "}
            {uploadLoading ? <Loader /> : "Upload Excel File"}{" "}
          </button>
        </form>
      </Modal>
    </React.Fragment>
  );
};

export default TopicsMCQQuestions;
