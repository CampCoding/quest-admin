import React, { useEffect, useState } from "react";
import {
  CloseButton,
  Row,
  Col,
  Container,
  Modal,
  TabContent,
  TabPane,
  Tooltip,
  Card,
  CardBody,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  Input,
  Label,
  ModalBody,
  ModalHeader,
} from "reactstrap";

// import TableContainer from "./../../../../components/Common/TableContainer";
// import { CourseData } from "../../../../CommonData/Data/Course";
import { useLocation, useNavigate } from "react-router-dom";
import TableContainer from "../../../components/Common/TableContainer";
import axios from "axios";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Form, Loader, RadioGroup, SelectPicker, Toggle } from "rsuite";
import { ToastContainer, toast } from "react-toastify";
import { MenuItem, Radio, Select } from "@mui/material";
import { Icon } from "@iconify/react";
import { userData } from "../../../store/getProfileData";
import ExportFile from "./export";
// import UniqQuestion from '../UniqQuestion';
const Topics = ({ Units, courseData, setshowconf, setrowdata }) => {
  const navigate = useNavigate();
  const location = useLocation();
  Units = location?.state?.units;
  courseData = location?.state?.courseData;
  //   alert(JSON.stringify(courseData))
  const unitData = location?.state?.unitData;
  // https://camp-coding.tech/quest/platform/admin/unit/make_copy_from_unit_and_alldata.php
  const [showCopy, setsetShowCopy] = useState(false);

  const [topics, setTopics] = useState(false);
  const [selectedTopic, setselectedTopic] = useState(false);
  const [showHideForm, setShowHideForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [MCQ_Show, setMCQShow] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [Courses, setCourses] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(false);
  const [units, setUnits] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const DownloadAllQuestions = async (topic_label) => {
    setDownloadLoading(true);
    try {
      const Download = await axios.post(
        "https://camp-coding.tech/quest/platform/admin/excil_data/MCQ/mcq_data_by_topic.php",
        {
          course_id: unitData?.course_id,
          unit_id: unitData?.unit_id,
          topic_label,
        }
      );
      window.open(Download, "_blanck");
      setDownloadLoading(false);
    } catch (e) {
      console.log(e);
      setDownloadLoading(false);
    }
  };
  const getCourses = async () => {
    const courses = await axios.get(
      "https://camp-coding.tech/quest/platform/admin/courses/select_courses.php"
    );
    setCourses([...courses]);
  };
  useEffect(() => {
    getCourses();
  }, [showCopy]);
  const getUnits = async () => {
    const send_data = {
      course_id: selectedCourse,
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
  const [print, setPrint] = useState(false);
  const [solved, setSolved] = useState(true);
  const [prints, setPrints] = useState(false);

  const [images, setImages] = useState(true);
  const PrintAllQuestions = async (unit_id, topic_label) => {
    console.log(prints);
    const link =
      solved && images
        ? "print_topic_mcqs"
        : solved && !images
        ? "print_topic_mcq_without_images"
        : !solved && images
        ? "print_topic_mcqs_not_solved"
        : !solved && !images
        ? "print_topic_mcq_not_solved_without_images"
        : null;
    setPrint(true);
    try {
      window.open(
        "https://camp-coding.tech/quest/platform/admin/mcq_print/print/" +
          link +
          ".php" +
          "?id=" +
          unit_id +
          "&label=" +
          topic_label?.split("&")?.join("*camp*"),

        "_blanck"
      );
      setPrint(false);
    } catch (e) {
      console.log(e);
      setPrint(false);
    }
  };
  useEffect(() => {
    getUnits();
  }, [selectedCourse]);
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
  const [exportFile, setExportFile] = useState();
  localStorage.removeItem("qs");
  const columns = [
    {
      Header: "No",
      Cell: (cell) => {
        return <b>{cell.cell.row.index + 1}</b>;
      },
    },
    {
      Header: "Topic Title",
      accessor: "name",
    },
    {
      Header: "Topic Copy",
      Cell: (cell) => {
        return (
          <button
            className="btn btn-success"
            onClick={() => setsetShowCopy(cell.cell.row.original)}
          >
            Copy
          </button>
        );
      },
    },
    {
      Header: "Print Questions",
      Cell: (cell) => {
        if (userData?.user_id == 37 || userData?.user_id == 27)
          return (
            <>
              {" "}
              {print ? (
                <Loader />
              ) : (
                <button
                  class="btn btn-success"
                  onClick={() => {
                    // alert(JSON.stringify(cell?.cell?.row?.original))
                    setPrints(cell?.cell?.row?.original);
                  }}
                >
                  Print
                </button>
              )}
            </>
          );
      },
    },
    {
      Header: "Hidden",
      Cell: (cell) => {
        return (
          <button
            className="btn"
            onClick={() => {
              const item = cell.cell.row.original;

              showHiddenForm();
              setselectedTopic(cell.cell.row.original);
            }}
          >
            {cell.cell.row.original.hidden == "yes" ? (
              <VisibilityOff className="hidden" />
            ) : (
              <Visibility className="shown" />
            )}
          </button>
        );
      },
    },
    {
      Header: "Edit",
      Cell: (cell) => {
        return (
          <button
            className="btn"
            onClick={() => {
              const item = cell.cell.row.original;
              setShowEditForm(true);
              setselectedTopic(cell.cell.row.original);
            }}
          >
            Edit
          </button>
        );
      },
    },
    {
      Header: "Download",
      Cell: (cell) => {
        return (
          <>
            {" "}
            {userData?.user_id == 37 || userData?.user_id == 27 ? (
              <>
                {downloadLoading ? (
                  <Loader />
                ) : (
                  <button
                    class="btn btn-success"
                    onClick={() => {
                      DownloadAllQuestions(cell?.cell?.row?.original?.name);
                    }}
                  >
                    Download
                  </button>
                )}
              </>
            ) : null}
          </>
        );
      },
    },
    {
      Header: "Download Test Center",
      Cell: (cell) => {
        return (
          <>
            {" "}
            {userData?.user_id == 37 || userData?.user_id == 27 ? (
              <>
                <button
                  class="btn btn-success"
                  onClick={() => {
                    setExportFile(cell?.cell?.row?.original);
                  }}
                >
                  Download
                </button>
              </>
            ) : null}
          </>
        );
      },
    },
    {
      Header: "Questions",
      Cell: (cell) => {
        return (
          <button
            className="btn btn-success"
            onClick={() => {
              const item = cell.cell.row.original;

              navigate("/TopicMcqQuestionList", {
                state: {
                  unitData: unitData,
                  topicData: cell.cell.row.original,
                },
              });
            }}
          >
            Questions
          </button>
        );
      },
    },
  ];
  const handleEditTopic = (e) => {
    const data_send = {
      old_topic_name: selectedTopic?.topic_label,
      new_topic_name: e?.target?.topicNewName?.value,
      unit_id: unitData?.unit_id,
    };
    axios
      .post(
        "https://camp-coding.tech/quest/platform/admin/topics/edit_mcq_topic.php",
        JSON.stringify(data_send)
      )
      .then((res) => {
        if (res.status == "success") {
          toast.success("Success");
          setselectedTopic(false);
          getTopics();
          e?.target?.reset();
          showEdittedForm();
        } else if (res.status == "error") {
          toast.error(res.message);
        } else {
          toast.error("Something Went Error");
        }
      });
  };
  const handleAddTopic = (e) => {
    const data_send = {
      topic_name: e?.target?.topicNewName?.value,
      course_id: unitData?.course_id,
      unit_id: unitData?.unit_id,
    };
    axios
      .post(
        "https://camp-coding.tech/quest/platform/admin/mcq/topics/add_topic.php",
        JSON.stringify(data_send)
      )
      .then((res) => {
        if (res.status == "success") {
          toast.success("Success");
          showAddedForm();
          getTopics();
          e?.target?.reset();
        } else if (res.status == "error") {
          toast.error(res.message);
        } else {
          toast.error("Something Went Error");
        }
      });
  };

  //   alert(JSON.stringify(unitData?.course_id))
  const getTopics = async () => {
    const topic = await axios.post(
      "https://camp-coding.tech/quest/platform/admin/mcq/topics/select_topics.php",
      {
        course_id: unitData?.course_id,
        unit_id: unitData?.unit_id,
      }
    );
    if (topic.message) {
      setTopics([...topic.message]);
    } else {
      setTopics([]);
    }
  };

  useEffect(() => {
    getTopics();
  }, []);

  useEffect(() => {
    if (MCQ_Show) getFolders();
  }, [MCQ_Show]);

  const [book, setBook] = useState(false);
  const [uploadloading, setuploadloading] = useState(false);

  const [inputList, setinputList] = useState([
    { answer: "", explanation: "", id: 1 },
  ]);
  const [numberOfPages, setNumberOfPages] = useState(false);
  const [answersArray, setanswersArray] = useState([]);
  const [book_url, setBookUrl] = useState(false);

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
  const [selectanswer, setselectanswer] = useState("");
  const [img, setimg] = useState("");
  const [answerlist, setanswerlist] = useState([
    { id: 0, answer: "", checked: false },
  ]);
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
      unit_id: unitData?.unit_id,
      question_text: addquestiondata.question_text,
      answers,
      valid_answer,
      exam_id: "0",
      course_id: unitData?.course_id,
      question_image_url: addquestiondata.question_image_url,
      help_text: addquestiondata.help_text,
      help_pdf: searchValue,
      // help_video: addquestiondata?.help_video,
      help_pdf_page: addquestiondata.pdf_page,
      video_time: addquestiondata?.video_time,
      key_words: addquestiondata.question_key_words,
      topic_label: addquestiondata?.topic_label,
      overall_image: addquestiondata?.overall_image?.join("**matary**"),
      overall: addquestiondata?.overall,
    };

    axios
      .post(
        "https://camp-coding.tech/quest/platform/admin/mcq/new_mcq/insert_mcq.php",
        JSON.stringify(data_send)
      )
      .then((res) => {
        if (res.status == "success") {
          getTopics();
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
  const showHideTopic = () => {
    axios
      .post(
        "https://camp-coding.tech/quest/platform/admin/topics/hide_topic.php",
        {
          topic_id: selectedTopic?.topic_id,
          unit_id: selectedTopic?.unit_id,
          course_id: selectedTopic?.course_id,
          topic_name: selectedTopic?.topic_label,
          topic_label: selectedTopic?.topic_label,
          status: selectedTopic?.hidden == "no" ? "yes" : "no",
        }
      )
      .then((res) => {
        if (res.status == "success") {
          getTopics();
          showHiddenForm();
          setselectedTopic(false);
          toast.success("Status Changed Successfully");
        } else {
          toast.error(res?.message);
        }
      });
  };
  const showHiddenForm = () => setShowHideForm(!showHideForm);
  const showEdittedForm = () => setShowEditForm(!showEditForm);
  const showAddedForm = () => setShowAddForm(!showAddForm);
  const uploadExcel = async (e, type) => {
    setUploadLoading(true);
    const formData = new FormData(e?.target);
    const form = e.target;

    formData.append("file_attachment", e.target.file_attachment.files[0]);
    formData.append("course_id", unitData?.course_id);
    formData.append("unit_id", unitData?.unit_id);
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

  const handlecopyitem = () => {
    setLoading(true);
    axios
      .post(
        "https://camp-coding.tech/quest/platform/admin/mcq/topics/copy_topic.php",
        {
          old_unit_id: showCopy?.unit_id,
          old_course_id: showCopy?.course_id,
          topic_label: showCopy?.topic_label,
          new_unit_id: selectedUnit,
          new_course_id: selectedCourse,
        }
      )
      .then((res) => {
        if (res.status == "success") {
          toast.success("Copied");
        } else {
          toast.error(res.message);
        }
      })
      .catch((err) => toast.error(err?.message))
      .finally(() => {
        setLoading(false);
      });
  };
  const permissions = userData?.permissions;
  useEffect(() => {
    getEbooks();
  }, []);
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
  useEffect(() => {
    console.log(selectedTopic);
  }, [selectedTopic]);
  return (
    <React.Fragment>
      {" "}
      <div className="page-content">
        <Row>
          <Col lg={12}>
            <Card>
              <CardBody>
                <div className="position-relative">
                  <div className="modal-button mt-2">
                    <Row className="align-items-start">
                      <Col className="col-sm">
                        <div>
                          {permissions?.includes("*6_2") ||
                          permissions?.startsWith("6_2") ||
                          permissions == "all" ? (
                            <button
                              class="btn btn-success mp-09"
                              onClick={() => {
                                setMCQShow(true);
                              }}
                            >
                              Upload MCQ Questions
                            </button>
                          ) : null}
                          {permissions?.includes("*6_1") ||
                          permissions?.startsWith("6_1") ||
                          permissions == "all" ? (
                            <button
                              class="btn btn-success"
                              onClick={() => {
                                setIsModalOpen(true);
                              }}
                            >
                              Add MCQ Questions
                            </button>
                          ) : null}
                          {permissions?.includes("*6_2") ||
                          permissions?.startsWith("6_2") ||
                          permissions == "all" ? (
                            <a
                              href="https://camp-coding.site/qs-quest-temp.xlsx"
                              download="questions_template.xlsx"
                              className="btn btn-success mp-09"
                            >
                              Download Questions Template
                            </a>
                          ) : null}
                        </div>
                      </Col>
                    </Row>
                  </div>
                </div>
                <div id="table-invoices-list">
                  {topics && topics?.length ? (
                    <TableContainer
                      columns={columns}
                      data={topics}
                      isGlobalFilter={true}
                      customPageSize={10}
                      className="Invoice table"
                    />
                  ) : !topics?.length ? (
                    <h2>No Topics</h2>
                  ) : (
                    <Loader />
                  )}
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Modal
          title="Show\Hide Topic"
          isOpen={showHideForm}
          toggle={showHiddenForm}
        >
          <div className="modal_custom">
            <h2>Are You Sure ?</h2>
            <button
              className={
                selectedTopic?.hidden == "no"
                  ? "btn btn-danger"
                  : "btn btn-primary"
              }
              onClick={() => {
                showHideTopic();
              }}
            >
              change
            </button>
          </div>
        </Modal>
        <Modal
          title="Edit Topic"
          isOpen={showEditForm}
          toggle={showEdittedForm}
        >
          <form
            action="#"
            style={{
              padding: "15px",
              display: "flex",
              flexDirection: "column",
            }}
            onSubmit={(e) => {
              e.preventDefault();
              handleEditTopic(e);
            }}
          >
            <CloseButton
              onClick={() => showEdittedForm()}
              style={{ marginLeft: "auto" }}
            />

            <div className="input_Field">
              <label htmlFor="topicNewName">New Name</label>
              <Input
                type="text"
                name="topicNewName"
                id="topicNewName"
                defaultValue={selectedTopic?.topic_name}
              />
            </div>
            <button
              className="btn btn-success"
              style={{ margin: "10px 0 0 auto" }}
            >
              {" "}
              Edit{" "}
            </button>
          </form>
        </Modal>
        <Modal title="Add Topic" isOpen={showAddForm} toggle={showAddedForm}>
          <form
            action="#"
            style={{
              padding: "15px",
              display: "flex",
              flexDirection: "column",
            }}
            onSubmit={(e) => {
              e.preventDefault();
              handleAddTopic(e);
            }}
          >
            <CloseButton
              onClick={() => showAddedForm()}
              style={{ marginLeft: "auto" }}
            />

            <div className="input_Field">
              <label forHtml="topicNewName" className="withtext">
                New Name
              </label>
              <Input
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "4px",
                }}
                type="text"
                name="topicNewName"
                id="topicNewName"
                placeholder="Topic Name"
                required
              />
            </div>
            <button
              className="btn btn-success"
              style={{ margin: "10px 0 0 auto" }}
            >
              {" "}
              Add{" "}
            </button>
          </form>
        </Modal>
        <ToastContainer />
      </div>
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
          <p>{"Unit_name" + ": " + unitData?.unit_name}</p>
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
            setIsModalOpen(false);
          }}
        >
          <CloseButton
            onClick={() => setIsModalOpen(false)}
            style={{ marginLeft: "auto" }}
          />
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
              required
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
                src={require("../../../assets/images/upload.png")}
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
              required
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
                onChange={(e) => setSearchValue(e.currentTarget.value)}
                placeholder="Video Source ID"
              />
            </>
          ) : videoType == "vlist" ? (
            ebooks && ebooks.length ? (
              <>
                <SelectPicker
                  label="Select Video"
                  data={ebooks.map((item) => {
                    return {
                      label: item?.book_title,
                      value: item?.book_id,
                    };
                  })}
                  style={{ width: 224 }}
                  required
                  onChange={(e) => setSearchValue(e)}
                />
              </>
            ) : (
              <h3>No Topics</h3>
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
          {/* <div className="add_answer_question">
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <span>Add Answer</span>
              <span
                onClick={() => {
                  setanswerlist([
                    ...answerlist,
                    { id: answerlist.length, answer: '' }
                  ]);
                }}
                style={{ cursor: 'pointer', fontSize: '26px' }}
              >
                +
              </span>
            </label>
            {answerlist.map((item, index) => {
              return (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <textarea
                    onChange={(e) => {
                      handlesavetxt(e, index);
                    }}
                    style={{ marginBottom: '10px', width: '90%' }}
                    className="form-control"
                  ></textarea>
                  <input
                    onClick={() => {
                      // setanswerlist([...ans]);
                      let answerarr = [...answerlist];
                      setanswerlist(
                        answerarr.map((it, index) => {
                          if (item.id == it.id) {
                            return { ...it, checked: true };
                          } else return { ...it, checked: false };
                        })
                      );
                      // for(let i=0;i<answerarr.length;i++){
                      //   if()
                      // }
                      setaddquestiondata({
                        ...addquestiondata,
                        valid_answer: item.answer
                      });
                    }}
                    checked={item.checked}
                    type="checkbox"
                    name=""
                    id=""
                  />
                </div>
              );
            })}
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="coursename">
              explain
            </label>
            <textarea
              style={{ height: "100px" }}
              id="explain"
              name="explain"
              type="text"
              className="form-control"
              onChange={(e) => {
                setaddquestiondata({
                  ...addquestiondata,
                  explain: e.target.value
                });
              }}
            ></textarea>
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
            Add Question{" "}
          </button>
        </form>
      </Modal>
      <Modal isOpen={showCopy}>
        <ModalHeader tag="h4">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              alignItems: "center",
            }}
          >
            <h4> Copy Topic To Unit </h4>
            <CloseButton
              onClick={() => {
                setsetShowCopy(false);
                setSelectedCourse(false);
                setUnits(false);
              }}
              style={{ marginLeft: "auto" }}
            />
          </div>
        </ModalHeader>
        <ModalBody>
          <form
            action="#"
            style={{
              padding: "15px",
              display: "flex",
              flexDirection: "column",
            }}
            onSubmit={(e) => {
              e.preventDefault();
              return !loading ? handlecopyitem(e) : null;
            }}
          >
            {/* <label htmlFor="">New Label Title</label>
            <input
              type="text"
              value={showCopy?.topic_label}
              onChange={(e) =>
                setsetShowCopy({ ...showCopy, topic_label: e.target.value })
              }
            /> */}
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
                required
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
            </div>
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
            <button
              className="btn btn-success"
              style={{ margin: "10px 0 0 auto" }}
            >
              {" "}
              {!loading ? "Assign To Unit" : <Loader />}{" "}
            </button>
          </form>
        </ModalBody>
      </Modal>
      <div className="prints">
        <Modal isOpen={prints} toggle={setPrints}>
          <ModalHeader tag="h4" className={"printsCloumns"}>
            <h5>Print Questions</h5>{" "}
            <CloseButton
              onClick={() => setPrints(false)}
              style={{ marginLeft: "auto" }}
            />
          </ModalHeader>
          <ModalBody className={"prints"}>
            <div className="rowDiv btnsRowDiv">
              {/* <button
                onClick={() => {
                  PrintAllQuestions(
                    prints?.unit_id,
                    prints?.topic_label,
                    "print_topic_mcqs"
                  );
                }}
                className="btn btn-success"
              >
                Print solved + images
              </button>
              <button
                onClick={() => {
                  PrintAllQuestions(
                    prints?.unit_id,
                    prints?.topic_label,
                    "print_topic_mcq_without_images"
                  );
                }}
                className="btn btn-success"
              >
                Print solved + without-images
              </button>
              <button
                onClick={() => {
                  PrintAllQuestions(
                    prints?.unit_id,
                    prints?.topic_label,
                    "print_topic_mcqs_not_solved"
                  );
                }}
                className="btn btn-success"
              >
                Print not-solved + images
              </button>
              <button
                onClick={() => {
                  PrintAllQuestions(
                    prints?.unit_id,
                    prints?.topic_label,
                    "print_topic_mcq_not_solved_without_images"
                  );
                }}
                className="btn btn-success"
              >
                Print not-solved + without-images
              </button>{" "} */}
              <div className="printsCloumns">
                <div className="printsRowCol">
                  <span>Solved</span>
                  <div className="rowPrints">
                    <span>No</span>
                    <Toggle checked={solved} onChange={(e) => setSolved(e)} />
                    <span>Yes</span>{" "}
                  </div>
                </div>
                <div className="printsRowCol">
                  <span>Images</span>
                  <div className="rowPrints">
                    <span>Not Included</span>
                    <Toggle checked={images} onChange={(e) => setImages(e)} />
                    <span>Included</span>{" "}
                  </div>
                </div>
              </div>
            </div>
            <button
              style={{ margin: "10px", marginLeft: "auto" }}
              className="btn btn-success"
              onClick={() =>
                PrintAllQuestions(prints?.unit_id, prints?.topic_label)
              }
            >
              Print
            </button>
          </ModalBody>
        </Modal>
      </div>
      <ExportFile modal={exportFile} setModal={setExportFile} type={"topic"} />
    </React.Fragment>
  );
};

export default Topics;
