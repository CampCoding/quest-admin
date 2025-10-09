import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Card,
  CardBody,
  CloseButton,
  Col,
  Container,
  Form,
  Input,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
} from "reactstrap";

import axios from "axios";
import "flatpickr/dist/themes/material_blue.css";
import { useCallback, useEffect } from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { toast } from "react-toastify";
import Breadcrumbs from "../../components/Common/Breadcrumb";
// import './mcqquestion.css';
import { MenuItem, Select } from "@mui/material";

import { Loader, SelectPicker } from "rsuite";
import { userData } from "../../store/getProfileData";
import McqQuestionList from "./McqQuestionList";
const CasesMCQQuestions = ({ CourseId, allunitdata }) => {
  const location = useLocation();
  allunitdata = location?.state?.unitData;

  const topicData = location?.state?.topicData;
  const [type, setType] = useState(false);
  const [videoLink, setVideoLink] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [img, setimg] = useState("");
  const [answersArray, setanswersArray] = useState([]);
  const [videos, setvideos] = useState([]);
  const [answerlist, setanswerlist] = useState([
    { id: 0, answer: "", checked: false },
  ]);
  const [numberOfPages, setNumberOfPages] = useState(false);
  const [loading, setLoading] = useState(false);
  const [book_url, setBookUrl] = useState(false);
  const [mcqquestions, setmcqquestions] = useState([]);
  const [addquestiondata, setaddquestiondata] = useState({
    question_text: "",
    help_video: "",
    valid_answer: "",
    question_image_url: "",
    help_pdf: "",
    unit_id: "0",
    pdf_page: "",
    video_time: "",
    help_text: "",
    overall_image: [],
  });
  const [getLoading, setGetLoading] = useState(false);
  const [showImportModal, setshowImportModal] = useState(false);
  const [Courses, setCourses] = useState([]);
  const [selectedCourse, setSelectCourse] = useState("");
  const [selectedUnits, setSelectedUnits] = useState([]);
  const [autoUnits, setAutoUnits] = useState([]);
  const [autoCourses, setAutoCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [autoTopics, setAutoTopics] = useState([]);
  const [units, setunits] = useState([]);
  const [selecteduni, setselecteduni] = useState("");
  const [unitquestions, setunitquestions] = useState([]);
  const [selectedquestion, setselectedquestion] = useState("");
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [universities, setUniversities] = useState([]);
  const [selecteduniversity, setSelecteduniversity] = useState("");
  const [grades, setGrades] = useState([]);
  const [selecedGrade, setSelectedGrade] = useState("");
  const [loader, setLoader] = useState(false);
  const getmcqQuestions = () => {
    setGetLoading(true);
    const data_send = {
      case_task_id: location?.state?.caseData?.case_task_id,
    };

    axios
      .post(
        "https://camp-coding.tech/quest/platform/admin/cases_tasks/select_case_mcqs_list.php",
        JSON.stringify(data_send)
      )
      .then((res) => {
        // localStorage.setItem("qs", JSON.stringify(res.message));
        setmcqquestions(res.message);
      })
      .finally(() => {
        setGetLoading(false);
      });
  };

  const handleAssignTopicMsqs = async () => {
    setLoader(true);
    await axios
      .post(
        "https://camp-coding.tech/quest/platform/admin/cases_tasks/assign_topic_of_qs.php",
        {
          case_task_id: location?.state?.caseData?.case_task_id,
          unit_id: location?.state?.unitData?.unit_id,
          topic_label: selectedTopic,
        }
      )
      .then((res) => {
        toast.info(res?.message);
      })
      .catch((err) => err);
    setLoader(false);
  };

  const getvideos = () => {
    axios
      .get(
        "https://camp-coding.tech/quest/platform/admin/videos/select_videos.php"
      )
      .then((res) => {
        setvideos(res);
        setaddquestiondata({ ...addquestiondata, help_video: res[0].video_id });
      });
  };

  useEffect(() => {
    getmcqQuestions();
  }, []);

  //
  const [modal, setModal] = useState(false);
  const toggle = useCallback(() => {
    if (modal) {
      // setModal(false);
      setIsModalOpen(false);
    } else {
      // setModal(true);
      setIsModalOpen(false);
    }
  }, [modal]);
  const [selectedFiles, setselectedFiles] = useState([]);
  const [book, setBook] = useState(false);
  const [uploadloading, setuploadloading] = useState(false);

  const [inputList, setinputList] = useState([
    { answer: "", explanation: "", id: 1 },
  ]);
  const [selectanswer, setselectanswer] = useState("");

  const handleaddansex = (e, i) => {
    const { name, value } = e.target;
    const list = [...inputList];
    list[i][name] = value;
    setinputList(list);
  };

  const handlesavetxt = (e, i) => {
    // console.log(i)
    // console.log(txt)
    // ;
    const list = [...answerlist];
    list[i]["answer"] = e.target.value;
    setanswersArray(list);
  };

  const handleaddquestion = (e) => {
    let answerslistarr = [...answerlist];
    //
    let answers = "";
    let valid_answer = "";
    let formRef = e?.target;
    for (let i = 0; i < answerslistarr.length; i++) {
      if (i == 0) {
        answers += answerslistarr[i].answer;
      } else {
        answers += "******matary***" + answerslistarr[i].answer;
      }
      if (answerslistarr[i].checked) {
        valid_answer = answerslistarr[i].answer;
      }
    }
    //

    const data_send = {
      unit_id: allunitdata.unit_id,
      question_text: addquestiondata.question_text,
      answers,
      valid_answer,
      exam_id: "0",
      course_id: allunitdata.course_id,
      case_task_id: location?.state?.caseData?.case_task_id,

      question_image_url: addquestiondata.question_image_url,
      help_text: addquestiondata.help_text,
      help_pdf: searchValue,
      help_video: addquestiondata?.help_video,
      help_pdf_page: addquestiondata.pdf_page,
      video_time: addquestiondata?.video_time,
      key_words: addquestiondata.question_key_words,
      topic_label: addquestiondata?.topic_label,
      overall_image: addquestiondata?.overall_image?.join("**matary**"),
      overall: addquestiondata?.overall,
    };

    console.log(addquestiondata);

    axios
      .post(
        "https://camp-coding.tech/quest/platform/admin/mcq/new_mcq/insert_mcq.php",
        JSON.stringify(data_send)
      )
      .then((res) => {
        if (res.status == "success") {
          getmcqQuestions();
          setIsModalOpen(false);
          setaddquestiondata({
            question_text: "",
            help_video: "",
            valid_answer: "",
            question_image_url: "",
            help_pdf: "",
            unit_id: "0",
            pdf_page: "",
            video_time: "",
            help_text: "",
            overall_image: [],
          });
          toast.success("Question has added successfully");
          formRef.reset();
        } else if (res.status == "error") {
          toast.error("Question has not added");
        } else {
          toast.error("Something Went Error");
        }
      })
      .catch((err) => console.log(err));
  };
  const [showCopy, setShowCopy] = useState(false);
  const [copyData, setCopyData] = useState({
    unit_id: "",
    question_text: "",
    answers: "",
    valid_answer: "",
    exam_id: "0",
    course_id: "",
    case_task_id: location?.state?.caseData?.case_task_id,
    question_image_url: "",
    help_text: "",
    help_pdf: "",
    help_video: addquestiondata?.help_video,
    help_pdf_page: "",
    video_time: "",
    key_words: "",
    topic_label: "",
    overall_image: "",
    overall: "",
  });

  const [MCQ_Show, setMCQShow] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const uploadExcel = async (e, type) => {
    setUploadLoading(true);
    const formData = new FormData(e?.target);
    const form = e.target;

    formData.append("file_attachment", e.target.file_attachment.files[0]);
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
      await getTopics();
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
  const handlecopyquestion = (e) => {
    axios
      .post(
        "https://camp-coding.tech/quest/platform/admin/mcq/new_mcq/insert_mcq.php",
        JSON.stringify(copyData)
      )
      .then((res) => {
        if (res.status == "success") {
          getmcqQuestions();
          toast.success("Question has added successfully");
        } else if (res.status == "error") {
          toast.error("Question has not added");
        } else {
          toast.error("Something Went Error");
        }
      })
      .catch((err) => console.log(err));
  };
  const [overallImg, setOverallImg] = useState(false);
  // setOverallImg
  const handleuploadOverallimg = async () => {
    setuploadloading(true);
    const overAllImages = [];
    if (overallImg?.length) {
      delete overallImg?.length;
      await Promise.all(
        Object.values(overallImg)?.map(async (item) => {
          const formdata = new FormData();
          formdata.append("image", item);
          await axios
            .post(
              "https://camp-coding.tech/quest/platform/admin/image_uplouder.php",
              formdata
            )
            .then((res) => {
              console.log(res);
              overAllImages.push(res);
            })
            .catch((err) => console.log(err))
            .finally(() => {});
        })
      );

      console.log(overAllImages);
      setaddquestiondata({
        ...addquestiondata,
        overall_image: [...overAllImages],
      });
    }

    setuploadloading(false);
  };
  const handleuploadimg = () => {
    setuploadloading(true);
    const formdata = new FormData();
    formdata.append("image", img);
    axios
      .post(
        "https://camp-coding.tech/quest/platform/admin/image_uplouder.php",
        formdata
      )
      .then((res) => {
        setaddquestiondata({ ...addquestiondata, question_image_url: res });
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setuploadloading(false);
      });
  };

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      // No file selected
      return;
    }
    setBook(file);
    var reader = new FileReader();
    reader.readAsBinaryString(event.target.files[0]);
    reader.onloadend = function () {
      var count = reader.result.match(/\/Type[\s]*\/Page[^s]/g)?.length;
      if (count) {
        setNumberOfPages(count);
      } else {
        setNumberOfPages(false);
      }
    };
  };

  const uploadPdf = async () => {
    setLoading(true);
    const formData = new FormData();
    if (book) {
      formData.append("file_attachment", book);
      console.log(book);
      const url = await axios.post(
        "https://camp-coding.tech/quest/platform/admin/uploud_pdf.php",
        formData
      );
      console.log(url);
      if (url.status == "success") {
        setBookUrl(url.message);
        setaddquestiondata({ ...addquestiondata, help_pdf: url.message });
        toast.success("File Uploaded Successfully");
      } else {
        toast.error(url.message);
      }
    }
    setLoading(false);
  };
  const permissions = userData?.permissions;
  useEffect(() => {
    if (isModalOpen) {
      getvideos();
      getEbooks();
    }
  }, [isModalOpen]);
  const [ebooks, setEbooks] = useState(false);
  const [searchValue, setSearchValue] = useState(false);
  const [videoType, setVideoType] = useState(false);
  const [videoData_r, setVideoDataR] = useState(false);
  const getEbooks = async () => {
    try {
      const get = await axios.get(
        "https://camp-coding.tech/quest/platform/admin/books_store/select_books.php"
      );
      if (Array.isArray(get?.message)) setEbooks(get.message);
      else setEbooks([]);
    } catch (err) {
      setEbooks([]);
    }
  };

  // ==================================================

  const getUniversities = () => {
    setLoading("univ");
    axios
      .get(
        "https://camp-coding.tech/quest/platform/admin/import_qs/select_universities_grade.php"
      )
      .then((res) => {
        if (Array.isArray(res.message)) setUniversities(res.message);
        // setSelecteduniversity(res?.message[0]?.university_id);
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setLoading(false);
      });
  };
  const getCourses = async () => {
    try {
      setLoading("course");
      const courses = await axios.post(
        "https://camp-coding.tech/quest/platform/admin/import_qs/select_courses.php",
        {
          grade_id: selecedGrade,
        }
      );
      // setCourses([...courses]);
      let pushedCourses = courses.filter(
        (item) => item.grade_id == selecedGrade
      );
      setCourses((prev) => pushedCourses);
      setLoading("false");
    } catch (err) {
      setLoading("false");

      return err;
    }
    // setSelectCourse(pushedCourses[0]?.course_id);
  };
  const getGrades = () => {
    setLoading("grade");
    axios
      .get(
        "https://camp-coding.tech/quest/platform/admin/import_qs/select_universities_grade.php"
      )
      .then((res) => {
        if (Array.isArray(res.message)) {
          let AllGrades = [...res.message];
          let newGrade = AllGrades.filter(
            (item) => item.university_id == selecteduniversity
          );
          let grades = [newGrade[0]?.grades];
          setGrades(grades[0]);
          setLoading(false);

          // setSelectedGrade(grades[0].grade_id);
        }
      })
      .catch((err) => err)
      .finally(() => {
        setLoading(false);
      });
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
  useEffect(() => {
    if (selecteduniversity) {
      setGrades((prev) => []);
      setCourses((prev) => []);
      setunits((prev) => []);
      setTopics((prev) => []);
      setunitquestions((prev) => []);

      setSelectCourse(null);
      setSelectedGrade(null);
      setselecteduni(null);
      setSelectedTopic(null);
      setselectedquestion(null);
      getGrades();
    }
  }, [selecteduniversity]);
  const getUnits = () => {
    setLoading("unit");
    const data_send = {
      course_id: selectedCourse,
    };
    axios
      .post(
        "https://camp-coding.tech/quest/platform/admin/import_qs/select_course_units.php",
        JSON.stringify(data_send)
      )
      .then((res) => {
        //
        if (Array.isArray(res)) {
          setunits((prev) => res);
        }
        // setselecteduni(res[0]?.unit_id);
      })
      .catch((err) => err)
      .finally(() => {
        setLoading("false");
      });
  };
  useEffect(() => {
    if (showImportModal) getUniversities();
  }, [showImportModal]);
  useEffect(() => {}, []);
  useEffect(() => {
    if (selectedCourse) {
      setselecteduni(null);
      setSelectedTopic(null);
      setselectedquestion(null);
      setunits((prev) => []);
      setTopics((prev) => []);
      setunitquestions((prev) => []);
      getUnits();
    }
  }, [selectedCourse]);
  useEffect(() => {
    if (selecedGrade) {
      setCourses((prev) => []);
      setunits((prev) => []);
      setTopics((prev) => []);
      setunitquestions((prev) => []);
      setSelectCourse(null);
      setselecteduni(null);
      setSelectedTopic(null);
      setselectedquestion(null);
      getCourses();
    }
  }, [selecedGrade]);
  const [selectedChoice, setSelectedChoice] = useState([]);
  const getTopics = () => {
    setLoading("topic");
    const data_send = {
      course_id: selectedCourse,
      unit_id: selecteduni,
    };
    axios
      .post(
        "https://camp-coding.tech/quest/platform/admin/mcq/topics/select_topics.php",
        JSON.stringify(data_send)
      )
      .then((res) => {
        if (Array.isArray(res.message)) {
          setTopics((prev) => res.message);
        }
        // setSelectedTopic(res?.message[0]?.topic_id);
      })
      .catch((err) => err)
      .finally(() => {
        setLoading("false");
      });
  };
  const getTopicQuestions = () => {
    setLoading("question");
    const data_send = {
      topic_id: selectedTopic,
    };
    axios
      .post(
        "https://camp-coding.tech/quest/platform/admin/mcq/new_mcq/select_topic_mcqs.php",
        JSON.stringify(data_send)
      )
      .then((res) => {
        if (Array.isArray(res.message)) {
          setunitquestions((prev) => res.message);
        }
      })
      .catch((err) => err)
      .finally(() => {
        setLoading("false");
      });
  };
  // useEffect(() => {
  //   if (selectedTopic) {
  //     setunitquestions((prev) => []);

  //     getTopicQuestions();
  //   }
  // }, [selectedTopic]);
  useEffect(() => {
    if (selecteduni) {
      setSelectedTopic(null);
      setselectedquestion(null);
      setTopics((prev) => []);
      setunitquestions((prev) => []);
      getTopics();
    }
  }, [selecteduni]);

  // ==================================================
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
                <div className="position-relative">
                  <div className="modal-button mt-2">
                    <Row className="align-items-start">
                      <Col className="col-sm">
                        <div>
                          <button
                            type="button"
                            className="btn btn-success mb-4"
                            data-bs-toggle="modal"
                            data-bs-target="#addCourseModal"
                            onClick={() => {
                              // showModal()
                              // setModal(true);
                              setshowImportModal(true);
                            }}
                          >
                            Import Question
                          </button>
                        </div>
                      </Col>
                      <Col></Col>
                    </Row>
                  </div>
                </div>
                <div id="table-invoices-list">
                  {!getLoading ? (
                    <McqQuestionList
                      getmcqQuestions={getmcqQuestions}
                      updatemcq={(data_send) => {
                        // getmcqQuestions();
                        setmcqquestions(
                          mcqquestions.map((item) => {
                            if (item?.question_id == data_send?.question_id) {
                              item.question_text = data_send.question_text
                                ? data_send.question_text
                                : item.question_text;
                              item.question_image_url =
                                data_send.question_image_url
                                  ? data_send.question_image_url
                                  : item.question_image_url;
                              item.help_text = data_send.help_text
                                ? data_send.help_text
                                : item.help_text;
                              item.topic_label = data_send.topic_label
                                ? data_send.topic_label
                                : item.topic_label;
                              item.help_pdf = data_send.help_pdf
                                ? data_send.help_pdf
                                : item.help_pdf;
                              item.help_video = data_send.help_video
                                ? data_send.help_video
                                : item.help_video;
                              item.help_pdf_page = data_send.pdf_page
                                ? data_send.pdf_page
                                : item.pdf_page;
                              item.video_time = data_send.video_time
                                ? data_send.video_time
                                : item.video_time;
                              item.key_words = data_send?.question_key_words
                                ? data_send?.question_key_words
                                : item?.question_key_words;
                              item.overall_image = data_send?.overall_image
                                ? data_send?.overall_image
                                : item?.overall_image;
                              item.overall = data_send?.overall
                                ? data_send?.overall
                                : item?.overall;
                              item.hidden = data_send.hidden_value
                                ? data_send.hidden_value
                                : item.hidden;
                            }
                            return item;
                          })
                        );
                      }}
                      Units={mcqquestions}
                      setShowCopy={setShowCopy}
                    />
                  ) : (
                    <Loader />
                  )}
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle} tag="h4">
          Add New MCQ Question
        </ModalHeader>
        <ModalBody>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              // validation.handleSubmit();
              return false;
            }}
          >
            <Row>
              <Col lg={12}>
                <div className="custom-accordion" id="addcourse-accordion">
                  <Card>
                    <div className="p-4 border-top">
                      <form>
                        <div className="mb-3">
                          <label className="form-label" htmlFor="coursename">
                            question title
                          </label>
                          <textarea
                            style={{ height: "100px" }}
                            id="coursename"
                            name="coursename"
                            placeholder="Enter Question Title"
                            type="text"
                            className="form-control"
                          ></textarea>
                        </div>

                        <div
                          onClick={() => {
                            setinputList([
                              ...inputList,
                              {
                                answer: "",
                                explanation: "",
                                id: inputList[inputList.length - 1].id + 1,
                              },
                            ]);
                          }}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            cursor: "pointer",
                            marginBottom: "10px",
                          }}
                        >
                          <h5
                            style={{
                              fontSize: "24px",
                              textTransform: "capitalize",
                            }}
                          >
                            add answer
                          </h5>
                          <AiOutlinePlusCircle
                            style={{ fontSize: "30px", cursor: "pointer" }}
                          />
                        </div>
                        <Row>
                          {inputList.map((item, i) => {
                            return (
                              <>
                                <Col lg={6}>
                                  <div className="mb-4">
                                    <label
                                      className="form-label"
                                      htmlFor="price"
                                    >
                                      Answer_{i + 1}
                                    </label>
                                    <Input
                                      onChange={(e) => handleaddansex(e, i)}
                                      id="price"
                                      name="answer"
                                      placeholder="Enter Answer"
                                      type="text"
                                      className="form-control"
                                    />
                                  </div>
                                </Col>
                              </>
                            );
                          })}

                          <h5>select correct answer</h5>
                          <Col lg={12}>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "4px",
                                flexWrap: "wrap",
                              }}
                            >
                              {inputList.map((item, index) => {
                                return (
                                  <div
                                    onClick={() => {
                                      setselectanswer(item.id);
                                    }}
                                    className={
                                      selectanswer == item.id
                                        ? "selectedques active"
                                        : "selectedques"
                                    }
                                  >
                                    {item.id}
                                  </div>
                                );
                              })}
                            </div>
                            <Col lg={6}>
                              <div className="mb-3">
                                <label className="form-label" htmlFor="hours">
                                  Correct Answer Explanation
                                </label>
                                <textarea
                                  style={{ height: "100px", width: "100%" }}
                                  id="hours"
                                  name="explanation"
                                  placeholder="Enter Explanation"
                                  type="number"
                                  className="form-control"
                                ></textarea>
                              </div>
                            </Col>
                          </Col>
                        </Row>
                        <button className="btn btn-success">
                          Add Question
                        </button>
                      </form>
                    </div>
                  </Card>
                </div>
              </Col>
            </Row>
            <Row>
              <Col>
                <div className="text-end">
                  <button type="submit" className="btn btn-success save-user">
                    Save
                  </button>
                </div>
              </Col>
            </Row>
          </Form>
        </ModalBody>
      </Modal>
      <Modal title="add question" isOpen={isModalOpen}>
        <form
          action="#"
          style={{
            padding: "15px",
            display: "flex",
            flexDirection: "column",
            gap: "13px",
          }}
          onSubmit={(e) => {
            e.preventDefault();
            handleaddquestion(e);
          }}
        >
          <CloseButton
            onClick={() => setIsModalOpen(false)}
            style={{ marginLeft: "auto" }}
          />

          <span
            onClick={() => {
              setshowImportModal(true);
            }}
            style={{ width: "fit-content" }}
            className="btn btn-primary"
          >
            import
          </span>
          <div className="inputField withtext">
            <label htmlFor="exam_name">Topic Label</label>
            <Input
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "4px",
              }}
              type="text"
              name="exam_name"
              id="exam_name"
              placeholder="Topic Label"
              required
              onChange={(e) => {
                setaddquestiondata({
                  ...addquestiondata,
                  topic_label: e.target.value,
                });
                // setexamdata({...examdata,exam_name:e.target.value})
              }}
            />
          </div>
          <div className="inputField withtext">
            <label htmlFor="exam_name">Question Text</label>
            <Input
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "4px",
              }}
              type="text"
              name="exam_name"
              id="exam_name"
              placeholder="question text"
              // required
              onChange={(e) => {
                setaddquestiondata({
                  ...addquestiondata,
                  question_text: e.target.value,
                });
                // setexamdata({...examdata,exam_name:e.target.value})
              }}
            />
          </div>
          <div className="inputField withtext">
            <label htmlFor="exam_name">Question Overall</label>
            <Input
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "4px",
              }}
              type="text"
              name="exam_name"
              id="exam_name"
              placeholder="question text"
              // required
              value={addquestiondata.overall}
              onChange={(e) => {
                setaddquestiondata({
                  ...addquestiondata,
                  overall: e.target.value,
                });
                // setexamdata({...examdata,exam_name:e.target.value})
              }}
            />
          </div>
          <div className="inputField withtext upimgdiv">
            <label htmlFor="exam_img">Question overall image</label>
            <input
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "4px",
              }}
              multiple={true}
              type="file"
              name="exam_img"
              id="exam_img"
              placeholder="question text"
              // required
              onChange={(e) => {
                setOverallImg(e.target.files);
              }}
            />
            {uploadloading ? (
              <Loader />
            ) : (
              <img
                onClick={() => {
                  handleuploadOverallimg();
                }}
                className="up_img"
                src={require("../../assets/images/upload.png")}
                alt=""
              />
            )}
          </div>
          <div className="inputField withtext upimgdiv">
            <label htmlFor="exam_img">Question image</label>
            <Input
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "4px",
              }}
              type="file"
              name="exam_img"
              id="exam_img"
              placeholder="question text"
              // required
              onChange={(e) => {
                setimg(e.target.files[0]);
                // setaddquestiondata({...addquestiondata,question_text:e.target.value})
                // setexamdata({...examdata,exam_name:e.target.value})
              }}
            />
            {uploadloading ? (
              <Loader />
            ) : (
              <img
                onClick={() => {
                  handleuploadimg();
                }}
                className="up_img"
                src={require("../../assets/images/upload.png")}
                alt=""
              />
            )}
          </div>
          {/* <div className="mb-3">
            <Label className="form-label">ebook file</Label>
            <div
              className="form-control"
              style={{
                display: "flex",
                width: "100%",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              {" "}
              <input
                type="file"
                id="pdfInput"
                accept=".pdf"
                onChange={handleFileSelect}
              />{" "}
              <span className="btn btn-primary" onClick={() => uploadPdf()}>
                {!loading ? (
                  <Icon icon="solar:upload-bold-duotone" />
                ) : (
                  <Loader size="sm" />
                )}
              </span>
            </div>
            <h4>
              {numberOfPages ? (
                <span>numberOfPages : {numberOfPages}</span>
              ) : null}
            </h4>
          </div> */}
          <form controlId="radioList">
            <p>Get PDF</p>
            <div>
              <input
                type="radio"
                name="pdf"
                value="vlist"
                onChange={(e) => {
                  setVideoDataR(false);
                  setVideoType(e.target.value);
                }}
              />
              Select From List
            </div>
            <div>
              <input
                type="radio"
                name="pdf"
                value="vsid"
                onChange={(e) => {
                  setVideoDataR(false);
                  setVideoType(e.target.value);
                }}
              />
              Enter Ebook Code
            </div>
          </form>
          {videoType == "vsid" ? (
            <>
              <input
                type="search"
                className="search_type"
                onChange={(e) => setSearchValue(e.currentTarget.value)}
                placeholder="Book Code"
              />
            </>
          ) : videoType == "vlist" ? (
            ebooks && ebooks.length ? (
              <>
                <SelectPicker
                  label="Select Book"
                  data={ebooks.map((item) => {
                    return {
                      label: item?.book_title,
                      value: item?.book_code,
                    };
                  })}
                  style={{ width: 224 }}
                  // required
                  onChange={(e) => setSearchValue(e)}
                />
              </>
            ) : (
              <h3>No Books</h3>
            )
          ) : null}
          {/* <div className="inputField withtext">
            <label htmlFor="exam_name">Help Video</label>
            <select
              onChange={(e) => {
                setaddquestiondata({
                  ...addquestiondata,
                  help_video: e.target.value
                });
              }}
              value={addquestiondata.help_video}
              className="form-control"
            >
              {videos.map((item) => {
                return (
                  <option value={item.video_id}>{item.video_title}</option>
                );
              })}
            </select>
          </div> */}

          <div className="mb-3">
            <label className="form-label" htmlFor="coursename">
              help page
            </label>
            <input
              id="pdf_page"
              name="pdf_page"
              type="text"
              className="form-control"
              onChange={(e) => {
                console.log("Help", e.target.value);
                setaddquestiondata({
                  ...addquestiondata,
                  pdf_page: e.target.value,
                });
              }}
            />
          </div>

          {/* <div className="mb-3">
            <label className="form-label" htmlFor="coursename">
              help minute
            </label>
            <input
              id="video_time"
              name="video_time"
              type="text"
              className="form-control"
              onChange={(e) => {
                setaddquestiondata({
                  ...addquestiondata,
                  video_time: e.target.value
                });
              }}
            />
          </div> */}
          <div className="mb-3">
            <label className="form-label" htmlFor="help_text">
              help Text
            </label>
            <textarea
              id="help_text"
              name="help_text"
              type="text"
              className="form-control"
              onChange={(e) => {
                setaddquestiondata({
                  ...addquestiondata,
                  help_text: e.target.value,
                });
              }}
            />
          </div>

          <div className="mb-3">
            <label className="form-label" htmlFor="coursename">
              KeyWords
            </label>
            <input
              id="question_key_words"
              name="question_key_words"
              type="text"
              className="form-control"
              value={addquestiondata?.question_key_words}
              onChange={(e) => {
                setaddquestiondata({
                  ...addquestiondata,
                  question_key_words: e.target.value,
                });
              }}
            />
          </div>

          <button
            onClick={() => {}}
            className="btn btn-success"
            style={{ margin: "10px 0 0 auto" }}
          >
            {" "}
            Add Question{" "}
          </button>
        </form>
      </Modal>
      <Modal title="Import question" isOpen={showImportModal}>
        <ModalBody>
          {/* {loading == "univ" ? (
            <Loader />
          ) : ( */}
          <CloseButton
            onClick={() => setshowImportModal(false)}
            style={{ marginRight: "auto" }}
          />
          <div>
            {" "}
            <label style={{ fontSize: "22px" }} htmlFor="">
              Universities
            </label>
            <Select
              style={{
                width: "100%",
                borderRadius: "4px",
                margin: "10px 0",
              }}
              type="text"
              name="unit_id"
              id="unit_id"
              value={selecteduniversity}
              placeholder="Choose Unit"
              onChange={(e) => {
                setSelecteduniversity(e.target.value);
              }}
              // onChange={(e) => setSelectedUnit(e.target.value)}
              required
            >
              {universities &&
                universities?.map((item, index) => {
                  return (
                    <MenuItem value={item.university_id} key={index}>
                      {item?.university_name}
                    </MenuItem>
                  );
                })}
            </Select>
          </div>
          {/* )} */}

          {loading == "grade" ? (
            <div>
              <Loader />
            </div>
          ) : grades && grades?.length ? (
            <div>
              {" "}
              <label style={{ fontSize: "22px" }} htmlFor="">
                Grades
              </label>
              <Select
                style={{
                  width: "100%",
                  borderRadius: "4px",
                  margin: "10px 0",
                }}
                type="text"
                name="unit_id"
                id="unit_id"
                value={selecedGrade}
                placeholder="Choose Unit"
                onChange={(e) => {
                  setSelectedGrade(e.target.value);
                }}
                // onChange={(e) => setSelectedUnit(e.target.value)}
                required
              >
                {grades &&
                  grades?.map((item, index) => {
                    return (
                      <MenuItem value={item.grade_id} key={index}>
                        {item?.grade_name}
                      </MenuItem>
                    );
                  })}
              </Select>
            </div>
          ) : null}
          {loading == "course" ? (
            <div>
              <Loader />
            </div>
          ) : Courses && Courses?.length ? (
            <div>
              {" "}
              <label style={{ fontSize: "22px" }} htmlFor="">
                Courses
              </label>
              <Select
                style={{
                  width: "100%",
                  borderRadius: "4px",
                  margin: "10px 0",
                }}
                type="text"
                name="unit_id"
                id="unit_id"
                value={selectedCourse}
                placeholder="Choose Unit"
                onChange={(e) => {
                  setSelectCourse(e.target.value);
                }}
                // onChange={(e) => setSelectedUnit(e.target.value)}
                required
              >
                {Courses &&
                  Courses?.map((item, index) => {
                    return (
                      <MenuItem value={item.course_id} key={index}>
                        {item?.course_name}
                      </MenuItem>
                    );
                  })}
              </Select>
            </div>
          ) : null}
          {loading == "unit" ? (
            <div>
              <Loader />
            </div>
          ) : units && units?.length ? (
            <div>
              {" "}
              <label style={{ fontSize: "22px" }} htmlFor="">
                Units
              </label>
              <Select
                style={{
                  width: "100%",
                  borderRadius: "4px",
                  margin: "10px 0",
                }}
                value={selecteduni}
                type="text"
                name="unit_id"
                id="unit_id"
                placeholder="Choose Unit"
                onChange={(e) => {
                  setselecteduni(e.target.value);
                }}
                required
              >
                {units &&
                  units?.map((item, index) => {
                    return (
                      <MenuItem value={item.unit_id} key={index}>
                        {item?.unit_name}
                      </MenuItem>
                    );
                  })}
              </Select>
            </div>
          ) : null}
          {loading == "topic" ? (
            <div>
              <Loader />
            </div>
          ) : topics && topics?.length ? (
            <div>
              <label style={{ fontSize: "22px" }} htmlFor="">
                Topics
              </label>
              <Select
                style={{
                  width: "100%",
                  borderRadius: "4px",
                  margin: "10px 0",
                }}
                value={selectedTopic}
                type="text"
                name="unit_id"
                id="unit_id"
                placeholder="Choose Unit"
                onChange={(e) => {
                  setSelectedTopic(e.target.value);
                }}
                required
              >
                {topics &&
                  topics?.map((item, index) => {
                    return (
                      <MenuItem value={item.topic_label} key={index}>
                        {item?.topic_label}
                      </MenuItem>
                    );
                  })}
              </Select>
            </div>
          ) : null}

          {!loader ? (
            <button
              className="btn btn-danger"
              onClick={() => {
                handleAssignTopicMsqs();
              }}
            >
              done
            </button>
          ) : (
            <Loader />
          )}
          {/* {console.log(selectedquestiondata)} */}
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
            return !uploadLoading ? uploadExcel(e, "cases") : null;
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

export default CasesMCQQuestions;
