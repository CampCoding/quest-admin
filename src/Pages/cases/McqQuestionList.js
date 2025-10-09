/* eslint-disable no-lone-blocks */
import React, { useEffect, useRef, useState } from "react";
import { CloseButton, Input, Modal } from "reactstrap";
// import TableContainer from "./../../../../components/Common/TableContainer";
// import { CourseData } from "../../../../CommonData/Data/Course";
import { MenuItem, Select } from "@mui/material";
import "./style.css";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Loader, SelectPicker } from "rsuite";
import TableContainer from "../../components/Common/TableContainer";
import Confirm from "../../components/ConfComp/Confirm";
import { userData } from "../../store/getProfileData";
const CasesMCQQuestionsList = ({
  Units,
  topicData,
  updatemcq,
  setShowCopy,
  getmcqQuestions,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  topicData = location?.state?.topicData;
  const [rowdata, setrowdata] = useState({});
  const permissions = userData?.permissions;
  // CasesMCQQuestionsList
  const [showconf, setshowconf] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [img, setimg] = useState(null);
  const [book, setBook] = useState(false);
  const [book_url, setBookUrl] = useState(false);
  const [loading, setLoading] = useState(false);
  const [videoNumber, setVideoNumber] = useState(null);
  const [videoData, setVideoData] = useState({});
  const [currentNumber, setCurrentNumber] = useState(false);
  const [video_id, set_video_id] = useState(null);
  const [loader, setLoader] = useState(false);

  const [numberOfPages, setNumberOfPages] = useState(false);
  const [overAllImages, setOverAllImages] = useState(null);
  const [unAssign, setUnAssign] = useState(null);

  const [expImages, setExpImages] = useState(null);
  const [newExpsImages, setNewExpsImages] = useState(null);
  const [answerOpen, setAnswerOpen] = useState(null);
  // setOverAllImages
  const [moveData, setMoveData] = useState(null);
  const [uploadloading, setuploadloading] = useState(false);
  const [questionId, setQuestionId] = useState(false);
  const [answersLoading, setAnswersLoading] = useState(false);
  const [unitTopics, setUnitTopics] = useState(false);
  const [questionOpen, setQuestionOpen] = useState(false);
  useEffect(() => {
    console.log(overAllImages);
  }, [overAllImages]);

  const setArrangeNumber = async (video_id, video_number) => {
    setLoader(true);
    if (video_number == currentNumber) {
      return setLoader(false);
    }
    await axios
      .post(
        "https://camp-coding.tech/quest/platform/admin/cases_tasks/edit_order_no.php",
        {
          case_task_mcq_id: video_id,
          order_no: video_number,
        }
      )
      .then(async (response) => {
        toast.info(response?.message);
        if (response?.status == "success") await getmcqQuestions();
        // setNewData(newFData);
      })
      .catch((error) => console.log(error))
      .finally(() => {
        setLoader(false);
      });
  };
  const showHideQuestions = async (send_data) => {
    const questions_1 = await axios.post(
      "https://camp-coding.tech/quest/platform/admin/mcq/new_mcq/update_mcq_hidden.php",
      send_data
    );
    if (questions_1.status == "success") {
      toast.success(questions_1.message);
      // await getQuestions();
      updatemcq(send_data);
      // setEdit(false)
    } else {
      toast.error(questions_1.message);
    }
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

  const handleaddquestion = () => {
    let answerslistarr = [...allanswers];

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
    const data_send = {
      question_id: rowdata.question_id,
      unit_id: rowdata.unit_id,
      question_text: rowdata.question_text,
      answers,
      valid_answer,
      exam_id: rowdata.exam_id,
      course_id: rowdata.course_id,
      question_image_url: rowdata.question_image_url,
      help_text: rowdata.help_text,
      help_pdf: rowdata.help_pdf,
      help_video: rowdata.help_video,
      help_pdf_page: rowdata.pdf_page,
      video_time: rowdata.video_time,
      key_words: rowdata?.question_key_words,
      topic_label: rowdata?.topic_label,
      overall_image: rowdata?.overall_image,
      overall: rowdata?.overall,
    };
    axios
      .post(
        "https://camp-coding.tech/quest/platform/admin/mcq/new_mcq/update_mcq.php",
        JSON.stringify(data_send)
      )
      .then((res) => {
        if (res.status == "success") {
          updatemcq(data_send);

          toast.success("Question has added successfully");
          setIsModalOpen(false);
        } else if (res.status == "error") {
          toast.error("Question has not added");
        } else {
          toast.error("Something Went Error");
        }
      })
      .catch((err) => console.log(err));
  };
  const [modelAnswers, setModelAnswers] = useState(false);
  const [newImages, setNewImages] = useState([]);

  const columns = [
    {
      Header: "question id",
      accessor: "question_id",
    },
    {
      Header: "number",
      accessor: "order_no",
    },
    {
      Header: "Order Number",
      Cell: (cell) => {
        const inputRef = useRef(null); // Create a ref to the input element

        const handleBlur = async (video_id, video_number) => {
          setArrangeNumber(video_id, video_number);
          set_video_id(null);
        };

        const handleFocus = () => {
          setCurrentNumber(cell.cell.row.original?.order_no);
          set_video_id(cell.cell.row.original?.question_id);
        };

        const handleClick = () => {
          console.log(inputRef.current);
          if (inputRef.current) {
            inputRef.current.focus(); // Focus on the input element
          }
        };

        return (
          <input
            id={cell.cell.row.original?.case_task_mcq_id}
            defaultValue={cell.cell.row.original?.order_no}
            onBlur={async (e) => {
              await setArrangeNumber(e.target.id, e.target.value);
            }}
            onFocus={(e) => {
              e.stopPropagation();
            }}
            disabled={loader}
            className="Mr_Elementery"
            type="number"
            onWheel={(e) => {
              e.stopPropagation(); // Prevent propagation of the wheel event
              e.target.blur(); // Blur the input field
            }}
            onChange={(e) => {}}
          />
        );
      },
    },
    {
      Header: "question Title",
      accessor: "question_text",
    },
    {
      Header: "question Image",
      Cell: (cell) => {
        return <img src={cell.cell.row.original.question_image_url} />;
      },
    },
    // {
    //   Header: 'Copy',
    //   Cell: (cell) => {
    //     return (
    //       <>
    //         <button
    //           className="btn btn-success"
    //           onClick={() => {
    //             setsetShowCopy(true);
    //             setCopyData({ ...cell.cell.row.original });
    //           }}
    //         >
    //           Copy
    //         </button>
    //         <button
    //           style={{ margin: "10px 0" }}
    //           className="btn btn-primary"
    //           onClick={() => {
    //             setMoveData({ ...cell.cell.row.original });
    //           }}
    //         >
    //           Move
    //         </button>
    //       </>
    //     );
    //   },
    // },
    // setShowCopy
    {
      Header: "Answers",
      Cell: (cell) => {
        return (
          <>
            {" "}
            {permissions?.includes("*6_7") ||
            permissions?.startsWith("6_7") ||
            permissions == "all" ? (
              <button
                className="btn btn-success"
                onClick={() => {
                  // navigate("/answers", {
                  //   state: {
                  //     questionData: cell.cell.row.original,
                  //     topicData: topicData,
                  //     questions: JSON.stringify(Units),
                  //   },
                  // })
                  setQuestionId(cell.cell.row.original?.question_id);
                  getAnswers(cell.cell.row.original?.question_id);
                }}
              >
                {answersLoading ? <Loader /> : "Show Answers"}
              </button>
            ) : null}
          </>
        );
      },
    },

    {
      Header: "overall Images",
      Cell: (cell) => {
        return (
          <>
            {" "}
            <button
              className="btn btn-success"
              onClick={() => {
                setQuestionOpen(cell.cell.row.original);

                return setOverAllImages(
                  cell.cell.row.original.array_overall_image
                );
                // navigate("/answers", {
                //   state: {
                //     questionData: cell.cell.row.original,
                //     topicData: topicData,
                //     questions: JSON.stringify(Units),
                //   },
                // })
              }}
            >
              {"overall images"}
            </button>
          </>
        );
      },
    },

    {
      Header: "Un Assign",
      Cell: (cell) => {
        return (
          <>
            {" "}
            <button
              className="btn btn-success"
              onClick={() => {
                return setUnAssign(cell.cell.row.original);
              }}
            >
              {"Un Assign"}
            </button>
          </>
        );
      },
    },

    // {
    //   Header: 'question  answers',
    //   Cell: (cell) => {
    //     return (
    //       <ul>
    //         {cell?.cell?.row?.original?.arrAns.map((item) => {
    //           return (
    //             <li
    //               style={{
    //                 color: item.answer_score == "true" ? 'green' : 'red'
    //               }}
    //             >
    //               {item.answer_value}
    //             </li>
    //           );
    //         })}
    //       </ul>
    //     );
    //   }
    // },
    // {
    //   Header: 'Action',
    //   Cell: (cell) => {
    //     return (
    //       <>
    //         {permissions?.includes("*6_3") ||
    //           permissions?.startsWith("6_3") ||
    //           permissions == "all" ? (
    //           <button
    //             onClick={() => {
    //               setrowdata({ ...cell.cell.row.original });
    //               setIsModalOpen(true);
    //               let alldatapushed = [];
    //               // setallanswers([...cell.cell.row.original.arrAns]);
    //               for (
    //                 let i = 0;
    //                 i < cell.cell.row.original?.arrAns?.length;
    //                 i++
    //               ) {
    //                 let obj = {
    //                   id: i + 1,
    //                   answer: cell.cell.row.original?.arrAns[i].answer_value,
    //                   checked:
    //                     cell.cell.row.original?.arrAns[i].answer_score == "true"
    //                       ? true
    //                       : false,
    //                 };
    //                 alldatapushed.push(obj);
    //                 //
    //                 setallanswers([...alldatapushed]);
    //               }
    //             }}
    //             className="btn btn-success"
    //           >
    //             Update
    //           </button>
    //         ) : null}
    //       </>
    //     );
    //   },
    // },

    // {
    //   Header: 'Status',
    //   Cell: (cell) => {
    //     if (
    //       permissions?.includes("*6_4") ||
    //       permissions?.startsWith("6_4") ||
    //       permissions == "all"
    //     )
    //       switch (cell.cell.row.original.hidden) {
    //         case 'no':
    //           return (
    //             <div
    //               style={{ cursor: 'pointer' }}
    //               onClick={() => {
    //                 setshowconf(true);
    //                 setrowdata({
    //                   ...cell.cell.row.original,
    //                   number: cell.cell.row.index + 1,
    //                 });
    //                 // const item = cell.cell.row.original;
    //                 // const send_data = {
    //                 //   hidden_value: item.hidden == "no" ? "yes" : "no",
    //                 //   wq_id: item.wq_id
    //                 // }
    //                 // showHideQuestions(send_data)
    //               }}
    //             >
    //               <Visibility className="shown" />
    //             </div>
    //           );

    //         case 'yes':
    //           return (
    //             <div
    //               style={{ cursor: 'pointer' }}
    //               onClick={() => {
    //                 setshowconf(true);
    //                 setrowdata({
    //                   ...cell.cell.row.original,
    //                   number: cell.cell.row.index + 1,
    //                 });
    //               }}
    //             >
    //               <VisibilityOff className="hidden" />
    //             </div>
    //           );

    //         default:
    //           return (
    //             <span className="badge badge-pill badge-soft-success font-size-12">
    //               {cell.cell.row.original.hidden}
    //             </span>
    //           );
    //       }
    //   },
    // },
  ];

  const handlesavetxt = (e, i, id) => {
    // console.log(id)
    // console.log(i)
    //
    // console.log(i)
    // console.log(txt)
    // ;
    const list = [...allanswers];
    //
    list[i]["answer"] = e.target.value;
    // setanswersArray(list);
    setallanswers(list);
  };
  const [videos, setvideos] = useState([]);
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

  const deleteAssign = async () => {
    setLoader(true);
    await axios
      .post(
        "https://camp-coding.tech/quest/platform/admin/cases_tasks/delete_from_assign.php",
        {
          case_task_mcq_id: unAssign?.case_task_mcq_id,
        }
      )
      .then((res) => {
        toast.info(res?.message);
        getmcqQuestions();
      })
      .catch((err) => err);
    setLoader(false);
  };
  const deleteImage = (deletedIndex) => {
    setOverAllImages(
      overAllImages.filter((item, index) => {
        return index != deletedIndex;
      })
    );
  };

  const deleteExpImage = (deletedIndex) => {
    setExpImages(
      expImages.filter((item, index) => {
        return index != deletedIndex;
      })
    );
  };

  // const addImage = (image) => {
  //   overAllImages?.push(image)
  //   setOverAllImages([])
  // }

  const [showEdit, setShowEdit] = useState(false);
  const [Courses, setCourses] = useState(false);
  const [allanswers, setallanswers] = useState([]);
  const [showCopy, setsetShowCopy] = useState(false);
  const [units, setUnits] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(false);
  const [overallImg, setOverallImg] = useState(false);
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState("");
  // setOverallImg
  const handleuploadOverallimg = () => {
    setuploadloading(true);
    const formdata = new FormData();
    formdata.append("image", overallImg);
    axios
      .post(
        "https://camp-coding.tech/quest/platform/admin/image_uplouder.php",
        formdata
      )
      .then((res) => {
        setrowdata({ ...rowdata, overall_image: res });
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setuploadloading(false);
      });
  };

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
    if (moveData || showCopy) getCourses();
  }, [showCopy, moveData]);

  const getUnits = async () => {
    const send_data = {
      course_id: moveData
        ? location?.state?.unitData?.course_id
        : selectedCourse,
    };
    try {
      const units = await axios.post(
        "https://camp-coding.tech/quest/platform/admin/courses/select_course_units.php",
        send_data
      );
      setUnits([...units]);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (selectedCourse) getUnits();
  }, [selectedCourse, moveData]);

  // useEffect(() => {
  //   getUnits();
  // }, [selectedCourse]);
  const getTopics = () => {
    const data_send = {
      course_id: location?.state?.unitData?.course_id,
      unit_id: moveData?.unit_id ? moveData?.unit_id : selectedUnit,
    };
    axios
      .post(
        "https://camp-coding.tech/quest/platform/admin/mcq/topics/select_topics.php",
        JSON.stringify(data_send)
      )
      .then((res) => {
        if (Array.isArray(res.message)) {
          setTopics(res.message);
          if (moveData?.unit_id) setUnitTopics(res?.message);
        }
        setSelectedTopic(res?.message[0]?.topic_id);
      });
  };
  useEffect(() => {
    if (selectedUnit || moveData) getTopics();
  }, [selectedUnit, moveData]);

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

  const [copyData, setCopyData] = useState({
    question_text: "",
    answers: "",
    valid_answer: "",
    exam_id: "0",
    topic_id: "",
    question_image_url: "",
    help_text: "",
    help_pdf: "",
    help_video: "",
    help_pdf_page: "",
    video_time: "",
    question_key_words: "",
    topic_label: "",
    overall_image: "",
    overall: "",
  });
  const [answerlist, setanswerlist] = useState([
    { question_id: 0, answer_value: "", answer_score: false },
  ]);
  const [answers, setAnswers] = useState(false);
  const [correctness, setCorrectness] = useState(false);
  const getAnswers = async (id) => {
    setAnswersLoading(true);
    try {
      const answers = await axios.post(
        "https://camp-coding.tech/quest/platform/admin/mcq/new_mcq/answers/select_answers.php",
        {
          question_id: id ? id : copyData?.question_id,
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

  useEffect(() => {
    if (copyData) getAnswers();
  }, [copyData]);
  useEffect(() => {
    if (
      answers &&
      answers?.length &&
      answers?.filter((item) => item?.answer_score)?.length
    ) {
      setCorrectness(true);
    }
  }, [answers]);
  const [uploadLoading, setUploadLoading] = useState(false);
  const addAllImages = async () => {
    setUploadLoading(true);
    await newImages.map(async (item, index) => {
      const formData = new FormData();
      formData.append("image", item);
      const imageUploadResponse = await axios.post(
        "https://camp-coding.tech/quest/platform/admin/" + "image_uplouder.php",
        formData
      );
      if (imageUploadResponse) {
        setNewImages(newImages.filter((n_item, n_index) => n_index != index));
        overAllImages.push(imageUploadResponse);
        setOverAllImages([...overAllImages]);
      } else {
        toast?.error("حدث خطأ أثناء رفع الصورة ");
        setLoading(false);
      }
    });
    setUploadLoading(false);
  };
  const [updateImages, setUpdateImages] = useState(false);
  const handleUpdateImages = async () => {
    setUpdateImages(true);
    delete questionOpen?.arrAns;
    delete questionOpen?.array_overall_image;
    axios
      .post(
        "https://camp-coding.tech/quest/platform/admin/mcq/new_mcq/update_mcq.php",
        {
          ...questionOpen,
          overall_image: overAllImages?.join("**matary**"),
        }
      )
      .then((res) => {
        if (res.status == "success") {
          setOverAllImages(null);
          getmcqQuestions();
          toast.success(res.message);
        } else {
          toast.error(res.message);
        }
      })
      .catch((err) => err)
      .finally(() => setUpdateImages(false));
  };

  const handleUpdateAnswerImages = async () => {
    setUpdateImages(true);
    delete answerOpen?.array_explanation_image;
    axios
      .post(
        "https://camp-coding.tech/quest/platform/admin/mcq/new_mcq/answers/edit_answer.php",
        {
          ...answerOpen,
          answer_explanation_img: expImages?.join("**matary**"),
        }
      )
      .then((res) => {
        if (res.status == "success") {
          setExpImages(null);
          getAnswers(answers[0]?.question_id);
          toast.success(res.message);
        } else {
          toast.error(res.message);
        }
      })
      .catch((err) => err)
      .finally(() => setUpdateImages(false));
  };
  const handleMoveQuestion = () => {
    setLoading(true);
    const data_send = {
      question_id: moveData?.question_id,
      unit_id: moveData?.unit_id,
      new_topic_label: moveData?.new_topic_label,
    };

    axios
      .post(
        "https://camp-coding.tech/quest/platform/admin/mcq/topics/move_question.php",
        JSON.stringify(data_send)
      )
      .then((res) => {
        if (res.status == "success") {
          setMoveData(false);
          toast.success("Question has Moved successfully");
          getmcqQuestions();
        } else if (res.status == "error") {
          toast.error("Question has not Moved");
        } else {
          toast.error("Something Went Error");
        }
      })
      .catch((err) => console.log(err))
      .finally((done) => {
        setLoading(false);
      });
  };

  const handleCopyQuestion = () => {
    setLoading(true);
    const data_send = {
      ...copyData,
      unit_id: selectedUnit,
      course_id: selectedCourse,
      overall_image: copyData?.array_overall_image?.join("**matary**"),
    };

    delete data_send?.array_overall_image;

    axios
      .post(
        "https://camp-coding.tech/quest/platform/admin/mcq/new_mcq/insert_mcq.php",
        JSON.stringify(data_send)
      )
      .then((res) => {
        if (res.status == "success") {
          setsetShowCopy(false);
          toast.success("Question has Copied successfully");
          copyData?.arrAns?.map(async (item) => {
            item.question_id = res?.message;
            // item.answer_explanation_img = item?.answer_explanation_image;
            // https://camp-coding.tech/quest/platform/admin/mcq/new_mcq/answers/edit_true_answers.php
            let xx = null;
            await axios
              .post(
                "https://camp-coding.tech/quest/platform/admin/mcq/new_mcq/answers/insert_answer.php",
                JSON.stringify(item)
              )
              .then(async (res) => {
                if (res.status == "success") {
                  xx = res?.message;
                  console.log(item?.answer_score);
                  if (item?.answer_score == "true") {
                    await axios
                      .post(
                        "https://camp-coding.tech/quest/platform/admin/mcq/new_mcq/answers/edit_true_answers.php",
                        JSON.stringify({
                          question_id: item.question_id,
                          unit_qs_answer_id: xx,
                        })
                      )
                      .then((res) => {
                        if (res.status == "success") {
                          toast.success(
                            "Answer has Submitted As True successfully"
                          );
                        } else if (res.status == "error") {
                          toast.error("Answer has not added");
                        } else {
                          toast.error("Something Went Error");
                        }
                      })
                      .catch((err) => console.log(err));
                  }
                  toast.success("Answer has added successfully");
                } else if (res.status == "error") {
                  toast.error("Answer has not added");
                } else {
                  toast.error("Something Went Error");
                }
              })
              .catch((err) => console.log(err))
              .finally((done) => {
                setLoading(false);
              });
          });
        } else if (res.status == "error") {
          toast.error("Question has not added");
        } else {
          toast.error("Something Went Error");
        }
      })
      .catch((err) => console.log(err))
      .finally((done) => {
        setLoading(false);
      });
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
  useEffect(() => {
    if (isModalOpen || showEdit) {
      getEbooks();
      getvideos();
    }
  }, [isModalOpen, showEdit]);
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
  const ModelAnswersColumns = [
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
      Header: "explanation Images",
      Cell: (cell) => {
        return (
          <>
            {" "}
            <button
              className="btn btn-success"
              onClick={() => {
                setAnswerOpen(cell.cell.row.original);

                return setExpImages(
                  cell.cell.row.original.array_explanation_image
                );
                // navigate("/answers", {
                //   state: {
                //     questionData: cell.cell.row.original,
                //     topicData: topicData,
                //     questions: JSON.stringify(Units),
                //   },
                // })
              }}
            >
              {"Explanation Images"}
            </button>
          </>
        );
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
  const [isModelAnswerOpen, setIsModalAnswerOpen] = useState(false);
  const [addAnswer, setAddAnswer] = useState({});
  const [showChooseCorrectAnswer, setShowChooseCorrectAnswer] = useState(false);
  const [selectedCorrected, setSelectedCorrected] = useState(false);
  const [rowData, setRowData] = useState({});

  const handleuploadAnswerimg = async (update) => {
    const overAllImages = [];
    console.log(img);
    if (img?.length) {
      setuploadloading(true);
      delete img?.length;
      delete expImages?.length;
      await Promise.all(
        Object.values(img)?.map(async (item) => {
          const formdata = new FormData();
          formdata.append("image", item);
          await axios
            .post(
              "https://camp-coding.tech/quest/platform/admin/image_uplouder.php",
              formdata
            )
            .then((res) => {
              overAllImages.push(res);
            })
            .catch((err) => console.log(err))
            .finally(() => {
              setuploadloading(false);
            });
        })
      );
      setuploadloading(false);
      setAddAnswer({
        ...addAnswer,
        answer_Explain_image: overAllImages?.join("**matary**"),
      });
      expImages && setExpImages([...expImages, ...overAllImages]);
    }
  };

  const handleuploadExpimg = async (update) => {
    const overAllImages = [];
    console.log(newExpsImages);
    if (newExpsImages?.length) {
      setuploadloading(true);
      // delete newExpsImages?.length;
      await Promise.all(
        newExpsImages?.map(async (item) => {
          const formdata = new FormData();
          formdata.append("image", item);
          await axios
            .post(
              "https://camp-coding.tech/quest/platform/admin/image_uplouder.php",
              formdata
            )
            .then((res) => {
              overAllImages.push(res);
            })
            .catch((err) => console.log(err))
            .finally(() => {
              setuploadloading(false);
            });
        })
      );
      setuploadloading(false);
      expImages && setExpImages([...expImages, ...overAllImages]);
    }
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
  return (
    <React.Fragment>
      {" "}
      {Units && Units.length ? (
        <TableContainer
          columns={columns}
          data={Units}
          isGlobalFilter={true}
          customPageSize={10}
          className="Invoice table"
        />
      ) : !Units.length ? (
        <h2>No Questions</h2>
      ) : (
        <Loader />
      )}
      <Modal title="Copy Question" isOpen={showCopy}>
        <form
          action="#"
          style={{
            padding: "15px",
            display: "flex",
            flexDirection: "column",
          }}
          onSubmit={(e) => {
            e.preventDefault();
            return !loading ? handleCopyQuestion(e) : null;
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
                        {item.university_name} - {item.grade_name} -{" "}
                        {item.course_name}
                      </MenuItem>
                    );
                  })
                ) : (
                  <h3>No Courses</h3>
                )}
              </Select>
              {selectedCourse && units && units.length ? (
                <div className="input_Field">
                  <Select
                    style={{
                      width: "100%",
                      borderRadius: "4px",
                      margin: "10px 0",
                    }}
                    type="text"
                    name="unit_id"
                    id="unit_id"
                    placeholder="Choose Unit"
                    onChange={(e) => setSelectedUnit(e.target.value)}
                  >
                    {units.map((item, index) => {
                      return (
                        <MenuItem value={item.unit_id} key={index}>
                          {item.unit_name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </div>
              ) : (
                <h3>No Units In Course</h3>
              )}
            </div>
          </div>
          <button
            className="btn btn-success"
            style={{ margin: "10px 0 0 auto" }}
          >
            {" "}
            {!loading ? "Copy Question" : <Loader />}{" "}
          </button>
        </form>
      </Modal>
      <Modal title="Move Question" isOpen={moveData}>
        <form
          action="#"
          style={{
            padding: "15px",
            display: "flex",
            flexDirection: "column",
          }}
          onSubmit={(e) => {
            e.preventDefault();
            return !loading ? handleMoveQuestion(e) : null;
          }}
        >
          <CloseButton
            onClick={() => setMoveData(false)}
            style={{ marginLeft: "auto" }}
          />
          {/* Units
          <div className="input_Field">
            <div className="input_Field">
              {units && units.length ? (
                <div className="input_Field">
                  <Select
                    style={{
                      width: "100%",
                      borderRadius: "4px",
                      margin: "10px 0",
                    }}
                    type="text"
                    name="unit_id"
                    id="unit_id"
                    placeholder="Choose Unit"
                    onChange={(e) =>
                      setMoveData({ ...moveData, unit_id: e.target.value })
                    }
                    required
                  >
                    {units.map((item, index) => {
                      return (
                        <MenuItem value={item.unit_id} key={index}>
                          {item.unit_name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </div>
              ) : (
                <h3>No Units In Course</h3>
              )}
            </div>
          </div> */}
          Topics
          <div className="input_Field">
            <div className="input_Field">
              {unitTopics && unitTopics.length ? (
                <div className="input_Field">
                  <Select
                    style={{
                      width: "100%",
                      borderRadius: "4px",
                      margin: "10px 0",
                    }}
                    type="text"
                    name="unit_id"
                    id="unit_id"
                    placeholder="Choose Unit"
                    onChange={(e) =>
                      setMoveData({
                        ...moveData,
                        new_topic_label: e.target.value,
                      })
                    }
                    required
                  >
                    {unitTopics.map((item, index) => {
                      return (
                        <MenuItem value={item.topic_label} key={index}>
                          {item.topic_label}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </div>
              ) : (
                <h3>No Topics</h3>
              )}
            </div>
          </div>
          <button
            className="btn btn-success"
            style={{ margin: "10px 0 0 auto" }}
          >
            {" "}
            {!loading ? "Move Question" : <Loader />}{" "}
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
            {/* <div className="position-relative">
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
            </div> */}
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
      </div>
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

          <div className="inputField withtext upimgdiv">
            <label htmlFor="exam_img">Answer Explain image</label>
            <input
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
              multiple={true}
              onChange={(e) => {
                setimg(e.target.files);
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
                src={require("../../assets/images/upload.png")}
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
      <Modal title="Edit question" isOpen={isModalOpen}>
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
            // setIsModalOpen(false);
          }}
        >
          <CloseButton
            onClick={() => setIsModalOpen(false)}
            style={{ marginLeft: "auto" }}
          />
          <div className="inputField withtext">
            <label htmlFor="exam_name">Topic Title</label>
            <Input
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "4px",
              }}
              type="text"
              name="exam_name"
              id="exam_name"
              placeholder="Topic Title"
              // required
              value={rowdata.topic_label}
              onChange={(e) => {
                setrowdata({ ...rowdata, topic_label: e.target.value });
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
              value={rowdata.question_text}
              onChange={(e) => {
                setrowdata({ ...rowdata, question_text: e.target.value });
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
              value={rowdata.overall}
              onChange={(e) => {
                setrowdata({ ...rowdata, overall: e.target.value });
                // setexamdata({...examdata,exam_name:e.target.value})
              }}
            />
          </div>
          {/* <div className="inputField withtext upimgdiv">
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
                setOverallImg(e.target.files[0]);
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
                src={require("../../../assets/images/upload.png")}
                alt=""
              />
            )}
          </div> */}
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

          {/* <div className="inputField withtext">
            <label htmlFor="exam_name">Help Video</label>
            <select
              onChange={(e) => {
                setrowdata({ ...rowdata, help_video: e.target.value });
              }}
              value={rowdata.help_video}
              defaultValue={rowdata?.help_video?.video_id}
              className="form-control"
            >
              {videos.map((item) => {
                return (
                  <option value={item.video_id}>{item.video_title}</option>
                );
              })}
            </select>
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
                  setSelectedCourse(null);
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
                  setSelectedCourse(null);
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
                onChange={(e) => {
                  setVideoDataR(false);
                  setSelectedCourse(null);
                  setrowdata({ ...rowdata, help_pdf: e.target.value });
                }}
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
                      value: item?.book_id,
                    };
                  })}
                  style={{ width: 224 }}
                  required
                  onChange={(e) => {
                    setVideoDataR(false);
                    setSelectedCourse(null);
                    setrowdata({ ...rowdata, help_pdf: e });
                  }}
                />
              </>
            ) : (
              <h3>No Books</h3>
            )
          ) : null}
          <div className="mb-3">
            <label className="form-label" htmlFor="coursename">
              help page
            </label>
            <input
              id="pdf_page"
              name="pdf_page"
              type="text"
              className="form-control"
              value={rowdata?.pdf_page}
              onChange={(e) => {
                console.log("Help", e.target.value);
                setrowdata({
                  ...rowdata,
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
              value={rowdata?.video_time}
              onChange={(e) => {
                setrowdata({
                  ...rowdata,
                  video_time: e.target.value
                });
              }}
            />
          </div> */}

          <div className="mb-3">
            <label className="form-label" htmlFor="coursename">
              KeyWords
            </label>
            <input
              id="question_key_words"
              name="question_key_words"
              type="text"
              className="form-control"
              value={rowdata?.question_key_words}
              onChange={(e) => {
                setrowdata({
                  ...rowdata,
                  question_key_words: e.target.value,
                });
              }}
            />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="help_text">
              help Text
            </label>
            <textarea
              id="help_text"
              name="help_text"
              type="text"
              className="form-control"
              value={rowdata?.help_text}
              onChange={(e) => {
                setrowdata({
                  ...rowdata,
                  help_text: e.target.value,
                });
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
            Edit Question{" "}
          </button>
        </form>
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

          <div className="inputField withtext upimgdiv">
            <label htmlFor="exam_img">Answer Explain image</label>
            <input
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
              multiple={true}
              onChange={(e) => {
                setimg(e.target.files);
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
                src={require("../../assets/images/upload.png")}
                alt=""
              />
            )}
          </div>
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
      <Modal
        headerTitle={"Edit Overall Images"}
        isOpen={overAllImages}
        toggle={() => setOverAllImages(null)}
        children={
          <form action="#" onSubmit={(e) => e.preventDefault()}>
            <div className="links_images overAllImages">
              {overAllImages && overAllImages?.length ? (
                overAllImages?.map((item, index) => {
                  return (
                    <div className="postImage">
                      <img src={item} alt="" />
                      {/* <div
                      className="btn btn-danger"
                      onClick={() =>
                        loading
                          ? null
                          : deleteImage(index)
                      }
                    >
                      {loading ? <Loader /> : "Delete"}
                    </div> */}
                    </div>
                  );
                })
              ) : (
                <h1>No Images</h1>
              )}
            </div>
            {/* <h3>Add New Images</h3>
            <div className="links_new_images">
              <ImagesInput
                getImages={setNewImages}
                values={newImages}
                id={"overAllImages"}
                name={"newPostImages"}

              />
            </div>{" "} */}
            {/* {uploadLoading ? <Loader /> : <div className="btn btn-success" onClick={() => !uploadLoading ? addAllImages() : null}>Add Images</div>} */}

            {/* {<div className="btn btn-success" onClick={() => !uploadLoading ? handleUpdateImages() : null}>Update Images</div>} */}
          </form>
        }
      />
      <Modal
        headerTitle={"Edit Explanation Images"}
        isOpen={expImages}
        toggle={() => setExpImages(null)}
        children={
          <form action="#" onSubmit={(e) => e.preventDefault()}>
            <div className="links_images overAllImages">
              {expImages && expImages?.length ? (
                expImages?.map((item, index) => {
                  return (
                    <div className="postImage">
                      <img src={item} alt="" />
                      {/* <div
                      className="btn btn-danger"
                      onClick={() =>
                        loading
                          ? null
                          : deleteExpImage(index)
                      }
                    >
                      {loading ? <Loader /> : "Delete"}
                    </div> */}
                    </div>
                  );
                })
              ) : (
                <h1>No Images</h1>
              )}
            </div>
            {/* <h3>Add New Images</h3>
            <div className="links_new_images">
              <ImagesInput
                getImages={setNewExpsImages}
                values={newExpsImages}
                id={"overAllImages"}
                name={"newPostImages"}

              />
            </div>{" "} */}
            {/* {uploadLoading ? <Loader /> : <div className="btn btn-success" onClick={() => !uploadLoading ? handleuploadExpimg() : null}>Add Images</div>} */}

            {/* {<div className="btn btn-success" onClick={() => !uploadLoading ? handleUpdateAnswerImages() : null}>Update Images</div>} */}
          </form>
        }
      />
      <Modal
        headerTitle={"Un Assign Question"}
        isOpen={unAssign}
        toggle={() => setUnAssign(null)}
        children={
          <form action="#" onSubmit={(e) => e.preventDefault()}>
            <h3 style={{ padding: "20px" }}>Delete Assign Question ..?</h3>
            <div
              className="d-flex align-items-center"
              style={{ padding: "20px" }}
            >
              <button
                className="btn btn-primary"
                style={{ width: "fit-content", margin: "0 10px" }}
                onClick={() => {
                  deleteAssign();
                }}
              >
                Un Assign
              </button>
              <button
                className="btn btn-success"
                onClick={() => setUnAssign(null)}
              >
                Cencel
              </button>
            </div>{" "}
          </form>
        }
      />
    </React.Fragment>
  );
};

export default CasesMCQQuestionsList;
