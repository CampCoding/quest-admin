import React, { useEffect, useState } from "react";
import {
  CloseButton,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
  Modal,
  Input,
  ModalHeader,
  ModalBody,
  Spinner,
} from "reactstrap";
// import TableContainer from "./../../../../components/Common/TableContainer";
// import { CourseData } from "../../../../CommonData/Data/Course";
import { useLocation, useNavigate } from "react-router-dom";
import TableContainer from "../../../components/Common/TableContainer";
import axios from "axios";
import {
  Paid,
  PaidRounded,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { Loader, Toggle } from "rsuite";
import { Icon } from "@iconify/react";
import transferUp from "@iconify/icons-mdi/transfer-up";
import transferDown from "@iconify/icons-mdi/transfer-down";
import { toast, ToastContainer } from "react-toastify";
import "../unit.css";
import { MenuItem, Select } from "@mui/material";
import { userData } from "../../../store/getProfileData";
import ExportFile from "./export";
import { DollarSign } from "feather-icons-react/build/IconComponents";
const UnitListTable = ({ courseData, setshowconf, setrowdata }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [units, setunits] = useState([]);
  const [showCopyPart, setShowCopyPart] = useState(false);
  // const [units, setUnits] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ids, setIds] = useState([]);
  const [showexport, setShowExportFile] = useState(null);
  const setStatus = async (unit_id, status) => {
    await axios
      .post(
        "https://camp-coding.tech/quest/platform/admin/arranging/arrange_units.php",
        {
          direction: status,
          unit_id: unit_id,
        }
      )
      .then((res) => {
        if (res.status == "success") {
          toast.success("Updated");
          getUnits();
        } else {
          toast.error(res.message);
        }
      });
  };
  const [checkedData, setCheckedData] = useState({
    open: false,
    loading: false,
    data: [],
    exam_id: null,
  });
  const checkExams = (examData) => {
    setCheckedData((prev) => ({
      ...prev,
      open: true,
      loading: true,
      unit_id: examData,
    }));
    const data_send = {
      unit_id: examData?.unit_id,
    };

    axios
      .post(
        "https://camp-coding.tech/quest/platform/admin/mcq/new_copy/check_unit_parts.php",
        {
          ...data_send,
        }
      )
      .then((res) => {
        setCheckedData((prev) => ({
          ...prev,
          open: true,
          loading: true,
          data: res?.message,
        }));
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setCheckedData((prev) => ({
          ...prev,
          loading: false,
        }));
      });
  };
  const [Units, setUnits] = useState(false);
  const [unit_id, setUnitId] = useState(false);
  const [MCQ_Show, setMCQShow] = useState(false);
  const [tweets_show, setTweetShow] = useState(false);
  const [wq_show, setWQShow] = useState(false);
  const [flash_show, setFlashShow] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [edit, setEdit] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const getUnits = async () => {
    const courses = await axios.post(
      "https://camp-coding.tech/quest/platform/admin/courses/select_course_units.php",
      {
        course_id: selectedCourse ? selectedCourse : courseData.course_id,
      }
    );
    if (selectedCourse) {
      setunits([...courses]?.reverse());
    } else {
      setUnits([...courses]?.reverse());
    }
  };

  const handleCopyQuestion = () => {
    setLoading(true);
    const data_send = {
      old_unit_id: showCopy,
      part_id: showCopyPart,
      new_unit_id: selectedUnit,
      new_course_id: selectedCourse,
    };

    axios
      .post(
        "https://camp-coding.tech/quest/platform/admin/mcq/new_copy/copy_part_mcqs.php",
        JSON.stringify(data_send)
      )
      .then((res) => {
        if (res.status == "success") {
          toast.success("Question has Copied successfully");
          setIds([...ids, showCopyPart]);
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

  const DownloadAllQuestions = async (unit_id) => {
    setDownloadLoading(true);
    try {
      const Download = await axios.post(
        "https://camp-coding.tech/quest/platform/admin/excil_data/MCQ/mcq_data.php",
        {
          course_id: courseData.course_id,
          unit_id,
        }
      );
      window.open(Download, "_blanck");
      setDownloadLoading(false);
    } catch (e) {
      console.log(e);
      setDownloadLoading(false);
    }
  };

  const MakeFree = async (unit_id) => {
    try {
      const Download = await axios.post(
        "https://camp-coding.tech/quest/platform/admin/unit/update_unit_free.php",
        {
          unit_id,
        }
      );

      console.log(Download);

      if (Download.status == "success") {
        getUnits();
        toast.success(Download.message);
      } else {
        toast.error(Download.message);
      }
    } catch (e) {
      console.log(e);
    }
  };

  // setEdit
  const uploadExcel = async (e, type) => {
    setUploadLoading(true);
    const formData = new FormData(e?.target);
    const form = e.target;
    console.log(
      courseData.course_id,
      unit_id.unit_id,
      e.target.file_attachment.files[0]
    );
    formData.append("file_attachment", e.target.file_attachment.files[0]);
    formData.append("course_id", courseData.course_id);
    formData.append("unit_id", unit_id?.unit_id);
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
      await getUnits();
      toast.success(
        "Uploaded Successfully - Number Of Pages: " + excelUploading
      );
      setWQShow(false);
      setMCQShow(false);
      setTweetShow(false);
      setFlashShow(false);
      form.reset();
    } else {
      toast.error(excelUploading.message);
    }
    setUploadLoading(false);
  };
  useEffect(() => {
    getUnits();
  }, []);

  useEffect(() => {
    console.log(unit_id);
  }, [unit_id]);
  const [print, setPrint] = useState(false);
  const [solved, setSolved] = useState(true);
  const [prints, setPrints] = useState(false);
  const [showCopyOriginal, setShowCopyOriginal] = useState(false);
  const [images, setImages] = useState(true);
  const PrintAllQuestions = async (exam_id, exam_name) => {
    console.log(prints);
    const link =
      solved && images
        ? "unit/print_unit_mcqs.php"
        : solved && !images
        ? "unit/print_unit_mcq_without_images.php"
        : !solved && images
        ? "unit/print_unit_mcqs_not_solved.php"
        : !solved && !images
        ? "unit/print_unit_mcq_not_solved_without_images.php"
        : null;
    setPrint(true);
    try {
      window.open(
        "https://camp-coding.tech/quest/platform/admin/mcq_print/print/" +
          link +
          "?id=" +
          exam_id +
          "&name=" +
          exam_name?.split("&")?.join("*camp*"),

        "_blanck"
      );
      setPrint(false);
    } catch (e) {
      console.log(e);
      setPrint(false);
    }
  };
  const columns = [
    {
      Header: "No",
      Cell: (cell) => {
        return <b>{cell?.cell?.row?.original?.order_no}</b>;
      },
    },
    {
      Header: "Unit Title",
      accessor: "unit_name",
      Cell: (cell) => {
        return (
          <div
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <span>{cell.cell.row.original.unit_name}</span>
            <div className="sorts_u">
              <span
                style={{ margin: "0 3px", cursor: "pointer" }}
                onClick={() => setStatus(cell.cell.row.original.unit_id, "up")}
              >
                <Icon
                  icon={transferUp}
                  color="green"
                  style={{ fontSize: "30px" }}
                />
              </span>
              <span
                style={{ margin: "0 3px", cursor: "pointer" }}
                onClick={() =>
                  setStatus(cell.cell.row.original.unit_id, "down")
                }
              >
                <Icon
                  icon={transferDown}
                  color="red"
                  style={{ fontSize: "30px" }}
                />
              </span>
            </div>
          </div>
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
          <>
            {permissions?.includes("*3_1") ||
            permissions?.startsWith("3_1") ||
            permissions == "all" ? (
              <button
                className="btn"
                onClick={() => {
                  const item = cell.cell.row.original;
                  const send_data = {
                    status: item.hidden,
                    unit_id: item.unit_id,
                  };
                  setshowconf(true);
                  setrowdata(send_data);
                }}
              >
                {cell.cell.row.original.hidden == "yes" ? (
                  <VisibilityOff className="hidden" />
                ) : (
                  <Visibility className="shown" />
                )}
              </button>
            ) : null}
          </>
        );
      },
    },
    {
      Header: "Free",
      Cell: (cell) => {
        return (
          <>
            {permissions?.includes("*3_1") ||
            permissions?.startsWith("3_1") ||
            permissions == "all" ? (
              <button
                className="btn"
                onClick={() => {
                  const item = cell.cell.row.original;
                  MakeFree(cell.cell.row.original.unit_id);
                }}
              >
                {cell.cell.row.original.free == "1" ? (
                  <Paid className="hidden" color="green" />
                ) : (
                  <PaidRounded className="shown" color="red" />
                )}
              </button>
            ) : null}
          </>
        );
      },
    },

    // {
    //     Header: 'Questions',
    //     Cell: (cell) => {
    //         return <button className="btn btn-success" onClick={
    //             () => {
    //                 const item = cell.cell.row.original;
    //                 const send_data = {
    //                   status: item.hidden,
    //                   unit_id: item.unit_id
    //                 }
    //                 setshowconf(true);
    //                 setrowdata(send_data)
    //                 navigate("/unitquestion",{state:{unitdata:item}})
    //             }
    //         }>
    //             Questions
    //         </button>
    //     }
    // },

    {
      Header: "View Unit",
      Cell: (cell) => {
        return (
          <button
            class="btn btn-success"
            onClick={() => {
              navigate("/lessons", {
                state: {
                  ...location.state,
                  coursedata: courseData,
                  unitData: cell.cell.row.original,
                },
              });
            }}
          >
            View
          </button>
        );
      },
    },

    // {
    //   Header: "Download All Questions",
    //   Cell: (cell) => {
    //     if (userData?.user_id == 37 || userData?.user_id == 27)
    //       return (
    //         <>
    //           {" "}
    //           {downloadLoading ? (
    //             <Loader />
    //           ) : (
    //             <button
    //               class="btn btn-success"
    //               onClick={() => {
    //                 DownloadAllQuestions(cell?.cell?.row?.original?.unit_id);
    //               }}
    //             >
    //               Download
    //             </button>
    //           )}
    //         </>
    //       );
    //   },
    // },

    // {
    //   Header: "Download Test Center Questions",
    //   Cell: (cell) => {
    //     if (userData?.user_id == 37 || userData?.user_id == 27)
    //       return (
    //         <>
    //           {" "}
    //           {downloadLoading ? (
    //             <Loader />
    //           ) : (
    //             <button
    //               class="btn btn-success"
    //               onClick={() => {
    //                 setShowExportFile(cell?.cell?.row?.original);
    //               }}
    //             >
    //               Download
    //             </button>
    //           )}
    //         </>
    //       );
    //   },
    // },
    // {
    //   Header: "Upload MCQ Excel File",
    //   Cell: (cell) => {
    //     return (
    //       <button
    //         class="btn btn-success"
    //         onClick={() => {
    //
    //           setUnitId(cell.cell.row.original);
    //           setMCQShow(true);
    //         }}
    //       >
    //         MCQ Questions
    //       </button>
    //     );
    //   }
    // },
    // {
    //   Header: "Upload Tweets Excel File",
    //   Cell: (cell) => {
    //     return (
    //       <button
    //         class="btn btn-success"
    //         onClick={() => {
    //
    //           setUnitId(cell.cell.row.original);
    //           setTweetShow(true);
    //         }}
    //       >
    //         Tweets
    //       </button>
    //     );
    //   }
    // },
    // {
    //   Header: "Upload Written Questions Excel File",
    //   Cell: (cell) => {
    //     return (
    //       <button
    //         class="btn btn-success"
    //         onClick={() => {
    //
    //           setUnitId(cell.cell.row.original);
    //           setWQShow(true);
    //         }}
    //       >
    //         Upload Written Questions Questions From Excel
    //       </button>
    //     );
    //   }
    // },
    // {
    //   Header: "Upload Flash Cards Excel File",
    //   Cell: (cell) => {
    //     return (
    //       <button
    //         class="btn btn-success"
    //         onClick={() => {
    //
    //           setUnitId(cell.cell.row.original);
    //           setFlashShow(true);
    //         }}
    //       >
    //         Flash Cards
    //       </button>
    //     );
    //   }
    // },
    // {
    //   Header: "Cases Tasks Topics",
    //   Cell: (cell) => {
    //     return (
    //       <button
    //         class="btn btn-success"
    //         onClick={() => {
    //           navigate("/casesTopics", {
    //             state: {
    //               ...location.state,
    //               coursedata: cell.cell.row.original?.course_id,
    //               unitData: cell.cell.row.original,
    //               units: Units,
    //             },
    //           });
    //         }}
    //       >
    //         View{" "}
    //       </button>
    //     );
    //   },
    // },
    {
      Header: "MCQ Questions",
      Cell: (cell) => {
        return (
          <button
            class="btn btn-success"
            onClick={() => {
              navigate("/TopicMcqQuestionList", {
                state: {
                  ...location.state,
                  coursedata: cell.cell.row.original?.course_id,
                  unitData: cell.cell.row.original,
                  units: Units,
                },
              });
            }}
          >
            View{" "}
          </button>
        );
      },
    },
    // {
    //   Header: "True, False Questions Topics",
    //   Cell: (cell) => {
    //     return (
    //       <button
    //         class="btn btn-success"
    //         onClick={() => {
    //           navigate("/TrueFalseTopics", {
    //             state: {
    //               ...location.state,
    //               coursedata: cell.cell.row.original?.course_id,
    //               unitData: cell.cell.row.original,
    //               units: Units,
    //             },
    //           });
    //         }}
    //       >
    //         View{" "}
    //       </button>
    //     );
    //   },
    // },
    // {
    //   Header: "Matching Questions Topics",
    //   Cell: (cell) => {
    //     return (
    //       <button
    //         class="btn btn-success"
    //         onClick={() => {
    //           navigate("/matchingtopics", {
    //             state: {
    //               ...location.state,
    //               coursedata: cell.cell.row.original?.course_id,
    //               unitData: cell.cell.row.original,
    //               units: Units,
    //             },
    //           });
    //         }}
    //       >
    //         View{" "}
    //       </button>
    //     );
    //   },
    // },
    {
      Header: "Flash cards Topics",
      Cell: (cell) => {
        return (
          <button
            class="btn btn-success"
            onClick={() => {
              navigate("/interActiveTopics", {
                state: {
                  ...location.state,
                  coursedata: cell.cell.row.original,
                  unitData: cell.cell.row.original,
                  units: Units,
                  CourseId: cell.cell.row.original?.course_id,
                },
              });
            }}
          >
            View{" "}
          </button>
        );
      },
    },
    // {
    //   Header: "Unit Answered Students",
    //   Cell: (cell) => {
    //     return (
    //       <>
    //         {permissions?.includes("*3_2") ||
    //         permissions?.startsWith("3_2") ||
    //         permissions == "all" ? (
    //           <button
    //             class="btn btn-success"
    //             onClick={() => {
    //               navigate("/units/answeredStudents", {
    //                 state: {
    //                   ...location.state,
    //                   coursedata: cell.cell.row.original?.course_id,
    //                   unitData: cell.cell.row.original,
    //                 },
    //               });
    //             }}
    //           >
    //             View{" "}
    //           </button>
    //         ) : null}
    //       </>
    //     );
    //   },
    // },
    {
      Header: "Action",
      Cell: (cell) => {
        return (
          <div className="btnsKteer">
            {permissions?.includes("*3_3") ||
            permissions?.startsWith("3_3") ||
            permissions == "all" ? (
              <button
                className="btn btn-primary"
                onClick={() => {
                  getCourses();
                  setsetShowCopy(cell.cell.row.original.unit_id);
                  setSelectedUnit(cell.cell.row.original.unit_id);
                  checkExams(cell.cell.row.original);
                }}
              >
                Copy MCQs
              </button>
            ) : null}

            {permissions?.includes("*3_3") ||
            permissions?.startsWith("3_3") ||
            permissions == "all" ? (
              <button
                className="btn btn-primary"
                onClick={() => {
                  getCourses();
                  setSelectedUnit(cell.cell.row.original.unit_id);
                  setShowCopyOriginal(cell.cell.row.original);
                }}
              >
                Copy
              </button>
            ) : null}
            <button
              className="btn btn-success"
              onClick={() => {
                setEdit(true);
                setSelectedUnit(cell.cell.row.original);
              }}
            >
              Edit
            </button>
          </div>
        );
      },
    },
  ];
  const permissions = userData?.permissions;
  const [showEditForm, setShowEditForm] = useState(false);
  const showEdittedForm = () => setShowEditForm(!showEditForm);
  const [selectedTopic, setselectedTopic] = useState(false);
  const handleEditTopic = (e) => {
    const data_send = {
      unit_name: e?.target?.topicNewName?.value,
      unit_id: selectedUnit?.unit_id,
    };
    axios
      .post(
        "https://camp-coding.tech/quest/platform/admin/unit/update_unites.php",
        JSON.stringify(data_send)
      )
      .then((res) => {
        if (res.status == "success") {
          toast.success("Success");
          setselectedTopic(false);
          getUnits();
          setEdit(false);
          showEdittedForm();
        } else if (res.status == "error") {
          toast.error(res.message);
        } else {
          toast.error("Something Went Error");
        }
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
          setSelectedCourse(null);
          setSelectedUnit(null);
        } else if (res.status == "error") {
          toast.error(res.message);
        } else {
          toast.error("Something Went Error");
        }
      });
  };
  const [Courses, setCourses] = useState(false);
  const [showCopy, setsetShowCopy] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(false);

  const getCourses = async () => {
    const courses = await axios.get(
      "https://camp-coding.tech/quest/platform/admin/courses/select_courses.php"
    );
    setCourses([...courses]);
  };
  useEffect(() => {
    if (!checkedData?.open) {
      setIds([]);
    }
  }, [checkedData]);
  useEffect(() => {
    if (selectedCourse) getUnits();
  }, [selectedCourse]);
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
        <h2>No Units</h2>
      ) : (
        <Loader />
      )}
      <Modal title="Copy Unit To Course" isOpen={showCopyOriginal}>
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
          }}
        >
          <CloseButton
            onClick={() => setShowCopyOriginal(false)}
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
                required
              >
                {Courses && Courses.length ? (
                  Courses.map((item, index) => {
                    return (
                      <MenuItem value={item.course_id} key={index}>
                        {item.course_name} - {item.university_name} -{" "}
                        {item.grade_name}
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
      <Modal title="Check Unit Parts" isOpen={checkedData?.open}>
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
          }}
        >
          <CloseButton
            onClick={() =>
              setCheckedData({
                open: false,
                loading: false,
                data: [],
                exam_id: null,
              })
            }
            style={{ marginLeft: "auto" }}
          />

          {checkedData?.loading ? (
            <Spinner style={{ color: "blue" }} />
          ) : (
            <>
              {" "}
              {checkedData?.data && checkedData?.data.length ? (
                checkedData?.data?.map((item, index) => (
                  <div className="rowBetweenDiv">
                    <span>{item?.part_title}</span>
                    {ids?.filter((id) => id == item?.part_id?.toString())
                      ?.length ? (
                      "✅"
                    ) : (
                      <button
                        className="btn btn-success"
                        style={{ margin: "10px 0 0 auto" }}
                        onClick={() =>
                          setShowCopyPart(item?.part_id?.toString())
                        }
                      >
                        {" "}
                        Copy Part{" "}
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <tr>
                  <td colSpan="2" className="no-questions">
                    No Questions Checked
                  </td>
                </tr>
              )}
            </>
          )}
        </form>
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
              setUnitId(false);
              setMCQShow(false);
            }}
            style={{ marginLeft: "auto" }}
          />
          <p>{courseData?.course_name + "(-)" + unit_id?.unit_name}</p>
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
      <Modal title="Upload Tweets Excel File" isOpen={tweets_show}>
        <form
          action="#"
          style={{
            padding: "15px",
            display: "flex",
            flexDirection: "column",
          }}
          onSubmit={(e) => {
            e.preventDefault();
            return !uploadLoading ? uploadExcel(e, "tweets") : null;
          }}
        >
          <CloseButton
            onClick={() => {
              setUploadLoading(false);
              setTweetShow(false);
            }}
            style={{ marginLeft: "auto" }}
          />
          <p>{courseData?.course_name + "(-)" + unit_id?.unit_name}</p>
          <div className="input_Field">
            <label forHtml="course_id">Tweets Excel File</label>
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
      <Modal title="Upload Written Questions Excel File" isOpen={wq_show}>
        <form
          action="#"
          style={{
            padding: "15px",
            display: "flex",
            flexDirection: "column",
          }}
          onSubmit={(e) => {
            e.preventDefault();
            return !uploadLoading ? uploadExcel(e, "tweets") : null;
          }}
        >
          <CloseButton
            onClick={() => {
              setUploadLoading(false);
              setWQShow(false);
            }}
            style={{ marginLeft: "auto" }}
          />
          <p>{courseData?.course_name + "(-)" + unit_id?.unit_name}</p>
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
      <Modal title="Upload Flash Cards Excel File" isOpen={flash_show}>
        <form
          action="#"
          style={{
            padding: "15px",
            display: "flex",
            flexDirection: "column",
          }}
          onSubmit={(e) => {
            e.preventDefault();
            return !uploadLoading ? uploadExcel(e, "flash_cards") : null;
          }}
        >
          <CloseButton
            onClick={() => {
              setUploadLoading(false);
              setFlashShow(false);
            }}
            style={{ marginLeft: "auto" }}
          />
          <p>{courseData?.course_name + "(-)" + unit_id?.unit_name}</p>
          <div className="input_Field">
            <label forHtml="course_id">Flash Cards Excel File</label>
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
      <Modal title="Edit Topic" isOpen={edit} toggle={() => setEdit(false)}>
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
            onClick={() => setEdit(false)}
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
                PrintAllQuestions(prints?.unit_id, prints?.unit_name)
              }
            >
              Print
            </button>
          </ModalBody>
        </Modal>

        <Modal title="Copy Question" isOpen={showCopyPart}>
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
              onClick={() => setShowCopyPart(null)}
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
                  value={selectedCourse}
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
                      value={selectedUnit}
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
      </div>
      <ExportFile
        modal={showexport}
        setModal={setShowExportFile}
        type={"unit"}
      />
      <ToastContainer />
    </React.Fragment>
  );
};

export default UnitListTable;
