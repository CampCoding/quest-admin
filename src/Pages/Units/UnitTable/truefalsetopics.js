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
import TrueFalseQuestion from "./TrueFalseQuestions/add";
import CopyTopic from "./TrueFalseQuestions/true&falseTopicsManagement/copyTopic";
import EditTopic from "./TrueFalseQuestions/true&falseTopicsManagement/editTopic";
import ShowHideTopic from "./TrueFalseQuestions/true&falseTopicsManagement/showHideTopic";
// import UniqQuestion from '../UniqQuestion';
const TrueFalseTopics = ({ Units, courseData, setshowconf, setrowdata }) => {
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
  const [TrueAndFalse_Show, setTrueAndFalseShow] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [Courses, setCourses] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(false);
  const [units, setUnits] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const DownloadAllQuestions = async (topic_label) => {
    setDownloadLoading(true);
    try {
      const Download = await axios.post(
        "https://camp-coding.tech/quest/platform/admin/excil_data/TrueAndFalse/mcq_data_by_topic.php",
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
      accessor: "topic_label",
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
    // {
    //   Header: "Print Questions",
    //   Cell: (cell) => {
    //     if (userData?.user_id == 37 || userData?.user_id == 27)
    //       return (
    //         <>
    //           {" "}
    //           {print ? (
    //             <Loader />
    //           ) : (
    //             <button
    //               class="btn btn-success"
    //               onClick={() => {
    //                 setPrints(cell?.cell?.row?.original);
    //               }}
    //             >
    //               Print
    //             </button>
    //           )}
    //         </>
    //       );
    //   },
    // },
    {
      Header: "Hidden",
      Cell: (cell) => {
        return (
          <button
            className="btn"
            onClick={() => {
              const item = cell.cell.row.original;

              setShowHideForm(item);
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
              setShowEditForm(cell.cell.row.original);
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
      Header: "Questions",
      Cell: (cell) => {
        return (
          <button
            className="btn btn-success"
            onClick={() => {
              const item = cell.cell.row.original;

              navigate("/TopicTrueFalseQuestionList", {
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

  const getTopics = async () => {
    const topic = await axios.post(
      "https://camp-coding.tech/quest/platform/admin/true_false_ques/topics/select_topics.php",
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
        ? "https://camp-coding.tech/quest/platform/admin/matching_qs/uploud_excel_file.php"
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
      setTrueAndFalseShow(false);

      form.reset();
    } else {
      toast.error(excelUploading.message);
    }
    setUploadLoading(false);
  };

  const permissions = userData?.permissions;

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
                                setTrueAndFalseShow(true);
                              }}
                            >
                              Upload TrueAndFalse Questions
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
                              Add TrueAndFalse Questions
                            </button>
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

        <ToastContainer />
      </div>
      <Modal title="Upload Excel File" isOpen={TrueAndFalse_Show}>
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
              setTrueAndFalseShow(false);
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
        <CloseButton
          onClick={() => setIsModalOpen(false)}
          style={{ marginLeft: "auto" }}
        />
        <TrueFalseQuestion
          unit_id={unitData?.unit_id}
          course_id={unitData?.course_id}
          getQuestions={getTopics}
          setIsModalOpen={setIsModalOpen}
        />
      </Modal>
      <Modal isOpen={showCopy} toggle={setsetShowCopy} close={setsetShowCopy}>
        <CloseButton
          onClick={() => setsetShowCopy(false)}
          style={{ marginLeft: "auto" }}
        />
        <CopyTopic
          unitData={unitData}
          setSelectedUnit={setSelectedUnit}
          selectedUnit={selectedUnit}
          selectedCourse={selectedCourse}
          setSelectedCourse={setSelectedCourse}
          getFunction={getTopics}
          topicData={showCopy}
          setTopicData={setsetShowCopy}
        />
      </Modal>
      <Modal
        isOpen={showEditForm}
        toggle={setShowEditForm}
        close={setShowEditForm}
      >
        <CloseButton
          onClick={() => setShowEditForm(false)}
          style={{ marginLeft: "auto" }}
        />
        <EditTopic
          unitData={unitData}
          setSelectedUnit={setSelectedUnit}
          selectedUnit={selectedUnit}
          selectedCourse={selectedCourse}
          setSelectedCourse={setSelectedCourse}
          getFunction={getTopics}
          topicData={showEditForm}
          setTopicData={setShowEditForm}
        />
      </Modal>
      <Modal
        isOpen={showHideForm}
        toggle={setShowHideForm}
        close={setShowHideForm}
      >
        <CloseButton
          onClick={() => setShowHideForm(false)}
          style={{ marginLeft: "auto" }}
        />
        <ShowHideTopic
          unitData={unitData}
          setSelectedUnit={setSelectedUnit}
          selectedUnit={selectedUnit}
          selectedCourse={selectedCourse}
          setSelectedCourse={setSelectedCourse}
          getFunction={getTopics}
          topicData={showHideForm}
          setTopicData={setShowHideForm}
        />
      </Modal>
    </React.Fragment>
  );
};

export default TrueFalseTopics;
