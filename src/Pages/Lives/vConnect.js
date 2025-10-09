import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Container, Row, Col, Card, Collapse } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import LivesTableList from "./LivesTableList/LivesTableList";
import axios from "axios";
import Select from "react-select";
import "./lives.css";
import {
  CloseButton,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Input,
  Modal,
  Spinner,
  UncontrolledDropdown,
} from "reactstrap";
import { DatePicker } from "rsuite";
import moment from "moment";
import { userData } from "../../store/getProfileData";
const VConnectLives = () => {
  const [showaddlive, setshowaddlive] = useState(false);
  const [lives, setlives] = useState([]);
  const [grades, setgrades] = useState([]);
  // const [courses,setcourses]=useState([]);
  const [universities, setuniversities] = useState([]);
  const [zooms, setZooms] = useState([]);
  const [editData, setEditData] = useState();
  const [AllCourses, setAllCourses] = useState([]);
  const [selecteduni, setselecteduni] = useState("");
  const [selectedgrade, setselectedgrade] = useState("");
  const [selectedcourse, setselectedcourse] = useState("");
  const [randomId, setRandomId] = useState("");
  const [start_date, setstart_date] = useState("");
  const [start_time, setstart_time] = useState("");
  const [title, settitle] = useState("");
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [account_type, setAccountType] = useState(false);
  const generateId = () => {
    let result = "";
    if (result) return result;
    var chars =
        "12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP",
      maxPos = chars.length,
      i;
    for (i = 0; i < 5; i++) {
      result += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    setRandomId(result);
  };
  const permissions = userData?.permissions;

  const getUniversities = () => {
    axios
      .get(
        "https://camp-coding.tech/quest/platform/admin/universities/select_universities_grade.php"
      )
      .then((res) => {
        //
        setuniversities(res?.message);
        setgrades(res?.message[0]?.grades);
        setselecteduni(res?.message[0]?.university_id);
        setselectedgrade(res?.message[0]?.grades[0]?.grade_id);
      });
  };
  const getCourses = async () => {
    // setLoading(true);
    const courses = await axios.get(
      "https://camp-coding.tech/quest/platform/admin/courses/select_courses.php"
    );
    //
    // setAllCourses(courses);
    setAllCourses([
      ...courses.filter(
        (item) =>
          item.grade_id == selectedgrade && item.university_id == selecteduni
      ),
    ]);
    // setFilteredCourses([...courses]);
    setselectedcourse(courses[0].course_id);
  };

  const getallLives = () => {
    axios
      .get(
        "https://camp-coding.tech/quest/platform/admin/live/select_live_new.php"
      )
      .then((res) => {
        setlives(res.message || []);
      });
  };
  const getEmails = () => {
    axios
      .get(
        "https://camp-coding.tech/quest/platform/admin/zoom/select_zoom_can_use.php"
      )
      .then((res) => {
        setZooms(res.message || []);
        setAccountType(
          res?.message && res?.message?.length
            ? res?.message[0]?.account_type
            : "1"
        );
      });
  };
  const createLive = () => {
    const data_send = {
      title,
      course_id: selectedcourse,
      university_id: selecteduni,
      grade_ids: selectedgrade?.map((item) => item?.value)?.join("**matary**"),
      start_date,
      start_time,
      password,
      id,
      account_type: account_type ? account_type : "1",
    };

    axios
      .post(
        "https://camp-coding.tech/quest/platform/admin/live/create_multi_grade_live.php",
        JSON.stringify(data_send)
      )
      .then((res) => {
        if (res.status == "success") {
          toast.success(res.message);
          getallLives();
        } else if (res.status == "error") {
          toast.error(res.message);
        } else {
          toast.error("Something Went Error");
        }
      });
  };

  const editLive = () => {
    axios
      .post(
        "https://camp-coding.tech/quest/platform/admin/live/edit_live.php",
        JSON.stringify(editData)
      )
      .then((res) => {
        if (res.status == "success") {
          toast.success(res.message);
          setEditData(false);
          getallLives();
        } else if (res.status == "error") {
          toast.error(res.message);
        } else {
          toast.error("Something Went Error");
        }
      });
  };

  useEffect(() => {
    getallLives();
  }, []);

  useEffect(() => {
    console.log(selecteduni);
    let alluniversities = [...universities];
    let selecteduniversity = alluniversities.filter(
      (item, index) => item.university_id == selecteduni
    );
    setgrades(selecteduniversity[0]?.grades);
    setselectedgrade(selecteduniversity[0]?.grades[0]?.grade_id);
  }, [selecteduni]);
  useEffect(() => {
    getCourses();
  }, [selectedgrade]);
  useEffect(() => {
    getUniversities();
    getEmails();
  }, []);
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs title="Lives" breadcrumbItem="Home" />
          <Row>
            {permissions?.includes("*23_1") ||
            permissions?.startsWith("23_1") ||
            permissions == "all" ? (
              <Col lg={12}>
                <div className="custom-accordion" id="addcourse-accordion">
                  <Card>
                    <div className="addquestionmcq">
                      <button
                        onClick={() => {
                          setshowaddlive(true);
                        }}
                        className="btn btn-success"
                      >
                        New Live
                      </button>
                    </div>
                  </Card>
                </div>
              </Col>
            ) : null}
          </Row>
          {lives && lives.length ? (
            <LivesTableList
              lives={lives}
              setEditData={setEditData}
              getLives={getallLives}
              type={"vconnect"}
            />
          ) : (
            <h4>no Lives</h4>
          )}
          {/* <LiveQuestionTable  /> */}
        </Container>
      </div>

      <Modal title="Add Live" isOpen={showaddlive} toggle={setshowaddlive}>
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
            createLive();
          }}
        >
          <CloseButton
            onClick={() => setshowaddlive(false)}
            style={{ marginLeft: "auto" }}
          />
          <div className="inputField withtext">
            <label htmlFor="exam_name">Universities</label>
            <select
              onChange={(e) => {
                setselecteduni(e.target.value);
              }}
              value={selecteduni}
              className="form-control"
              name=""
              id=""
            >
              {universities.map((item, index) => {
                //
                return (
                  <option value={item.university_id}>
                    {item.university_name}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="inputField withtext">
            <label htmlFor="exam_name">Grades</label>
            <Select
              onChange={(e) => {
                setselectedgrade(e);
              }}
              // defaultValue={[...courses]}
              isMulti
              name="colors"
              options={grades?.map((item) => {
                //
                return {
                  label: `${item.grade_name}`,
                  value: item?.grade_id,
                };
              })}
              className="basic-multi-select"
              classNamePrefix="select"
            />
          </div>
          {/* <div className="inputField withtext">
            <select
              onChange={(e) => {
                setselectedcourse(e.target.value);
              }}
              value={selectedcourse}
              className="form-control"
              name=""
              id=""
            >
              {AllCourses?.map((item, index) => {
                // 
                return (
                  <option value={item.course_id}>{item.course_name}</option>
                );
              })}
            </select>
          </div> */}
          <div className="mb-3">
            <label className="form-label" htmlFor="end_date">
              Meeting Start Date
            </label>
            {/* <input id="end_date" name="end_date" placeholder="Enter Copoun End Date" type="date" className="form-control" /> */}
            <DatePicker
              onChange={(e) => {
                setstart_date(e);
              }}
              id="end_date"
              name="end_date"
            />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="end_date">
              Meeting Start time
            </label>
            <input
              onChange={(e) => {
                setstart_time(e.target.value);
              }}
              type="time"
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="live_title">
              Live Title
            </label>
            <input
              onChange={(e) => {
                settitle(e.target.value);
              }}
              id="live_title"
              name="title"
              placeholder="Enter Live Title"
              type="text"
              className="form-control"
            />
          </div>

          <div className="mb-3">
            <label className="form-label" htmlFor="live_title">
              meeting Id
            </label>
            <input
              onChange={(e) => {
                setId(e.target.value);
              }}
              id="live_id"
              name="id"
              placeholder="Enter Live Id"
              type="text"
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="live_title">
              meeting Password
            </label>
            <input
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              id="live_password"
              name="password"
              placeholder="Enter Live Password"
              type="text"
              className="form-control"
            />
          </div>

          <button
            onClick={() => {}}
            className="btn btn-success"
            style={{ margin: "10px 0 0 auto" }}
          >
            {" "}
            Add Live{" "}
          </button>
        </form>
      </Modal>

      <Modal title="Edit Live" isOpen={editData} toggle={setEditData}>
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
            editLive();
          }}
        >
          <CloseButton
            onClick={() => setEditData(false)}
            style={{ marginLeft: "auto" }}
          />

          <div className="mb-3">
            <label className="form-label" htmlFor="end_date">
              Meeting Start Date
            </label>
            {/* <input id="end_date" name="end_date" placeholder="Enter Copoun End Date" type="date" className="form-control" /> */}
            <DatePicker
              onChange={(e) => {
                setEditData({ ...editData, start_date: e });
              }}
              id="end_date"
              name="end_date"
            />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="end_date">
              Meeting Start time
            </label>
            <input
              onChange={(e) => {
                setEditData({ ...editData, start_time: e?.target?.value });
              }}
              type="time"
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="live_title">
              Live Title
            </label>
            <input
              value={editData?.title}
              onChange={(e) => {
                setEditData({ ...editData, title: e?.target?.value });
              }}
              id="live_title"
              name="title"
              placeholder="Enter Live Title"
              type="text"
              className="form-control"
            />
          </div>

          <button
            onClick={() => {}}
            className="btn btn-success"
            style={{ margin: "10px 0 0 auto" }}
          >
            {" "}
            Edit Live{" "}
          </button>
        </form>
      </Modal>

      <ToastContainer />
    </React.Fragment>
  );
};

export default VConnectLives;
