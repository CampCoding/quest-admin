import React, { useEffect, useState } from "react";
import {
  CloseButton,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
  Modal,
  Input,
  Spinner,
  Label,
  Row,
  Container,
  Col,
  Card,
  CardBody,
} from "reactstrap";
// import TableContainer from "./../../../../components/Common/TableContainer";
// import { CourseData } from "../../../../CommonData/Data/Course";
import { useLocation, useNavigate } from "react-router-dom";
import TableContainer from "../../../components/Common/TableContainer";
import axios from "axios";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Loader } from "rsuite";
import { ToastContainer, toast } from "react-toastify";
import { MenuItem, Select } from "@mui/material";
import Confirm from "../../../components/ConfComp/Confirm";
import { Icon } from "@iconify/react";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
const Answers = ({ Units, topicData, updatemcq }) => {
  const navigate = useNavigate();
  const location = useLocation();
  topicData = location?.state?.topicData;
  const questionData = location?.state?.questionData;
  const dataQuestions = location?.state?.questions;
  const [rowdata, setrowdata] = useState({});
  // TopicMcqQuestionList
  const [showconf, setshowconf] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [img, setimg] = useState(null);
  const [book, setBook] = useState(false);
  const [book_url, setBookUrl] = useState(false);
  const [loading, setLoading] = useState(false);
  const [numberOfPages, setNumberOfPages] = useState(false);
  const [uploadloading, setuploadloading] = useState(false);
  const [rowData, setRowData] = useState({});
  const [showEdit, setShowEdit] = useState(false);
  const showHideQuestions = async (send_data) => {
    const questions_1 = await axios.post(
      "https://camp-coding.tech/quest/platform/admin/mcq/update_mcq_hidden.php",
      send_data
    );
    if (questions_1.status == "success") {
      toast.success(questions_1.message);
      // await getQuestions();
      updatemcq();
      // setEdit(false)
    } else {
      toast.error(questions_1.message);
    }
  };

  const handleuploadimg = (update) => {
    setuploadloading(true);
    const formdata = new FormData();
    formdata.append("image", img);
    axios
      .post(
        "https://camp-coding.tech/quest/platform/admin/image_uplouder.php",
        formdata
      )
      .then((res) => {
        if (update) {
          setRowData({
            ...rowData,
            answer_explanation_img: res,
            answer_explanation_image: res,
          });
        } else {
          setAddAnswer({ ...addAnswer, answer_Explain_image: res });
        }
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setuploadloading(false);
      });
  };

  const handleaddquestion = () => {
    const data_send = {
      question_id: questionData?.question_id,
      answer_explanation: addAnswer?.answer_explain,
      answer_explanation_img: addAnswer?.answer_Explain_image,
      answer_value: addAnswer?.answer_text,
    };

    axios
      .post(
        "https://camp-coding.tech/quest/platform/admin/mcq/new_mcq/answers/insert_answer.php",
        JSON.stringify(data_send)
      )
      .then((res) => {
        if (res.status == "success") {
          getAnswers();
          toast.success("Answer has added successfully");
        } else if (res.status == "error") {
          toast.error("Answer has not added");
        } else {
          toast.error("Something Went Error");
        }
      })
      .catch((err) => console.log(err));
  };

  const handleUpdatequestion = () => {
    const data_send = {
      question_id: questionData?.question_id,
      unit_qs_answer_id: rowData?.unit_qs_answer_id,
      answer_explanation: rowData?.answer_explanation,
      answer_explanation_img: rowData?.answer_explanation_img,
      answer_value: rowData?.answer_value,
    };
    axios
      .post(
        "https://camp-coding.tech/quest/platform/admin/mcq/new_mcq/answers/edit_answer.php",
        data_send
      )
      .then((res) => {
        if (res.status == "success") {
          getAnswers();
          setShowEdit(false);
          toast.success("Answer has Editted successfully");
        } else if (res.status == "error") {
          toast.error("Answer has not Editted");
        } else {
          toast.error("Something Went Error");
        }
      })
      .catch((err) => console.log(err));
  };
  const [addAnswer, setAddAnswer] = useState({});
  const [showChooseCorrectAnswer, setShowChooseCorrectAnswer] = useState(false);
  const columns = [
    {
      Header: "No",
      Cell: (cell) => {
        return <b>{cell.cell.row.index + 1}</b>;
      },
    },
    {
      Header: "question id",
      accessor: "question_id",
    },
    {
      Header: "answer_value",
      accessor: "answer_value",
    },
    {
      Header: "answer_score",
      accessor: "answer_score",
    },
    {
      Header: "answer_explanation",
      accessor: "answer_explanation",
    },
    {
      Header: "explanation Image",
      Cell: (cell) => {
        return <img src={cell.cell.row.original?.answer_explanation_image} />;
      },
    },
    {
      Header: "Action",
      Cell: (cell) => {
        return (
          <button
            onClick={() => {
              setRowData({
                ...cell.cell.row.original,
                answer_explanation_img:
                  cell.cell.row.original?.answer_explanation_img,
              });
              setShowEdit(true);
            }}
            className="btn btn-success"
          >
            Update
          </button>
        );
      },
    },
  ];
  const [answers, setAnswers] = useState(false);
  const [correctness, setCorrectness] = useState(false);
  const getAnswers = async () => {
    const answers = await axios.post(
      "https://camp-coding.tech/quest/platform/admin/mcq/new_mcq/answers/select_answers.php",
      {
        question_id: questionData?.question_id,
      }
    );
    setAnswers(answers?.message);
  };

  useEffect(() => {
    getAnswers();
  }, []);
  useEffect(() => {
    if (
      answers &&
      answers?.length &&
      answers?.filter((item) => item?.answer_score)?.length
    ) {
      setCorrectness(true);
    }
  }, [answers]);

  const [videos, setvideos] = useState([]);
  const handlecopyitem = (data) => {
    const data_send = {
      unit_qs_answer_id: selectedCourse,
      question_id: questionData?.question_id,
    };
    axios
      .post(
        "https://camp-coding.tech/quest/platform/admin/mcq/new_mcq/answers/edit_true_answers.php",
        JSON.stringify(data_send)
      )
      .then((res) => {
        if (res.status == "success") {
          setSelectedCourse(false);
          setShowChooseCorrectAnswer(false);
          getAnswers();
          toast.success("Success");
        } else if (res.status == "error") {
          toast.error(res.message);
        } else {
          toast.error("Something Went Error");
        }
      });
  };
  const [Courses, setCourses] = useState(false);
  const [allanswers, setallanswers] = useState([]);
  const [showCopy, setsetShowCopy] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(false);
  const getCourses = async () => {
    const courses = await axios.get(
      "https://camp-coding.tech/quest/platform/admin/courses/select_courses.php"
    );
    setCourses([...courses]);
  };
  const getvideos = () => {
    axios
      .get(
        "https://camp-coding.tech/quest/platform/admin/videos/select_videos.php"
      )
      .then((res) => {
        setvideos(res);
        // setaddquestiondata({...addquestiondata,help_video:res[0].video_id})
      });
  };
  useEffect(() => {
    getCourses();
    getvideos();
  }, []);

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
        setrowdata({ ...rowdata, help_pdf: url.message });
        toast.success("File Uploaded Successfully");
      } else {
        toast.error(url.message);
      }
    }
    setLoading(false);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs
            title="MCQ Questions"
            breadcrumbItem="MCQ Questions List"
          />
          <button
            className="btn btn-success"
            onClick={() => {
              navigate(-1, {
                state: location?.state,
              });
            }}
          >
            Go Back
          </button>
          <Col>
            {!correctness ? (
              <button class="btn">
                <span style={{ color: "red" }}>Hint : </span>
                <span>The question does not have any correct answer</span>
              </button>
            ) : null}
          </Col>
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
                                setShowChooseCorrectAnswer(true);
                              }}
                            >
                              <i
                                onClick={() => {
                                  // setModal(true);
                                  setShowChooseCorrectAnswer(true);
                                }}
                                className="mdi mdi-plus me-1"
                              ></i>{" "}
                              Choose Correct Answer
                            </button>{" "}
                            <button
                              type="button"
                              className="btn btn-success mb-4"
                              data-bs-toggle="modal"
                              data-bs-target="#addCourseModal"
                              onClick={() => {
                                // showModal()
                                // setModal(true);
                                setIsModalOpen(true);
                              }}
                            >
                              <i
                                onClick={() => {
                                  // setModal(true);
                                  setIsModalOpen(true);
                                }}
                                className="mdi mdi-plus me-1"
                              ></i>{" "}
                              Add Answer
                            </button>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </div>
                  <div id="table-invoices-list">
                    {answers && answers?.length ? (
                      <TableContainer
                        columns={columns}
                        data={answers}
                        isGlobalFilter={true}
                        customPageSize={10}
                        className="Invoice table"
                      />
                    ) : !answers?.length ? (
                      <h2>No Answers</h2>
                    ) : (
                      <Loader />
                    )}
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>{" "}
        {showChooseCorrectAnswer ? (
          <Modal title="Choose Correct Answer" isOpen={showChooseCorrectAnswer}>
            <form
              action="#"
              style={{
                padding: "15px",
                display: "flex",
                flexDirection: "column",
              }}
              onSubmit={(e) => {
                e.preventDefault();
                handlecopyitem(e);
                // setsetShowCopy(false);
              }}
            >
              <CloseButton
                onClick={() => setShowChooseCorrectAnswer(false)}
                style={{ marginLeft: "auto" }}
              />

              <div className="input_Field">
                <label forHtml="course_id">Answer Value</label>
                <div className="input_Field">
                  <Select
                    style={{
                      width: "100%",
                      borderRadius: "4px",
                      margin: "10px 0",
                    }}
                    type="text"
                    name="course_id"
                    id="course_id"
                    placeholder="Choose Answer"
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    // required
                  >
                    {answers && answers.length ? (
                      answers.map((item, index) => {
                        return (
                          <MenuItem value={item.unit_qs_answer_id} key={index}>
                            {item.answer_value}
                          </MenuItem>
                        );
                      })
                    ) : (
                      <h3>No Courses</h3>
                    )}
                  </Select>
                </div>
              </div>
              <button
                className="btn btn-success"
                style={{ margin: "10px 0 0 auto" }}
              >
                {" "}
                Choose{" "}
              </button>
            </form>
          </Modal>
        ) : null}
        {showconf ? (
          <Confirm
            id={rowdata.number}
            cancleoper={() => {
              setshowconf(false);
            }}
            confirmoper={() => {
              const send_data = {
                hidden_value: rowdata.hidden == "no" ? "yes" : "no",
                question_id: rowdata.question_id,
              };
              showHideQuestions(send_data);
              setshowconf(false);
            }}
            status={rowdata.hidden == "no" ? "hide" : "show"}
            comp={"question"}
          />
        ) : null}
        <Modal title="Add Answer" isOpen={isModalOpen}>
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
              handleaddquestion();
              setIsModalOpen(false);
            }}
          >
            <CloseButton
              onClick={() => setIsModalOpen(false)}
              style={{ marginLeft: "auto" }}
            />

            <div className="inputField withtext">
              <label htmlFor="exam_name">Answer Text</label>
              <Input
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "4px",
                }}
                type="text"
                name="exam_name"
                id="exam_name"
                placeholder="answer text"
                // required
                value={addAnswer.answer_text}
                onChange={(e) => {
                  setAddAnswer({ ...addAnswer, answer_text: e.target.value });
                  // setexamdata({...examdata,exam_name:e.target.value})
                }}
              />
            </div>

            <div className="inputField withtext upimgdiv">
              <label htmlFor="exam_img">Answer Explain image</label>
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
                  src={require("../../../assets/images/upload.png")}
                  alt=""
                />
              )}
            </div>

            <div className="mb-3">
              <label className="form-label" htmlFor="help_text">
                Answer Explaination
              </label>
              <textarea
                id="help_text"
                name="help_text"
                type="text"
                className="form-control"
                value={addAnswer.answer_explain}
                onChange={(e) => {
                  setAddAnswer({
                    ...addAnswer,
                    answer_explain: e.target.value,
                  });
                  // setexamdata({...examdata,exam_name:e.target.value})
                }}
              />
            </div>
            <button
              onClick={() => {
                // console.log("es")
                // setIsModalOpen(true);
              }}
              className="btn btn-success"
              style={{ margin: "10px 0 0 auto" }}
            >
              {" "}
              Add Answer{" "}
            </button>
          </form>
        </Modal>
        <Modal title="Edit Answer" isOpen={showEdit}>
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
              handleUpdatequestion();
              setShowEdit(false);
            }}
          >
            <CloseButton
              onClick={() => setShowEdit(false)}
              style={{ marginLeft: "auto" }}
            />

            <div className="inputField withtext">
              <label htmlFor="exam_name">Answer Text</label>
              <Input
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "4px",
                }}
                type="text"
                name="exam_name"
                id="exam_name"
                placeholder="answer text"
                // required
                value={rowData.answer_value}
                onChange={(e) => {
                  setRowData({ ...rowData, answer_value: e.target.value });
                  // setexamdata({...examdata,exam_name:e.target.value})
                }}
              />
            </div>

            <div className="inputField withtext upimgdiv">
              <label htmlFor="exam_img">Answer Explain image</label>
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
                    handleuploadimg(true);
                  }}
                  className="up_img"
                  src={require("../../../assets/images/upload.png")}
                  alt=""
                />
              )}
            </div>
            <div className="deleteImage">
              {rowData?.answer_explanation_image &&
              rowData?.answer_explanation_image?.length ? (
                <>
                  <img
                    style={{ width: "230px" }}
                    src={rowData?.answer_explanation_image}
                  />
                  <span
                    className="btn btn-danger"
                    onClick={() =>
                      setrowdata({
                        ...rowData,
                        answer_explanation_img: "",
                        answer_explanation_image: "",
                      })
                    }
                  >
                    Delete
                  </span>
                </>
              ) : null}
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="help_text">
                Answer Explaination
              </label>
              <textarea
                id="help_text"
                name="help_text"
                type="text"
                className="form-control"
                value={rowData.answer_explanation}
                onChange={(e) => {
                  setRowData({
                    ...rowData,
                    answer_explanation: e.target.value,
                  });
                  // setexamdata({...examdata,exam_name:e.target.value})
                }}
              />
            </div>
            <button
              onClick={() => {
                // console.log("es")
                // setIsModalOpen(true);
              }}
              className="btn btn-success"
              style={{ margin: "10px 0 0 auto" }}
            >
              {" "}
              Edit Answer{" "}
            </button>
          </form>
        </Modal>
      </div>
      <ToastContainer />
    </React.Fragment>
  );
};

export default Answers;
