import React, { useState } from "react";
import { CloseButton, Input, Modal, Col, Row } from "reactstrap";

// import TableContainer from "./../../../../components/Common/TableContainer";
// import { CourseData } from "../../../../CommonData/Data/Course";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { MenuItem, Select } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Loader } from "rsuite";
import { deleteQ } from "../../../assets/images/deleteQ";
import TableContainer from "../../../components/Common/TableContainer";
import Confirm from "../../../components/ConfComp/Confirm";
import { userData } from "../../../store/getProfileData";
const QuestionTableList = ({ Questions, updatemcq }) => {
  const navigate = useNavigate();
  const [showconf, setshowconf] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rowdata, setrowdata] = useState({});
  const [img, setimg] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [videos, setvideos] = useState([]);
  const [book, setBook] = useState(false);
  const handleuploadAnswerimg = (update) => {
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

  const handleaddAnswer = () => {
    const data_send = {
      question_id: questionId,
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
          getAnswers(questionId);
          toast.success("Answer has added successfully");
          setimg(null);
          setAddAnswer({});
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
      question_id: questionId,
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
          getAnswers(questionId);
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
  const [answerlist, setanswerlist] = useState([
    // {id:0,answer:'',checked:false}
  ]);
  const permissions = userData?.permissions;
  const [answers, setAnswers] = useState([]);
  const [questionId, setQuestionId] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [modelAnswers, setModelAnswers] = useState(null);
  const [answersLoading, setAnswersLoading] = useState(false);
  const [uploadloading, setuploadloading] = useState(false);
  const ModelAnswersColumns = [
    {
      Header: "No",
      Cell: (cell) => {
        return <b>{cell.cell.row.index + 1}</b>;
      },
    },
    // {
    //   Header: 'question id',
    //   accessor: 'question_id',
    // },
    {
      Header: "answer_value",
      accessor: "answer_value",
    },
    {
      Header: "answer_score",
      accessor: "answer_score",
    },
    // {
    //   Header: 'answer_explanation',
    //   accessor: 'answer_explanation',
    // },
    // {
    //   Header: 'explanation Image',
    //   Cell: (cell) => {
    //     return <img src={cell.cell.row.original?.answer_explanation_image} />;
    //   },
    // },
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
  const [isModelAnswerOpen, setIsModalAnswerOpen] = useState(false);
  const [rowData, setRowData] = useState({});
  const [addAnswer, setAddAnswer] = useState({});
  const [showChooseCorrectAnswer, setShowChooseCorrectAnswer] = useState(false);
  const [selectedCorrected, setSelectedCorrected] = useState(false);
  const getAnswers = async (id) => {
    setAnswersLoading(true);
    try {
      const answers = await axios.post(
        "https://camp-coding.tech/quest/platform/admin/mcq/new_mcq/answers/select_answers.php",
        {
          question_id: id,
        }
      );
      setAnswers(answers?.message);
      setAnswersLoading(false);
      if (id) {
        setModelAnswers(answers?.message);
      }
    } catch (err) {
      setAnswersLoading(false);
    }
  };
  const handleCorrectAnswer = (data) => {
    const data_send = {
      unit_qs_answer_id: selectedCorrected,
      question_id: questionId,
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
          getAnswers(questionId);
          toast.success("Success");
        } else if (res.status == "error") {
          toast.error(res.message);
        } else {
          toast.error("Something Went Error");
        }
      });
  };
  const columns = [
    {
      Header: "No",
      Cell: (cell) => {
        return <b>{cell.cell.row.index + 1}</b>;
      },
    },
    {
      Header: "question id",
      accessor: "renew_from_q_id",
    },
    {
      Header: "question title",
      accessor: "question_text",
    },

    {
      Header: "question Image",
      Cell: (cell) => {
        return <img src={cell.cell.row.original.question_image_url} />;
      },
    },
    // {
    //   Header: 'question answers',
    //   Cell: (cell) => {
    //     return (
    //       <ul>
    //         {cell?.cell?.row?.original?.answers.map((item) => {
    //           return (
    //             <li
    //               style={{
    //                 color: item.answer_score == "true" ? 'green' : 'red',
    //               }}
    //             >
    //               {item.answer_value}
    //             </li>
    //           );
    //         })}
    //       </ul>
    //     );
    //   },
    // },
    {
      Header: "Answers",
      Cell: (cell) => {
        return (
          <>
            {" "}
            <button
              className="btn btn-success"
              onClick={() => {
                setQuestionId(cell.cell.row.original?.question_id);
                getAnswers(cell.cell.row.original?.question_id);
              }}
            >
              {answersLoading ? <Loader /> : "Show Answers"}
            </button>
          </>
        );
      },
    },
    {
      Header: "Status",
      Cell: (cell) => {
        if (
          permissions?.includes("*20_9") ||
          permissions?.startsWith("20_9") ||
          permissions == "all"
        )
          switch (cell.cell.row.original.hidden) {
            case "no":
              return (
                <div
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setshowconf(true);
                    setrowdata({
                      ...cell.cell.row.original,
                      number: cell.cell.row.index + 1,
                    });
                  }}
                >
                  <Visibility className="shown" />
                </div>
              );

            case "yes":
              return (
                <div
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setshowconf(true);
                    setrowdata({
                      ...cell.cell.row.original,
                      number: cell.cell.row.index + 1,
                    });
                    // const item = cell.cell.row.original;
                    // const send_data = {
                    //   hidden_value: item.hidden == "no" ? "yes" : "no",
                    //   wq_id: item.wq_id
                    // }
                    // showHideQuestions(send_data)
                  }}
                >
                  <VisibilityOff className="hidden" />
                </div>
              );

            default:
              return (
                <span className="badge badge-pill badge-soft-success font-size-12">
                  {cell.cell.row.original.hidden}
                </span>
              );
          }
      },
    },
    {
      Header: "Update",
      Cell: (cell) => {
        return (
          <>
            {permissions?.includes("*20_5") ||
            permissions?.startsWith("20_5") ||
            permissions == "all" ? (
              <button
                onClick={() => {
                  setIsModalOpen(true);
                  let alldatapushed = [];
                  // setrowdata();
                  setrowdata(cell.cell.row.original);
                  // setanswerlist(cell.cell.row.original?.answers)
                  for (
                    let i = 0;
                    i < cell.cell.row.original?.answers?.length;
                    i++
                  ) {
                    let obj = {
                      id: i + 1,
                      answer: cell.cell.row.original?.answers[i].answer_value,
                      checked:
                        cell.cell.row.original?.answers[i].answer_score ==
                        "true"
                          ? true
                          : false,
                    };
                    alldatapushed.push(obj);

                    setanswerlist([...alldatapushed]);
                  }
                }}
                className="btn btn-primary"
              >
                update
              </button>
            ) : null}
          </>
        );
      },
    },

    // {
    //   Header:'Correct answer',
    //   Cell: (cell) => {
    //     return (

    //         cell.cell.row.original.answers.filter((it)=>{
    //           if(it.answer_score=="true"){
    //             return {...it}
    //           }
    //           else return null
    //         })
    //         .map((item)=>{
    //           return(
    //             <p style={{ padding:'3px' }}>{item.answer_value}</p>
    //           )
    //         })

    //     )
    // }
    // },
    // {
    //     Header: 'Hidden',
    //     Cell: (cell) => {
    //         return <button className="btn" onClick={
    //             () => {
    //                 const item = cell.cell.row.original;
    //                 const send_data = {
    //                     status: item.hidden,
    //                     unit_id: item.unit_id
    //                 }
    //                 setshowconf(true);
    //                 setrowdata(send_data)
    //             }
    //         }>
    //             {
    //                 cell.cell.row.original.hidden == "yes" ? <VisibilityOff className="hidden" /> : <Visibility className="shown" />
    //             }
    //         </button>
    //     }
    // },
    // {
    //     Header: "View Unit",
    //     Cell: (cell) => {
    //         return (

    //             <button class="btn btn-success" onClick={
    //                 () => {
    //
    //                     navigate("/lessons", {
    //                         state: {
    //                             coursedata: courseData,
    //                             unitData: cell.cell.row.original
    //                         }
    //                     })
    //                 }
    //             }>View</button>

    //         )
    //     }
    // },

    // {
    //     Header: 'Action',
    //     Cell: (cell) => {
    //         return (
    //             <>
    //                 <button className="btn btn-primary" onClick={() =>{ setsetShowCopy(true); setSelectedUnit(cell.cell.row.original.unit_id)}}>Copy</button>
    //             </>
    //         )
    //     }
    // },
  ];
  const [answersArray, setanswersArray] = useState([]);
  const handlesavetxt = (e, i, id) => {
    const list = [...answerlist];
    list[i]["answer"] = e.target.value;
    setanswersArray(list);
    setanswerlist(list);
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
        setrowdata({ ...rowdata, question_image_url: res });
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setuploadloading(false);
      });
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
  const handlecopyitem = (data) => {
    const data_send = {
      unit_id: selectedUnit,
      course_id: selectedCourse,
    };

    axios
      .post(
        "https://camp-coding.tech/quest/platform/admin/unit/make_copy_from_unit_and_alldata.php",
        JSON.stringify(data_send)
      )
      .then((res) => {
        if (res.status == "success") {
          toast.success("Success");
        } else if (res.status == "error") {
          toast.error(res.message);
        } else {
          toast.error("Something Went Error");
        }
      });
  };
  const [Courses, setCourses] = useState(false);
  const [showCopy, setsetShowCopy] = useState(false);
  const [numberOfPages, setNumberOfPages] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(false);
  const [book_url, setBookUrl] = useState(false);
  const getCourses = async () => {
    const courses = await axios.get(
      "https://camp-coding.tech/quest/platform/admin/courses/select_courses.php"
    );
    setCourses([...courses]);
  };
  // useEffect(() => {
  //   getCourses();
  //   getvideos();
  // }, []);

  const showHideQuestions = async (send_data) => {
    const questions_1 = await axios.post(
      "https://camp-coding.tech/quest/platform/admin/Exams/update_ques_hidden.php",
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

  const handleaddquestion = () => {
    let answerslistarr = [...answerlist];
    //
    let answers = "";
    let valid_answer = "";
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
      question_id: rowdata.question_id,
      unit_id: 0,
      question_text: rowdata.question_text,
      answers,
      valid_answer,
      exam_id: rowdata.exam_id,
      course_id: "1",
      question_image_url: rowdata.question_image_url,
      help_text: rowdata.help_text,
      help_pdf: rowdata.help_pdf,
      help_video: rowdata.help_video,
    };

    axios
      .post(
        "https://camp-coding.tech/quest/platform/admin/Exams/update_question.php",
        JSON.stringify(data_send)
      )
      .then((res) => {
        //
        if (res.status == "success") {
          updatemcq();
          toast.success("Question has added successfully");
        } else if (res.status == "error") {
          toast.error("Question has not added");
        } else {
          toast.error("Something Went Error");
        }
      })
      .catch((err) => console.log(err));
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
      // console.log(book);
      const url = await axios.post(
        "https://camp-coding.tech/quest/platform/admin/uploud_pdf.php",
        formData
      );
      // console.log(url);
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
      {" "}
      {!Questions ? (
        <Loader />
      ) : Questions.length ? (
        <TableContainer
          columns={columns}
          data={Questions}
          isGlobalFilter={true}
          customPageSize={10}
          className="Invoice table"
        />
      ) : !Questions.length ? (
        <h2>No Questions</h2>
      ) : (
        <Loader />
      )}
      <Modal title="Copy Unit To Course" isOpen={showCopy}>
        <form
          action="#"
          style={{
            padding: "15px",
            display: "flex",
            flexDirection: "column",
          }}
          onSubmit={(e) => {
            e.preventDefault();
            // handlecopyitem(e)
            setsetShowCopy(false);
          }}
        >
          <CloseButton
            onClick={() => setsetShowCopy(false)}
            style={{ marginLeft: "auto" }}
          />

          <div className="input_Field">
            <label forHtml="course_id">Course Name</label>
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
                placeholder="Choose Course"
                onChange={(e) => setSelectedCourse(e.target.value)}
                // required
              >
                {Courses && Courses.length ? (
                  Courses.map((item, index) => {
                    return (
                      <MenuItem value={item.course_id} key={index}>
                        {item.course_name}
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
            Copy Unit{" "}
          </button>
        </form>
      </Modal>
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
            // handleaddquestion()
            setIsModalOpen(false);
          }}
        >
          <CloseButton
            onClick={() => setIsModalOpen(false)}
            style={{ marginLeft: "auto" }}
          />

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
              value={rowdata.question_text}
              onChange={(e) => {
                setrowdata({ ...rowdata, question_text: e.target.value });
                // setexamdata({...examdata,exam_name:e.target.value})
              }}
            />
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
                src={require("../../../assets/images/upload.png")}
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
          </div>

          <div className="inputField withtext">
            <label htmlFor="exam_name">Help Video</label>
            <select
              onChange={(e) => {
                setrowdata({ ...rowdata, help_video: e.target.value });
              }}
              value={rowdata.help_video}
              className="form-control"
            >
              {videos.map((item) => {
                return (
                  <option value={item.video_id}>{item.video_title}</option>
                );
              })}
            </select>
          </div> */}

          {/* <div className="inputField withtext">
              <label htmlFor="help_text">Help Video</label>
              <select className="form-control" onChange={(e)=>{
                setaddquestiondata({...addquestiondata,help_video:e.target.value})
              }} value={addquestiondata.help_video} name="" id="">
                {
                  videos.map((item,index)=>{
                    return(
                      <option value={item.video_id}>{item.video_title}</option>
                    )
                  })
                }
              </select>
            </div> */}

          <button
            onClick={() => {
              // console.log("es")
              // setIsModalOpen(true);
              handleaddquestion();
              // console.log("rowdata",rowdata)
            }}
            className="btn btn-success"
            style={{ margin: "10px 0 0 auto" }}
          >
            {" "}
            Edit Question{" "}
          </button>
        </form>
      </Modal>
      <div className="QuestionAnsewers">
        <Modal
          title="QuestionAnsewers"
          isOpen={modelAnswers}
          className="QuestionAnsewers"
          toggle={() => setModelAnswers(null)}
        >
          <div className="modelAnswers">
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
                          setIsModalAnswerOpen(true);
                        }}
                      >
                        <i
                          onClick={() => {
                            // setModal(true);
                            setIsModalAnswerOpen(true);
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
            {modelAnswers && modelAnswers?.length ? (
              <TableContainer
                columns={ModelAnswersColumns}
                data={modelAnswers}
                isGlobalFilter={true}
                customPageSize={10}
                className="Invoice table"
              />
            ) : !modelAnswers?.length ? (
              <h2>No Answers</h2>
            ) : (
              <Loader />
            )}
          </div>
          {/* ModelAnswersColumns */}
        </Modal>
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
              handleCorrectAnswer(e);
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
                  onChange={(e) => setSelectedCorrected(e.target.value)}
                  // required
                >
                  {modelAnswers && modelAnswers.length ? (
                    modelAnswers.map((item, index) => {
                      return (
                        <MenuItem value={item.unit_qs_answer_id} key={index}>
                          {item.answer_value}
                        </MenuItem>
                      );
                    })
                  ) : (
                    <h3>No Answers</h3>
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
              // setShowEdit(false);
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

            {/* <div className="inputField withtext upimgdiv">
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
                    handleuploadAnswerimg(true);
                  }}
                  className="up_img"
                  src={require("../../../assets/images/upload.png")}
                  alt=""
                />
              )}
            </div> */}
            {/* <div className="deleteImage">
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
                        answer_explanation_img: null,
                        answer_explanation_image: null,
                      })
                    }
                  >
                    Delete
                  </span>
                </>
              ) : null}
            </div> */}
            {/* <div className="mb-3">
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
            </div> */}
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
        <Modal title="Add Answer" isOpen={isModelAnswerOpen}>
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
              handleaddAnswer();
              // setIsModalAnswerOpen(false);
            }}
          >
            <CloseButton
              onClick={() => setIsModalAnswerOpen(false)}
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

            {/* <div className="inputField withtext upimgdiv">
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
                }}
              />
              {uploadloading ? (
                <Loader />
              ) : (
                <img
                  onClick={() => {
                    handleuploadAnswerimg();
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
            </div> */}
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
      </div>
    </React.Fragment>
  );
};

export default QuestionTableList;
