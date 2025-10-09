/* eslint-disable no-sparse-arrays */
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Card,
  CardBody,
  CloseButton,
  Col,
  Container,
  Input,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
  Spinner,
} from "reactstrap";

//Import Flatepicker
import "flatpickr/dist/themes/material_blue.css";

// Breadcrumb
import axios from "axios";
import { Loader } from "rsuite";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import VideoListTable from "./VideoTable/videoListTable";

import { ContentCopyOutlined } from "@mui/icons-material";
import { MenuItem, Select } from "@mui/material";
import CopyToClipboard from "react-copy-to-clipboard";
import { ToastContainer, toast } from "react-toastify";
import { userData } from "../../../store/getProfileData";

const GroupsVideos = () => {
  document.title = "GroupsVideos | Quest ";
  const location = useLocation();

  const navigate = useNavigate();
  const [GroupsVideos, setGroupsVideos] = useState([]);
  const [videos, setVideos] = useState(null);
  const [assignloading, setAssignLoading] = useState(null);
  const [groups, setGroups] = useState(null);
  const [groupId, setGroupId] = useState(null);
  const [selectedVideos, setSelectedVideos] = useState([]);
  const [loader, setLoader] = useState(false);
  // setcoursesassined
  // groups
  // assignloading
  const [showAssign, setShowAssign] = useState(false);
  const [item, setItem] = useState(false);
  const [assignModal, setShowAssignModal] = useState(false);
  const [itemLoader, setItemLoader] = useState(false);
  const getGroupsVideos = async () => {
    setItemLoader(true);
    const videos = await axios.post(
      "https://camp-coding.tech/quest/platform/admin/videos/videos_groups/select_group_videos.php",
      { group_id: location?.state?.group?.group_id }
    );
    setGroupsVideos([...videos]?.reverse());
    setItemLoader(false);
  };
  useEffect(() => {
    getGroupsVideos();
  }, []);

  const getAllVideos = async () => {
    const videos = await axios.get(
      "https://camp-coding.tech/quest/platform/admin/videos/videos_groups/select_not_hidden_groups.php"
    );
    setGroups((prev) => [...videos]?.reverse());
    setGroupId((prev) => videos && videos?.length && videos[0]?.group_id);
  };

  useEffect(() => {
    if (assignModal) {
      getAllVideos();
    }
  }, [assignModal]);

  const hanldeassign = () => {
    setShowAssign(false);
    setLoader(true);

    const data_send = {
      group_id: groupId,
      videos_ids: selectedVideos.join(","),
    };
    axios
      .post(
        "https://camp-coding.tech/quest/platform/admin/videos/videos_groups/update_videos_groups.php",
        JSON.stringify(data_send)
      )
      .then((res) => {
        if (res.status == "success") {
          toast.success(res.message);
          setShowAssignModal(false);
          getGroupsVideos();
          setSelectedVideos([]);
        } else if (res.status == "error") {
          toast.error(res.message);
        } else {
          toast.error("Something Went Error");
        }
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setLoader(false);
      });
  };
  const [Courses, setCourses] = useState(false);
  const getCourses = async () => {
    const courses = await axios.get(
      "https://camp-coding.tech/quest/platform/admin/courses/select_courses.php"
    );
    setCourses([...courses]);
  };

  const [selectedUnit, setSelectedUnit] = useState(false);
  const AssignVideo = async (e) => {
    const data_send = {
      new_title: e.currentTarget.new_title.value, // not req
      course_id: selectedCourse,
      unit_id: selectedUnit,
      source_video_id: item.video_id,
    };
    //
    const assign = await axios.post(
      "https://camp-coding.tech/quest/platform/admin/videos/assign_videos_to_unit.php",
      data_send
    );
    if (assign.status == "success") {
      toast.success("Assigned");
      getGroupsVideos();
      setShowAssign(false);
    } else {
      toast.error(assign.message);
    }
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
      //
      // console.log(selectedCourse);
      setUnits([...units]);
    } catch (err) {
      // console.log(err);
    }
  };
  useEffect(() => {
    getUnits();
  }, [selectedCourse]);
  const [unitName, setUnitName] = useState(false);
  const permissions = userData?.permissions;
  const handleOk = async (e) => {
    const send_data = {
      course_id: selectedCourse,
      unit_name: unitName,
    };
    const units = await axios.post(
      "https://camp-coding.tech/quest/platform/admin/courses/add_unit.php",
      send_data
    );
    if (units.status) {
      toast.success("Added");
      await getUnits();
    } else {
      toast.error(units.message);
    }
  };
  const [showEditV, setShowEditV] = useState(false);
  const editVideo = async (e) => {
    // ;
    const data_send = {
      source_video_id: item.video_id,
      video_title: e.currentTarget.new_title.value
        ? e.currentTarget.new_title.value
        : item.video_title,
      video_duration: e.currentTarget.video_duration.value
        ? e.currentTarget.video_duration.value
        : item.video_duration,
      vimeo_data: e.currentTarget.vimeo_data.value
        ? e.currentTarget.vimeo_data.value
        : item.vimeo_data,
      publitio_data: item.publitio_data,
      youtube_link: e.currentTarget.youtube_link.value
        ? e.currentTarget.youtube_link.value
        : item.youtube_link,
      cipher_data: e.currentTarget.cipher_data.value
        ? e.currentTarget.cipher_data.value
        : item.cipher_data,
      // cipher_data
    };

    const assign = await axios.post(
      "https://camp-coding.tech/quest/platform/admin/videos/edit_source_video.php",
      data_send
    );
    // console.log(assign);
    if (assign.status == "success") {
      toast.success("Editted");
      getGroupsVideos();
      setShowEditV(false);
    } else {
      toast.error(assign.message);
    }
  };
  const columns = [
    {
      Header: "No",
      Cell: ({ cell }) => {
        const isChecked = selectedVideos.includes(
          cell?.row?.original?.video_id
        );

        const handleCheckboxChange = (e) => {
          const videoId = cell?.row?.original?.video_id;
          if (isChecked) {
            setSelectedVideos(selectedVideos.filter((id) => id !== videoId));
          } else {
            setSelectedVideos([...selectedVideos, videoId]);
          }
        };

        return (
          <b>
            <input
              type="checkbox"
              checked={isChecked}
              onChange={handleCheckboxChange}
            />
          </b>
        );
      },
    },

    {
      Header: "Video Title",
      accessor: "video_title",
    },
    {
      Header: "Video Duration",
      accessor: "video_duration",
      Filter: false,
    },
    {
      Header: "Video Source ID",
      accessor: "video_id",
      Cell: (cell) => {
        return (
          <>
            {permissions?.includes("*15_3") ||
            permissions?.startsWith("15_3") ||
            permissions == "all" ? (
              <CopyToClipboard
                style={{
                  padding: "0 14px",
                  cursor: "pointer",
                  width: "100%",
                  display: "flex",
                  gap: "10px",
                  alignItems: "center",
                }}
                text={cell.cell.row.original?.video_id}
                onCopy={() => toast.success("Copied")}
              >
                <span
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <b
                    style={{
                      fontSize: "22px",
                      fontWeight: "700",
                      color: "green",
                    }}
                  >
                    {cell.cell.row.original?.video_id}
                  </b>
                  <em>
                    <ContentCopyOutlined />
                  </em>
                </span>
              </CopyToClipboard>
            ) : null}
          </>
        );
      },
    },
    {
      Header: "View Video",
      Cell: (cell) => {
        return (
          <>
            {permissions?.includes("*15_5") ||
            permissions?.startsWith("15_5") ||
            permissions == "all" ? (
              <button
                class="btn btn-success"
                onClick={() => {
                  navigate("/videos/unit-videos", {
                    state: cell.cell.row.original,
                  });
                }}
              >
                View
              </button>
            ) : null}
          </>
        );
      },
    },
    {
      Header: "Time Stamps",

      Cell: (cell, _, index) => {
        // console.log("i",index);
        return (
          <div
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "space-between",
            }}
            className="btn btn-primary"
            onClick={() =>
              navigate("/timestamp", {
                state: { video_id: cell?.cell?.row?.original?.video_id },
              })
            }
          >
            Time Stamps
          </div>
        );
      },
    },
    {
      Header: "View Video Questions",
      Cell: (cell) => {
        return (
          <>
            {permissions?.includes("*15_7") ||
            permissions?.startsWith("15_7") ||
            permissions == "all" ? (
              <button
                class="btn btn-success"
                onClick={() => {
                  navigate("/video/VideoMCQQuestions", {
                    state: { videoData: cell.cell.row.original },
                  });
                }}
              >
                View
              </button>
            ) : null}
          </>
        );
      },
    },
    // {
    //   Header: "View Answered Students",
    //   Cell: (cell) => {
    //     return (
    //       <button
    //         class="btn btn-success"
    //         onClick={() => {
    //           navigate("/videos/answeredStudents", {
    //             state: cell.cell.row.original,
    //           });
    //         }}
    //       >
    //         View
    //       </button>
    //     );
    //   },
    // },
    {
      Header: "Edit",
      Cell: (cell) => {
        return (
          <>
            {permissions?.includes("*15_4") ||
            permissions?.startsWith("15_4") ||
            permissions == "all" ? (
              <button
                className="btn btn-primary"
                onClick={() => {
                  setItem(cell.cell.row.original);
                  setShowEditV(true);
                  getCourses();
                }}
              >
                Edit
              </button>
            ) : null}
          </>
        );
      },
    },
    // {
    //   Header: 'Action',
    //   Cell: (cell) => {
    //     return (
    //       <>
    //         {permissions?.includes("*15_6") ||
    //         permissions?.startsWith("15_6") ||
    //         permissions == "all" ? (
    //           <button
    //             className="btn btn-primary"
    //             onClick={() => {
    //               setItem(cell.cell.row.original);
    //               setShowAssign(true);
    //               getCourses();
    //             }}
    //           >
    //             Assign
    //           </button>
    //         ) : null}
    //       </>
    //     );
    //   },
    // },
  ];

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs title="GroupsVideos" breadcrumbItem="Video List" />

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
                              data-bs-target="#addVideoModal"
                              onClick={() => {
                                setShowAssign(true);
                                navigate("/videos/add-video");
                              }}
                            >
                              <i className="mdi mdi-plus me-1"></i> Add Video
                            </button>
                          </div>
                        </Col>
                      </Row>
                      <Col className="col-sm">
                        <div>
                          {selectedVideos && selectedVideos?.length ? (
                            <button
                              type="button"
                              className="btn btn-success mb-4"
                              data-bs-toggle="modal"
                              data-bs-target="#addVideoModal"
                              onClick={() => {
                                setShowAssignModal(true);
                                // navigate("add-video");
                              }}
                            >
                              <i className="mdi mdi-plus me-1"></i> Change Group
                            </button>
                          ) : null}
                        </div>
                      </Col>
                    </div>
                  </div>
                  <div id="table-invoices-list">
                    {itemLoader ? (
                      <Loader />
                    ) : GroupsVideos && GroupsVideos.length ? (
                      <VideoListTable videos={GroupsVideos} columns={columns} />
                    ) : (
                      <h4>No videos</h4>
                    )}
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
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
            {selectedCourse && Units && Units.length ? (
              <>
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
                    {Units.map((item, index) => {
                      return (
                        <MenuItem value={item.unit_id} key={index}>
                          {item.unit_name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </div>{" "}
              </>
            ) : (
              <h3>No Units In Course</h3>
            )}
            <form
              action="#"
              style={{
                padding: "15px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div className="input_Field">
                <label forHtml="unit_name">Add New Unit</label>
                <Input
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "4px",
                  }}
                  type="text"
                  name="unit_name"
                  id="unit_name"
                  placeholder="unit_name"
                  onChange={(e) => setUnitName(e.currentTarget.value)}
                  required
                />
              </div>
              <button
                className="btn btn-success"
                onClick={(e) => {
                  e.preventDefault();
                  handleOk(e);
                }}
                style={{ margin: "10px 0 0 auto" }}
              >
                {" "}
                Add Unit{" "}
              </button>
            </form>
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
      <Modal isOpen={showEditV}>
        <ModalHeader tag="h4">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              alignItems: "center",
            }}
          >
            <h4> Edit Video </h4>
            <CloseButton
              onClick={() => {
                setShowEditV(false);
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
              editVideo(e);
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
                defaultValue={item?.video_title}
              />
            </div>
            <div className="input_Field">
              <Input
                style={{
                  width: "100%",
                  borderRadius: "4px",
                  margin: "10px 0",
                }}
                type="text"
                name="video_duration"
                id="video_duration"
                placeholder="Enter video duration"
                defaultValue={item?.video_duration}
              />
            </div>

            <div className="input_Field">
              <Input
                style={{
                  width: "100%",
                  borderRadius: "4px",
                  margin: "10px 0",
                }}
                type="text"
                name="vimeo_data"
                id="vimeo_data"
                placeholder="Enter vimeo Link"
                defaultValue={item?.vimeo_data}
              />
            </div>

            <div className="input_Field">
              <Input
                style={{
                  width: "100%",
                  borderRadius: "4px",
                  margin: "10px 0",
                }}
                type="text"
                name="publitio_data"
                id="publitio_data"
                placeholder="Enter publitio Link"
                defaultValue={item?.publitio_data}
                disabled={true}
              />
            </div>
            <div className="input_Field">
              <Input
                style={{
                  width: "100%",
                  borderRadius: "4px",
                  margin: "10px 0",
                }}
                type="text"
                name="cipher_data"
                id="cipher_data"
                placeholder="Enter Cipher ID"
                defaultValue={item?.cipher_data}
              />
            </div>
            <div className="input_Field">
              <Input
                style={{
                  width: "100%",
                  borderRadius: "4px",
                  margin: "10px 0",
                }}
                type="text"
                name="youtube_link"
                id="youtube_link"
                placeholder="Enter youtube Link"
                defaultValue={item?.youtube_link}
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
        </ModalBody>
      </Modal>
      <Modal title="assign exam" isOpen={assignModal}>
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
            hanldeassign();
            // setassignexamshow(false);
          }}
        >
          <CloseButton
            onClick={() => setShowAssignModal(false)}
            style={{ marginLeft: "auto" }}
          />

          <div className="inputField withtext">
            <label htmlFor="exam_name">Groups</label>
            <select
              value={groupId}
              onChange={(e) => setGroupId(e.target.value)}
            >
              {groups && groups?.length
                ? groups.map((item) => {
                    return (
                      <option value={item?.group_id}>{item?.group_name}</option>
                    );
                  })
                : null}
            </select>
          </div>
          <div style={{ marginTop: "30px", textAlign: "end" }}>
            {assignloading ? (
              <Spinner style={{ color: "blue" }} />
            ) : (
              <button className="btn btn-success">assign</button>
            )}
          </div>
        </form>
      </Modal>
      <ToastContainer />
    </React.Fragment>
  );
};

export default GroupsVideos;
