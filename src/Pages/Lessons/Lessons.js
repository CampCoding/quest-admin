import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
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
  ModalHeader,
  ModalBody,
  Form,
  Label,
  Input,
  FormFeedback,
  CloseButton,
} from "reactstrap";
import { Icon } from "@iconify/react";
import transferUp from "@iconify/icons-mdi/transfer-up";
import transferDown from "@iconify/icons-mdi/transfer-down";
import { Form as FormT } from "rsuite";
import axios from "axios";
//Import Flatepicker
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";

// Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
import CourseListTable from "../Courses/CoursesList/CourseTable/courseListTable";
import UnitListTable from "../Units/UnitTable/UnitTableList";
import LessonsTableList from "./LessonsTabel/LessonsTableList";
import { useCallback } from "react";
import { Fragment } from "react";
import Flash_Cards from "../Interactive/flashcards";
import Tweets from "../Interactive/tweets";
import WrittenQuestions from "../Interactive/writtenquestion";
import MCQQuestions from "./mcqquestion";
// import VideoListTable from "../video/BooksList/VideoTable/bookListTable";
import { MenuItem, Select } from "@mui/material";
import { useEffect } from "react";
import { Loader, Radio, RadioGroup, SelectPicker } from "rsuite";
import VideoListTable from "../video/VideosList/VideoTable/videoListTable";
import { ToastContainer, toast } from "react-toastify";
import Ebooks from "../Interactive/ebooks";
import { TbFreeRights } from "react-icons/tb";
import { MdOutlinePaid } from "react-icons/md";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import UniqQuestion from "../UnitQuestion/UniqQuestion";
import Cases from "../Interactive/cases";
import { userData } from "../../store/getProfileData";
import VoiceStoreUnit from "../eBookStore/voicestoreunits";

// import CourseListTable from "../CourseTable/courseListTable";

