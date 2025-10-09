import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Row,
  Col,
  Container,
  Modal,
  Card,
  CardBody,
  Input,
  CloseButton,
  Spinner,
} from "reactstrap";
import Select from "react-select";
//Import Flatepicker
import "flatpickr/dist/themes/material_blue.css";
import "./imagefolder.css";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { Slider, Stack } from "@mui/material";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import moment from "moment";
import ImageFolderTableList from "./ImagesFloderTable/ImageFolderTableList";
import { AiOutlineLoading } from "react-icons/ai";
import { userData } from "../../store/getProfileData";
// import CourseListTable from "../CourseTable/courseListTable";

const ImagesFolder = () => {
  document.title = "Folders | Quest ";

  //
  const [Folders, SetFolders] = useState([]);
  const navigate = useNavigate();

  const [examdata, setexamdata] = useState({
    exam_name: "",
    timer: "",
    end_date: "",
    start_date: "",
  });
  const [courses, setcourses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [assignexamshow, setassignexamshow] = useState(false);
  const [addloading, setaddloading] = useState(false);
  const [exams, setexams] = useState([]);

  const [selectedexam, setselectedexam] = useState("");
  const [ExamdataNewTime, setexamdataNewTime] = useState("");
  const [pageLoading, setPageLoading] = useState(true);
  const [coursesassined, setcoursesassined] = useState([]);

  const [assignloading, setassignloading] = useState(false);

  const [timerChecked, setChecked] = useState(false);
  const [deadLineChecked, setDeadLineChecked] = useState(false);
  // deadLineChecked
  const permissions = userData?.permissions;
  const handleAddFolder = () => {
    setaddloading(true);
    axios
      .get(
        "https://camp-coding.tech/quest/platform/admin/images_data/create_folder.php"
      )
      .then((res) => {
        if (res.status == "success") {
          toast.success(res.message);
          getFolders();
        } else if (res.status == "error") {
          toast.error(res.message);
        } else {
          toast.error("Something Went Error");
        }
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setaddloading(false);
      });
  };
  const getFolders = () => {
    setPageLoading(true);
    axios
      .get(
        "https://camp-coding.tech/quest/platform/admin/images_data/select_folders_data.php"
      )
      .then((res) => {
        if (Array.isArray(res)) {
          SetFolders(res?.filter((item, index) => index > 1));
        }
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setPageLoading(false);
      });
  };
  useEffect(() => {
    getFolders();
  }, []);
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs title="Folders" breadcrumbItem="" />

          <Row>
            <Col lg={12}>
              <Card>
                <div className="position-relative">
                  <div className="modal-button mt-2">
                    <Row className="align-items-start">
                      <Col className="col-sm">
                        <div>
                          {permissions?.includes("*11_2") ||
                          permissions?.startsWith("11_2") ||
                          permissions == "all" ? (
                            <button
                              style={{
                                cursor: addloading ? "no-drop" : "pointer",
                              }}
                              disabled={addloading}
                              type="button"
                              className="btn btn-success mb-4"
                              data-bs-toggle="modal"
                              data-bs-target="#addCourseModal"
                              onClick={() => {
                                handleAddFolder();
                              }}
                            >
                              {addloading ? (
                                <AiOutlineLoading />
                              ) : (
                                <>
                                  <i className="mdi mdi-plus me-1"></i> Add
                                  Folder
                                </>
                              )}
                            </button>
                          ) : null}
                        </div>
                      </Col>
                    </Row>
                  </div>
                </div>
                <CardBody>
                  <div id="table-invoices-list">
                    <ImageFolderTableList exams={Folders} />
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>

        <Modal title="add exam" isOpen={isModalOpen}>
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
              // handleaddexam();
              setIsModalOpen(false);
            }}
          >
            <CloseButton
              onClick={() => setIsModalOpen(false)}
              style={{ marginLeft: "auto" }}
            />

            <div className="inputField withtext">
              <label htmlFor="exam_name">Exam Name</label>
              <Input
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "4px",
                }}
                type="text"
                name="exam_name"
                id="exam_name"
                placeholder="exam name"
                required
                onChange={(e) => {
                  setexamdata({ ...examdata, exam_name: e.target.value });
                }}
              />
            </div>
            {/* <div className="inputField withtext">
              <label htmlFor="exam_details">courses</label>
              <select value={examdata.course_id} onChange={(e)=>{
                setexamdata({...examdata,course_id:e.target.value})
              }} className="form-select" name="" id="">
                {
                  courses.map((item)=>{
                    return (
                      <option value={item.course_id}>{item.course_name}</option>
                    )
                  })
                }
              </select>
            </div> */}
            {/* <div className="inputField withtext">
              <label htmlFor="exam_details">Exam Details</label>
              <textarea
                style={{ height: "100px" }}
                id="hours"
                name="explanation"
                placeholder="Enter Explanation"
                type="number"
                className="form-control"
              ></textarea>
            </div> */}
            {/* <div className="inputField withtext">
              <label htmlFor="exam_degree">Exam Degree</label>
              <Input
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "4px",
                }}
                type="text"
                name="exam_degree"
                id="exam_degree"
                placeholder="exam_degree"
                required
              />
            </div> */}
            <div className="checkedBoxes">
              <div className="inputField">
                <label
                  className={timerChecked ? "active" : null}
                  htmlFor="exam_istimed"
                >
                  {" "}
                  With timer ?
                </label>
                <Input
                  style={{
                    padding: "10px",
                    borderRadius: "4px",
                    display: "none",
                  }}
                  type="checkbox"
                  name="exam_istimed"
                  id="exam_istimed"
                  placeholder="exam_istimed"
                  required
                  checked={timerChecked}
                  onChange={(e) => setChecked(e.currentTarget.checked)}
                />
                {timerChecked ? (
                  <div className="inputField withtext">
                    <label htmlFor="time">Minutes</label>
                    <Stack
                      spacing={2}
                      direction="row"
                      sx={{ mb: 1 }}
                      alignItems="center"
                      style={{
                        padding: "0.47rem 0.75rem",
                      }}
                    >
                      <Slider
                        aria-label="time"
                        min={0}
                        max={200}
                        valueLabelDisplay="auto"
                        onChange={(e) => {
                          //
                          setexamdata({ ...examdata, timer: e.target.value });
                        }}
                      />
                    </Stack>
                  </div>
                ) : null}
              </div>

              <div className="inputField">
                <label
                  className={deadLineChecked ? "active" : null}
                  htmlFor="exam_isDeadLined"
                >
                  {" "}
                  start date ?
                </label>
                <Input
                  style={{
                    padding: "10px",
                    borderRadius: "4px",

                    display: "none",
                  }}
                  type="checkbox"
                  name="exam_isDeadLined"
                  id="exam_isDeadLined"
                  placeholder="exam_isDeadLined"
                  required
                  checked={deadLineChecked}
                  onChange={(e) => setDeadLineChecked(e.currentTarget.checked)}
                />
                {deadLineChecked ? (
                  <div className="inputField withtext">
                    <label htmlFor="time">Start Date</label>
                    <Input
                      onChange={(e) => {
                        //
                        setexamdata({
                          ...examdata,
                          start_date: moment(Date.now()).format("Y-M-D H:m:s"),
                        });
                      }}
                      type="date"
                    />
                  </div>
                ) : null}
              </div>
              <div className="inputField">
                <label
                  className={deadLineChecked ? "active" : null}
                  htmlFor="exam_end"
                >
                  {" "}
                  end date ?
                </label>
                <Input
                  style={{
                    padding: "10px",
                    borderRadius: "4px",

                    display: "none",
                  }}
                  type="checkbox"
                  name="exam_end"
                  id="exam_end"
                  placeholder="end exam"
                  required
                  checked={deadLineChecked}
                  // onChange={(e) => setDeadLineChecked(e.currentTarget.checked)}
                />
                {deadLineChecked ? (
                  <div className="inputField withtext">
                    <label htmlFor="time">end Date</label>
                    <Input
                      onChange={(e) => {
                        //
                        //
                        setexamdata({
                          ...examdata,
                          end_date: moment(Date.now()).format("Y-M-D H:m:s"),
                        });
                      }}
                      type="date"
                    />
                  </div>
                ) : null}
              </div>
            </div>
            {addloading ? (
              <div
                style={{
                  textAlign: "end",
                }}
              >
                <Spinner style={{ color: "blue" }} />
              </div>
            ) : (
              <button
                className="btn btn-success"
                style={{ margin: "10px 0 0 auto" }}
              >
                {" "}
                Add Exam{" "}
              </button>
            )}
          </form>
        </Modal>

        <Modal title="assign exam" isOpen={assignexamshow}>
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
              // hanldeassign();
              // setassignexamshow(false);
            }}
          >
            <CloseButton
              onClick={() => setassignexamshow(false)}
              style={{ marginLeft: "auto" }}
            />

            <div className="inputField withtext">
              <label htmlFor="exam_name">Exam Name</label>
              <select
                onChange={(e) => {
                  // set
                  setselectedexam(e.target.value);
                }}
                value={selectedexam}
                className="form-control"
                name=""
                id=""
              >
                {exams && exams.length
                  ? exams.map((item) => {
                      return (
                        <option value={item.exam_id}>{item.exam_name}</option>
                      );
                    })
                  : null}
              </select>
            </div>

            <div className="inputField withtext">
              <label htmlFor="time">Minutes</label>
              <Stack
                spacing={2}
                direction="row"
                sx={{ mb: 1 }}
                alignItems="center"
                style={{
                  padding: "0.47rem 0.75rem",
                }}
              >
                <Slider
                  aria-label="time"
                  min={0}
                  max={200}
                  valueLabelDisplay="auto"
                  onChange={(e) => {
                    //
                    setexamdataNewTime(e.target.value);
                  }}
                />
              </Stack>
            </div>

            <div className="inputField withtext">
              <label htmlFor="exam_name">Course</label>
              <Select
                onChange={(e) => {
                  setcoursesassined(e);
                }}
                // defaultValue={[...courses]}
                isMulti
                name="colors"
                options={courses.map((item) => {
                  //
                  return {
                    label: `${item.course_name}(${item.university_name} / ${item.grade_name})`,
                    value: item.course_id,
                  };
                })}
                className="basic-multi-select"
                classNamePrefix="select"
              />
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
      </div>
      <ToastContainer />
    </React.Fragment>
  );
};

export default ImagesFolder;