const Lessons = () => {
  document.title = "Courses | Quest ";

  const location = useLocation();
  // const {state}=location;
  const [type_2, setType_2] = useState(false);
  const [videoLink, setVideoLink] = useState(false);

  const [modal, setModal] = useState(false);
  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
    } else {
      setModal(true);
    }
  }, [modal]);

  const navigate = useNavigate();

  function handelType_2Change(type_2_2) {
    setType_2(type_2_2);
  }
  function handelVideoLink(link) {
    setVideoLink(link);
  }
  const [title, setTitle] = useState("Lessons");
  const [type, setType] = useState("Lessons");

  document.title = title + " | Quest ";

  const buttons = [
    { type: "Lessons", title: "Lessons" },
    // { type: "FlashCards", title: "Flash Cards" },
    // { type: "Tweets", title: "Tweets" },
    // { type: "writtenquestion", title: "Written Questions" },
    // { type: "mcqquestion", title: "MCQ Questions" },
    { type: "ebooks", title: "Ebooks" },
    { type: "voices", title: "Voices" },
    // { type: "cases", title: "Cases" }
    // {type:"mcqquestion",title:"MCQ Question"}
    // ebooks
  ];
  const [Videos, setVideos] = useState([]);
  const [showAssign, setShowAssign] = useState(false);
  const [item, setItem] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(false);
  const [videoData, setVideoData] = useState(false);
  const [itemLoader, setItemLoader] = useState(false);
  const [itemTLoader, setItemTLoader] = useState(false);
  const [modelVideo, setModelVideos] = useState(false);
  const getVideos = async () => {
    setItemTLoader(true);
    const videos = await axios.get(
      "https://camp-coding.tech/quest/platform/admin/videos/select_videos.php"
    );
    setVideos([...videos]?.reverse());
    setItemTLoader(false);
  };

  const [groups, setGroups] = useState(null);
  const [groupId, setGroupId] = useState(null);
  const getAllVideos = async () => {
    const videos = await axios.get(
      "https://camp-coding.tech/quest/platform/admin/videos/videos_groups/select_not_hidden_groups.php"
    );
    setGroups((prev) => [...videos]?.reverse());
    setGroupId((prev) => videos && videos?.length && videos[0]?.group_id);
  };

  useEffect(() => {
    if (groupId) {
      getModelVideos();
    }
  }, [groupId]);

  const getModelVideos = async () => {
    const videos = await axios.post(
      "https://camp-coding.tech/quest/platform/admin/videos/videos_groups/select_group_videos.php",
      { group_id: groupId }
    );
    setModelVideos((prev) => [...videos]?.reverse());
  };
  const permissions = userData?.permissions;

  const getUnitVideos = async () => {
    setItemLoader(true);
    const videos = await axios.post(
      "https://camp-coding.tech/quest/platform/admin/videos/select_unit_videos.php",
      {
        unit_id: unitData,
      }
    );
    setUnitVideos([...videos?.reverse()]);
    setItemLoader(false);
  };
  useEffect(() => {
    getUnitVideos();
  }, []);

  const [Courses, setCourses] = useState(false);
  const getCourses = async () => {
    const courses = await axios.get(
      "https://camp-coding.tech/quest/platform/admin/courses/select_courses.php"
    );
    setCourses([...courses]);
  };

  const [selectedCourse, setSelectedCourse] = useState(false);
  const [Units, setUnits] = useState(false);

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

  useEffect(() => {
    getUnits();
  }, [selectedCourse]);
  const [rowdata, setrowdata] = useState({});

  const HandleUpdateVideo = () => {
    const data_send = {
      unit_video_id: rowdata.unit_video_id,
      new_title: rowdata.new_title,
      source_video_id: rowdata.source_video_id,
      unit_id: rowdata.unit_id,
      course_id: rowdata.course_id,
    };
    axios
      .post(
        "https://camp-coding.tech/quest/platform/admin/videos/update_videos_info.php",
        JSON.stringify(data_send)
      )
      .then((res) => {
        if (res.status == "success") {
          toast.success(res.message);
        } else if (res.status == "error") {
          toast.error(res.message);
        } else {
          toast.error("something went error");
        }
      })
      .catch((err) => console.log(err));
  };

  const handleupdatestatus = (data) => {
    const data_send = {
      unit_video_id: data.unit_video_id,
      hidden_value: data.hidden == "no" ? "yes" : "no",
    };
    axios
      .post(
        "https://camp-coding.tech/quest/platform/admin/videos/update_videos_hidden.php",
        JSON.stringify(data_send)
      )
      .then((res) => {
        if (res.status == "success") {
          toast.success(res.message);
          getUnitVideos();
        } else if (res.status == "error") {
          toast.error(res.message);
        } else {
          toast.error("something went error");
        }
      })
      .catch((err) => console.log(err));
  };

  const handleupdatefree = (data) => {
    const data_send = {
      unit_video_id: data.unit_video_id,
      free_value: data.free == "no" ? "yes" : "no",
    };
    axios
      .post(
        "https://camp-coding.tech/quest/platform/admin/videos/update_free_video.php",
        JSON.stringify(data_send)
      )
      .then((res) => {
        if (res.status == "success") {
          toast.success(res.message);
          getUnitVideos();
        } else if (res.status == "error") {
          toast.error(res.message);
        } else {
          toast.error("something went error");
        }
      })
      .catch((err) => console.log(err));
  };

  const [edit, setEdit] = useState(false);
  const [videoDataEdit, setVideoDataEdit] = useState(false);
  const [titleNew, setTitleNew] = useState(false);

  useEffect(() => {
    // console.log(videoDataEdit);
    setTitleNew(videoDataEdit.new_title);
  }, [videoDataEdit]);

  const handleEditVideo = async () => {
    await axios
      .post(
        "https://camp-coding.tech/quest/platform/admin/videos/update_videos_info.php",
        {
          unit_video_id: videoDataEdit.unit_video_id,
          new_title: titleNew, // not req
          source_video_id: videoDataEdit.source_video_id,
          unit_id: videoDataEdit.unit_id,
          course_id: videoDataEdit.course_id,
        }
      )
      .then((res) => {
        if (res.status == "success") {
          toast.success("Updated");
          getUnitVideos();
          setVideoDataEdit(false);
        } else {
          toast.error(res.message);
        }
      });
  };

  const setStatus = async (video_id, unit_video_id, status) => {
    await axios
      .post(
        "https://camp-coding.tech/quest/platform/admin/arranging/arrange_assigned_videos.php",
        {
          unit_video_id: unit_video_id,
          direction: status, // not req
          source_video_id: video_id,
          unit_id: location?.state?.unitData?.unit_id,
          course_id: location?.state?.coursedata?.course_id,
        }
      )
      .then((res) => {
        if (res.status == "success") {
          toast.success("Updated");
          getUnitVideos();
          setVideoDataEdit(false);
        } else {
          toast.error(res.message);
        }
      });
  };
  const columns = [
    {
      Header: "No",
      Cell: (cell) => {
        return <b>{cell?.cell?.row?.original?.order_no}</b>;
      },
    },
    {
      Header: "Video Source ID",
      accessor: "source_video_id",
      Cell: (cell) => {
        return (
          <>
            {" "}
            {permissions?.includes("*4_6") ||
            permissions?.startsWith("4_6") ||
            permissions == "all" ? (
              <div className="sorts_u">
                <span
                  style={{ margin: "0 3px", cursor: "pointer" }}
                  onClick={() => {
                    setStatus(
                      cell.cell.row.original.video_id,
                      cell.cell.row.original.unit_video_id,
                      "up"
                    );
                  }}
                >
                  <Icon
                    icon={transferUp}
                    color="green"
                    style={{ fontSize: "30px" }}
                  />
                </span>
                {cell.cell.row.index != unitVideos.length ? (
                  <span
                    style={{ margin: "0 3px", cursor: "pointer" }}
                    onClick={() =>
                      setStatus(
                        cell.cell.row.original.video_id,
                        cell.cell.row.original.unit_video_id,
                        "down"
                      )
                    }
                  >
                    <Icon
                      icon={transferDown}
                      color="red"
                      style={{ fontSize: "30px" }}
                    />
                  </span>
                ) : null}
                <span>{cell.cell.row.original?.source_video_id}</span>
              </div>
            ) : null}
          </>
        );
      },
    },
    {
      Header: "Video Title",
      accessor: "new_title",

      Cell: (cell, _, index) => {
        // console.log("i",index);
        return (
          <div
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <span>{cell.cell.row.original.new_title}</span>

            {permissions?.includes("*4_3") ||
            permissions?.startsWith("4_3") ||
            permissions == "all" ? (
              <button
                className="btn btn-primary"
                onClick={() => {
                  setVideoDataEdit(cell.cell.row.original);
                  setEdit(true);
                }}
              >
                Edit
              </button>
            ) : null}
          </div>
        );
      },
    },

    {
      Header: "Free",
      Cell: (cell) => {
        return (
          <>
            {" "}
            {permissions?.includes("*4_4") ||
            permissions?.startsWith("4_4") ||
            permissions == "all" ? (
              <DropdownItem
                onClick={() => {
                  handleupdatefree(cell.cell.row.original);
                }}
              >
                {cell.cell.row.original.free == "no" ? (
                  <TbFreeRights className="hidden" />
                ) : (
                  <MdOutlinePaid className="shown" />
                )}
              </DropdownItem>
            ) : null}
          </>
        );
      },
    },
    {
      Header: "Hidden",
      Cell: (cell) => {
        return (
          <>
            {permissions?.includes("*4_5") ||
            permissions?.startsWith("4_5") ||
            permissions == "all" ? (
              <DropdownItem
                onClick={() => {
                  handleupdatestatus(cell.cell.row.original);
                }}
              >
                {cell.cell.row.original.hidden == "no" ? (
                  <VisibilityOff className="hidden" />
                ) : (
                  <Visibility className="shown" />
                )}
              </DropdownItem>
            ) : null}
          </>
        );
      },
    },
    {
      Header: "View Video Questions",
      Cell: (cell) => {
        return (
          <>
            <button
              class="btn btn-success"
              onClick={() => {
                navigate("/video/VideoMCQQuestions", {
                  state: {
                    videoData: {
                      video_id: cell.cell.row.original?.source_video_id,
                    },
                  },
                });
              }}
            >
              View
            </button>
            <button
              class="btn btn-success"
              onClick={() => {
                navigate("/video/VideoRates", {
                  state: {
                    video: cell.cell.row.original,
                  },
                });
              }}
            >
              Rates
            </button>
          </>
        );
      },
    },
    {
      Header: "Action",
      Cell: (cell) => {
        return (
          <h2>
            {permissions?.includes("*4_2") ||
            permissions?.startsWith("4_2") ||
            permissions == "all" ? (
              <button
                className="btn btn-danger"
                onClick={() => {
                  setVideoDataUnAssign(cell.cell.row.original);
                  setUnAssignVideo(true);
                }}
              >
                UnAssign
              </button>
            ) : null}
            <button
              style={{ margin: "10px 0" }}
              className="btn btn-success"
              onClick={() => {
                navigate("/videoStats", {
                  state: { video: cell.cell.row.original },
                });
              }}
            >
              Video Statistics
            </button>
          </h2>
        );
      },
    },
    // {
    //   Header: 'Questions',
    //   Cell: (cell) => {
    //     return (
    //       <h2>
    //         <button
    //           className="btn btn-warning"
    //           onClick={() => {
    //             navigate("/videosquestions", {
    //               state: { vide_data: cell.cell.row.original },
    //             });
    //           }}
    //         >
    //           Questions
    //         </button>
    //       </h2>
    //     );
    //   },
    // },
  ];
  const [videoDataUnAssign, setVideoDataUnAssign] = useState(false);
  const [unAssignVideo, setUnAssignVideo] = useState(false);
  const Video = videoData.assign_data;

  const [unitVideos, setUnitVideos] = useState(false);
  const [videoType, setVideoType] = useState(false);
  const [videoData_r, setVideoDataR] = useState(false);
  const [pubLink, setPubLink] = useState(false);
  const [Vim_link, setVimLink] = useState(false);

  const unitData = location?.state?.unitData?.unit_id;
  const courseData = location?.state?.coursedata?.course_id;
  const unitdata = location?.state;
  // console.log(unitdata, "sds")
  const [clear, showClear] = useState(false);

  // const getUnitVideos = () => {
  //   const arr = [];
  //   Videos.map((item, index) => {
  //     if (item.assign_data && item.assign_data.length) {
  //       arr.push(
  //         ...item.assign_data.filter((v_item, v_index) => {
  //           return v_item.unit_id == unitData;
  //         })
  //       );
  //     }
  //   });
  //   if (arr && arr.length) {
  //     setUnitVideos([...arr]);
  //   }
  // };

  // useEffect(() => {
  //   getUnitVideos();
  // }, [Videos]);

  useEffect(() => {
    if (selectedCourse) {
      setVideoDataR(
        modelVideo.filter((item) => item?.video_id == selectedCourse)
      );
    } else {
      setVideoDataR(false);
    }
  }, [selectedCourse]);

  const [searchValue, setSearchValue] = useState(false);

  if (!location?.state) {
    return navigate(-1);
  }

  const AssignVideo = async (e) => {
    const data_send = {
      new_title: e.currentTarget.new_title.value, // not req
      course_id: courseData,
      unit_id: unitData,
      source_video_id: selectedCourse,
    };
    const assign = await axios.post(
      "https://camp-coding.tech/quest/platform/admin/videos/assign_videos_to_unit.php",
      data_send
    );
    if (assign.status == "success") {
      toast.success("Assigned");
      getUnitVideos();
    } else {
      toast.error(assign.message);
    }
  };

  const unAssignData = async (e) => {
    const data_send = {
      unit_video_id: videoDataUnAssign.unit_video_id,
    };
    const assign = await axios.post(
      "https://camp-coding.tech/quest/platform/admin/videos/remove_assign_video_unit.php",
      data_send
    );
    if (assign.status == "success") {
      toast.success("Un Assigned");
      getUnitVideos();
      setUnAssignVideo(false);
    } else {
      toast.error(assign.message);
    }
  };

  const showClearModal = () => {
    showClear(true);
  };
  const handleClear = async () => {
    const units = await axios.post(
      "https://camp-coding.tech/quest/platform/admin/videos/delete_all_assign_videos.php",
      JSON.stringify({ unit_id: unitData })
    );
    if (units.status) {
      toast.success(units.message);
      await getUnits();
      showClear(false);
    } else {
      toast.error(units.message);
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <div className="header-btns">
            {buttons.map((buttonData, index) => (
              <button
                key={index}
                className={`btn btn-success ${
                  type === buttonData.type ? "btn-danger" : ""
                }`}
                onClick={() => {
                  setType(buttonData.type);
                  setTitle(buttonData.title);
                }}
              >
                {buttonData.title}
              </button>
            ))}
          </div>
          <div id="table-invoices-list">
            {type == "Lessons" ? (
              <Fragment>
                <Breadcrumbs
                  title={location?.state?.coursedata?.course_name}
                  breadcrumbItem={
                    location?.state?.unitData?.unit_name + "  >  Lesson List"
                  }
                />
                <Row>
                  <Col lg={12}>
                    <Card>
                      <CardBody>
                        <div className="position-relative">
                          <div className="modal-button mt-2">
                            <Row className="align-items-start">
                              {permissions?.includes("*4_1") ||
                              permissions?.startsWith("4_1") ||
                              permissions == "all" ? (
                                <Col className="col-sm">
                                  <div>
                                    <button
                                      type="button"
                                      className="btn btn-success mb-4"
                                      data-bs-toggle="modal"
                                      data-bs-target="#addVideoModal"
                                      onClick={() => {
                                        // setItem(Video);
                                        setShowAssign(true);
                                        // getCourses();
                                        getAllVideos();
                                      }}
                                    >
                                      <i className="mdi mdi-plus me-1"></i> Add
                                      Video
                                    </button>
                                  </div>
                                </Col>
                              ) : null}
                              {/* <Col className="col-sm">
                                <div>
                                  <button
                                    type="button"
                                    className="btn btn-success mb-4"
                                    data-bs-toggle="modal"
                                    data-bs-target="#addVideoModal"
                                    onClick={
                                      () => {
                                        showClearModal()
                                      }
                                    }
                                  >
                                    <i className="mdi mdi-plus me-1"></i> Clear Videos
                                  </button>
                                </div>
                              </Col> */}
                            </Row>
                          </div>
                        </div>
                        <div id="table-invoices-list">
                          {itemLoader ? (
                            <Loader />
                          ) : (
                            <>
                              {unitVideos && unitVideos.length ? (
                                <VideoListTable
                                  videos={unitVideos}
                                  columns={columns}
                                />
                              ) : (
                                <div>
                                  <h2>No Videos</h2>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
                <Modal isOpen={showAssign}>
                  <ModalHeader tag="h4">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "100%",
                        alignItems: "center",
                      }}
                    >
                      <h4> Assign Video To Unit </h4>
                      <CloseButton
                        onClick={() => {
                          setShowAssign(false);
                          setSelectedCourse(false);
                          setUnits(false);
                          setVideoType(false);
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
                        AssignVideo(e);
                      }}
                    >
                      <div className="input_Field">
                        <Input
                          style={{
                            width: "100%",
                            borderRadius: "4px",
                            margin: "10px 0",
                          }}
                          type="text"
                          name="new_title"
                          id="new_title"
                          placeholder="Enter new_title"
                        />
                      </div>
                      <div className="inputField withtext">
                        <label htmlFor="exam_name">Groups</label>
                        <select
                          value={groupId}
                          onChange={(e) => {
                            setModelVideos((prev) => []);
                            setGroupId(e.target.value);
                          }}
                        >
                          {groups && groups?.length
                            ? groups.map((item) => {
                                return (
                                  <option value={item?.group_id}>
                                    {item?.group_name}
                                  </option>
                                );
                              })
                            : null}
                        </select>
                      </div>
                      <div className="input_Field">
                        <FormT.Group controlId="radioList">
                          <RadioGroup
                            name="radioList"
                            onChange={(e) => {
                              setVideoDataR(false);
                              setSelectedCourse(null);
                              setVideoType(e);
                            }}
                          >
                            <p>Get Video</p>
                            <Radio value="vlist">Select From List</Radio>
                            <Radio value="vsid">
                              Search By Video source Id
                            </Radio>
                          </RadioGroup>
                        </FormT.Group>

                        {groupId ? (
                          <>
                            {" "}
                            {videoType == "vsid" ? (
                              unitVideos && unitVideos.length ? (
                                <>
                                  <input
                                    type="search"
                                    className="search_type"
                                    onChange={(e) =>
                                      setSearchValue(e.currentTarget.value)
                                    }
                                    placeholder="Video Source ID"
                                  />
                                  {searchValue && searchValue.length != "" ? (
                                    <ul
                                      className="options"
                                      style={{ listStyle: "none" }}
                                    >
                                      {itemTLoader ? (
                                        <Loader />
                                      ) : modelVideo && modelVideo.length ? (
                                        modelVideo.map((item) => {
                                          return item.video_id
                                            .toString()
                                            .includes(searchValue) ? (
                                            <li
                                              onClick={() => {
                                                setSelectedCourse(
                                                  item.video_id
                                                );
                                                setSearchValue(false);
                                              }}
                                            >
                                              {item.video_title}
                                            </li>
                                          ) : null;
                                        })
                                      ) : (
                                        <h3>No Videos</h3>
                                      )}
                                    </ul>
                                  ) : null}
                                </>
                              ) : (
                                <h3>No Videos</h3>
                              )
                            ) : videoType == "vlist" ? (
                              modelVideo && modelVideo.length ? (
                                <>
                                  <SelectPicker
                                    label="Select Video"
                                    data={modelVideo.map((item) => {
                                      return {
                                        label: item?.video_title,
                                        value: item?.video_id,
                                      };
                                    })}
                                    style={{ width: 224 }}
                                    required
                                    onChange={(e) => setSelectedCourse(e)}
                                  />
                                </>
                              ) : (
                                <h3>No Videos</h3>
                              )
                            ) : null}
                          </>
                        ) : null}
                        {/* {videoData_r && videoData_r.length ? (
                          <div className="videoData">
                            <p style={{ margin: 0 }}>
                              <span
                                style={{ fontWeight: "900", fontSize: "15px" }}
                              >
                                Video Title :{" "}
                              </span>{" "}
                              <em style={{ fontStyle: "normal" }}>
                                {" "}
                                {videoData_r[0]?.video_title}{" "}
                              </em>
                            </p>
                            <p style={{ margin: 0 }}>
                              <span
                                style={{ fontWeight: "900", fontSize: "15px" }}
                              >
                                Video Duration :{" "}
                              </span>{" "}
                              <em style={{ fontStyle: "normal" }}>
                                {" "}
                                {videoData_r[0]?.video_duration}{" "}
                              </em>
                            </p>

                            {videoData_r[0]?.publitio_data &&
                            videoData_r[0]?.publitio_data.length ? (
                              <p style={{ margin: "10px 0" }}>
                                <span
                                  style={{
                                    fontWeight: "900",
                                    fontSize: "15px",
                                  }}
                                >
                                  Publitio Video :{" "}
                                </span>{" "}
                                <p
                                  onClick={() => {
                                    setPubLink(
                                      "https://camp-coding.tech/quest/platform/publitio_player?q=" +
                                        videoData_r[0]?.publitio_data
                                    );
                                    setVimLink(false);
                                  }}
                                  className="btn btn-primary"
                                >
                                  Show Video
                                </p>
                              </p>
                            ) : null}

                            {videoData_r[0]?.vimeo_data &&
                            videoData_r[0]?.vimeo_data.length ? (
                              <p style={{ margin: "10px 0" }}>
                                <span
                                  style={{
                                    fontWeight: "900",
                                    fontSize: "15px",
                                  }}
                                >
                                  Vimeo Video :{" "}
                                </span>{" "}
                                <p
                                  onClick={() => {
                                    setPubLink(false);
                                    setVimLink(videoData_r[0]?.vimeo_data);
                                  }}
                                  className="btn btn-primary"
                                >
                                  Show Video
                                </p>
                              </p>
                            ) : null}
                          </div>
                        ) : null}{" "} */}
                      </div>

                      <button
                        className="btn btn-success"
                        style={{ margin: "10px 0 0 auto" }}
                      >
                        {" "}
                        Assign To Unit{" "}
                      </button>
                    </form>
                  </ModalBody>
                </Modal>
                <Modal isOpen={pubLink || Vim_link}>
                  <ModalHeader tag="h4">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "100%",
                        alignItems: "center",
                      }}
                    >
                      <h4> {pubLink ? "Publitio Video" : "Vimeo Video"} </h4>
                      <CloseButton
                        onClick={() => {
                          setPubLink(false);
                          setVimLink(false);
                        }}
                        style={{ marginLeft: "auto" }}
                      />
                    </div>
                  </ModalHeader>
                  <ModalBody>
                    {pubLink ? (
                      <iframe width="100%" src={pubLink}></iframe>
                    ) : (
                      <iframe width="100%" src={Vim_link}></iframe>
                    )}
                  </ModalBody>
                </Modal>
              </Fragment>
            ) : type == "FlashCards" ? (
              <Flash_Cards
                CourseId={courseData}
                unitId={unitData}
                allunitdata={location?.state?.unitData}
                cd={location.state.coursedata}
              />
            ) : type == "Tweets" ? (
              <Tweets
                CourseId={courseData}
                unitId={unitData}
                allunitdata={location?.state?.unitData}
                cd={location.state.coursedata}
              />
            ) : type == "writtenquestion" ? (
              <WrittenQuestions
                CourseId={courseData}
                unitId={unitData}
                allunitdata={location?.state?.unitData}
                cd={location.state.coursedata}
              />
            ) : type == "ebooks" ? (
              <Ebooks
                CourseId={courseData}
                unitId={unitData}
                allunitdata={location?.state?.unitData}
                cd={location.state.coursedata}
              />
            ) : type == "mcqquestion" ? (
              <MCQQuestions
                CourseId={courseData}
                unitId={unitdata.unitData}
                allunitdata={location?.state?.unitData}
                cd={location.state.coursedata}
              />
            ) : type == "voices" ? (
              <VoiceStoreUnit
                CourseId={courseData}
                unitId={unitData}
                allunitdata={location?.state?.unitData}
                cd={location.state.coursedata}
              />
            ) : (
              <UniqQuestion unitdata={courseData} />
            )}
          </div>
        </Container>
        <Modal isOpen={modal} toggle={toggle}>
          <ModalHeader toggle={toggle} tag="h4">
            Add New Lesson
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
                <Col md={12}>
                  <div className="mb-3">
                    <Label className="form-label">Lesson Name</Label>
                    <Input name="orderId" type_2="text" />
                  </div>
                  <div className="mb-3">
                    <Label className="form-label">video</Label>
                    <Input name="orderId" type_2="file" />
                  </div>
                </Col>
              </Row>
              <Row>
                <Col>
                  <div className="text-end">
                    <button
                      type_2="submit"
                      className="btn btn-success save-user"
                    >
                      Save
                    </button>
                  </div>
                </Col>
              </Row>
            </Form>
          </ModalBody>
        </Modal>

        <Modal isOpen={edit} toggle={() => setEdit(!edit)}>
          <ModalHeader toggle={() => setEdit(!edit)} tag="h4">
            Edit Video Title
          </ModalHeader>
          <ModalBody>
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                handleEditVideo();
                return false;
              }}
            >
              <Row>
                <Col md={12}>
                  <div className="mb-3">
                    <Label className="form-label">Video Title</Label>
                    <Input
                      name="orderId"
                      type_2="text"
                      value={titleNew}
                      onChange={(e) => setTitleNew(e.target.value)}
                    />
                  </div>
                </Col>
              </Row>
              <Row>
                <Col>
                  <div className="text-end">
                    <button
                      type_2="submit"
                      className="btn btn-success save-user"
                    >
                      Save
                    </button>
                  </div>
                </Col>
              </Row>
            </Form>
          </ModalBody>
        </Modal>

        <Modal
          isOpen={unAssignVideo}
          toggle={() => setUnAssignVideo(!unAssignVideo)}
        >
          <ModalHeader tag="h4">Un Assign Video</ModalHeader>
          <ModalBody>
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                unAssignData();
                return false;
              }}
            >
              <Row>
                <Col md={12}>
                  <div className="mb-3">
                    <h1 style={{ color: "red" }}>Are You Sure ..?</h1>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col>
                  <div className="text-end">
                    <button
                      type_2="submit"
                      className="btn btn-success save-user"
                    >
                      Confirm
                    </button>
                  </div>
                </Col>
              </Row>
            </Form>
          </ModalBody>
        </Modal>
        <Modal title="Clear Videos" isOpen={clear}>
          <form
            action="#"
            style={{
              padding: "15px",
              display: "flex",
              flexDirection: "column",
            }}
            onSubmit={(e) => {
              e.preventDefault();
              // handleOk(e)
              handleClear(e);
              showClear(false);
            }}
          >
            <CloseButton
              onClick={() => showClear(false)}
              style={{ marginLeft: "auto" }}
            />

            <div className="input_Field">
              <h2>Are You Sure ..?</h2>
            </div>
            <button
              className="btn btn-success"
              style={{ margin: "10px 0 0 auto" }}
            >
              {" "}
              Clear{" "}
            </button>
          </form>
        </Modal>
        <ToastContainer />
      </div>
    </React.Fragment>
  );
};

export default Lessons;
