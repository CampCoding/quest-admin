import React, { useEffect, useState } from "react";
import {
  CloseButton,
  Col,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Label,
  Modal,
  Row,
  UncontrolledDropdown,
  ModalBody,
  ModalHeader,
} from "reactstrap";
// import TableContainer from "./../../../../components/Common/TableContainer";
import { StudentData } from "../../../CommonData/Data/Studentdata";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import TableContainer from "../../../components/Common/TableContainer";
import axios from "axios";
import { Input, Loader, Toggle } from "rsuite";
import "rsuite/dist/rsuite.min.css";

import { toastPlacements } from "rsuite/esm/toaster/ToastContainer";
import { Icon } from "@mui/material";
import { toast } from "react-toastify";
import Confirm3 from "../../../components/ConfComp/Confirm3";
import { userData } from "../../../store/getProfileData";
import { DatePicker, Select, TimePicker } from "antd";
const StudntListTable = ({ getStudents, Units, courseData, showHideUnit }) => {
  const navigate = useNavigate();
  const [item, setItem] = useState(false);
  const [rowdata, setrowdata] = useState({});
  const [SelectedCourseId, setSelectedCourseId] = useState(null);
  const [SelectedDate, setSelectedDate] = useState("");
  const [deleteId, setDeleteId] = useState(false);
  const [SelectedBookId, setSelectedBookId] = useState(null);
  const [SelectedBookDate, setSelectedBookDate] = useState("");

  const [showconf, setshowconf] = useState(false);
  const [showconf2, setshowconf2] = useState(false);
  const [showconf3, setshowconf3] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [SubscriptionModal, setSubscriptionModal] = useState(false);
  const [BookSubscriptionModal, setBookSubscriptionModal] = useState(false);
  const [Courses, setCourses] = useState([]);
  const [Books, setBooks] = useState([]);

  const getCourses = async () => {
    const blocked = await axios.get(
      "https://camp-coding.tech/quest/platform/admin/courses/select_courses.php"
      // { student_id: id, status: value }
    );
    setCourses(blocked);
  };

  const getBook = async () => {
    const blocked = await axios.get(
      "https://camp-coding.tech/quest/platform/admin/subscription/select_books.php"
      // { student_id: id, status: value }
    );
    setBooks(blocked.message);
  };

  useEffect(() => {
    getCourses();
    getBook();
  }, []);

  const coursesOptions = Courses.map((course) => ({
    label: course.course_name,
    value: course.course_id,
  }));
  console.log(coursesOptions);

  const AddStudentSub = async (id) => {
    await axios
      .post(
        "https://camp-coding.tech/quest/platform/admin/subscription/add_subject_student.php",
        {
          student_id: id,
          course_id: SelectedCourseId.join("**"),
          subscription_end_date: SelectedDate,
        }
      )
      .then((res) => {
        if (res.status == "success") {
          toast.success("Updated");
          getStudents();
          setSubscriptionModal(false);
          setSelectedCourseId(null);
          setSelectedDate("");
        } else {
          toast.error(res.message);
        }
      })
      .catch((err) => {
        toast.error("Error occured, try again later");
      });
  };

  const AddStudentBookSub = async (id) => {
    await axios
      .post(
        "https://camp-coding.tech/quest/platform/admin/subscription/add_book_sub.php",
        {
          student_id: id,
          book_id: SelectedBookId.join("**"),
          subscription_end_date: SelectedBookDate,
        }
      )
      .then((res) => {
        if (res.status == "success") {
          toast.success("Updated");
          getStudents();
          setBookSubscriptionModal(false);
          setSelectedBookId(null);
          setSelectedBookDate("");
        } else {
          toast.error(res.message);
        }
      })
      .catch((err) => {
        toast.error("Error occured, try again later");
      });
  };

  const changeSerial = async () => {
    const new_serial = await axios.post(
      "https://camp-coding.tech/quest/platform/admin/students/update_serial_num_empty.php",
      { student_id: item.student_id }
    );
    if (new_serial.status == "success") {
      toast.success("Updated");
      getStudents();
    } else {
      toast.error(new_serial.message);
    }
  };
  const changeBlock = async (id, value) => {
    console.log({ student_id: item.student_id, status: value });
    const blocked = await axios.post(
      "https://camp-coding.tech/quest/platform/admin/students/update_ban_student.php",
      { student_id: id, status: value }
    );
    if (blocked.status == "success") {
      toast.success("Updated");
      getStudents();
    } else {
      toast.error(blocked.message);
    }
  };
  const changeSimCard = async (id, value) => {
    console.log(value);
    const simCard = await axios.post(
      "https://camp-coding.tech/quest/platform/admin/students/update_sim_card.php",
      { student_id: id, status: value }
    );
    if (simCard.status == "success") {
      toast.success("Updated");
      getStudents();
    } else {
      toast.error(simCard.message);
    }
  };
  const changeHeadPhone = async (id, value) => {
    console.log(value);
    const headPhone = await axios.post(
      "https://camp-coding.tech/quest/platform/admin/students/update_head_phone_jack.php",
      { student_id: id, status: value }
    );
    if (headPhone.status == "success") {
      toast.success("Updated");
      getStudents();
    } else {
      toast.error(headPhone.message);
    }
  };
  const permissions = userData?.permissions;

  const columns = [
    {
      Header: "No",
      Cell: (cell) => {
        return <b>{cell.cell.row.index + 1}</b>;
      },
    },
    {
      Header: "student_name",
      accessor: "student_name",
      Filter: false,
    },
    {
      Header: "Email",
      accessor: "student_email",
      Filter: false,
    },
    {
      Header: "Phone Number",
      accessor: "phone",
      Filter: false,
    },
    {
      Header: "University Name",
      accessor: "university_name",
      Filter: false,
    },
    {
      Header: "Device Serial",
      accessor: "device_serial",
      Cell: (cell) => {
        const itemN = cell.cell.row.original;
        return (
          <>
            {permissions?.includes("*19_3") ||
            permissions?.startsWith("19_3") ||
            permissions == "all" ? (
              <span>
                {itemN.device_serial && itemN.device_serial.length ? (
                  <button
                    className="btn btn-danger"
                    style={{ whiteSpace: "nowrap" }}
                    onClick={() => {
                      setItem(cell.cell.row.original);
                      setIsModalOpen(true);
                    }}
                  >
                    Reset Serial
                  </button>
                ) : null}
              </span>
            ) : null}
          </>
        );
      },
    },
    {
      Header: "subscription",
      Cell: (cell) => {
        const itemN = cell.cell.row.original;
        return (
          <span
            className="btn btn-warning"
            onClick={() => {
              setSubscriptionModal(true);
              setrowdata(itemN);
            }}
          >
            add subscription
          </span>
        );
      },
    },
    {
      Header: "book subscription",
      Cell: (cell) => {
        const itemN = cell.cell.row.original;
        return (
          <span
            className="btn btn-warning"
            onClick={() => {
              setBookSubscriptionModal(true);
              setrowdata(itemN);
            }}
          >
            add book subscription
          </span>
        );
      },
    },
    {
      Header: "delete",
      Cell: (cell) => {
        const itemN = cell.cell.row.original;
        return (
          <span>
            <button
              className="btn btn-danger"
              onClick={() => {
                setDeleteId(true);
                setrowdata(cell.cell.row.original);
              }}
            >
              Delete
            </button>
          </span>
        );
      },
    },
    {
      Header: "Statistics",
      Cell: (cell) => {
        const itemN = cell.cell.row.original;
        return (
          <span
            className="btn btn-warning"
            onClick={() => {
              navigate(`/StudentStatistics/${itemN.student_id}`, {
                state: { student: itemN },
              });
            }}
          >
            Statistics
          </span>
        );
      },
    },
    {
      Header: "HeadPhone",
      Cell: (cell) => {
        const itemN = cell.cell.row.original;
        return (
          <span>
            {permissions?.includes("*19_4") ||
            permissions?.startsWith("19_4") ||
            permissions == "all" ? (
              <Toggle
                size="md"
                checked={itemN.skip_headphone == "no" ? false : true}
                onChange={() => {
                  // changeHeadPhone(itemN.student_id, itemN.skip_headphone == "no" ? "yes" : "no")
                  setrowdata(cell.cell.row.original);
                  setshowconf(true);
                }}
              />
            ) : null}

            {/* <Toggle size="md" checked={itemN.skip_headphone == "no" ? false : true} onChange={() => changeHeadPhone(itemN.student_id, itemN.skip_headphone == "no" ? "yes" : "no")} /> */}
          </span>
        );
      },
    },
    {
      Header: "Sim Card",
      Cell: (cell) => {
        const itemN = cell.cell.row.original;
        return (
          <span>
            {permissions?.includes("*19_5") ||
            permissions?.startsWith("19_5") ||
            permissions == "all" ? (
              <Toggle
                size="md"
                checked={itemN.skip_sim == "no" ? false : true}
                onChange={() => {
                  setrowdata(cell.cell.row.original);
                  setshowconf2(true);
                  // changeSimCard(itemN.student_id, itemN.skip_sim == "no" ? "yes" : "no")
                }}
              />
            ) : null}
            {/* <Toggle size="md" checked={itemN.skip_sim == "no" ? false : true} onChange={() => changeSimCard(itemN.student_id, itemN.skip_sim == "no" ? "yes" : "no")} /> */}
          </span>
        );
      },
    },
    {
      Header: "Blocked",
      Cell: (cell) => {
        const itemN = cell.cell.row.original;
        return (
          <span>
            {permissions?.includes("*19_6") ||
            permissions?.startsWith("19_6") ||
            permissions == "all" ? (
              <Toggle
                size="modal"
                checked={itemN.blocked == "no" ? false : true}
                onChange={() => {
                  // changeBlock(itemN.student_id, itemN.blocked == "no" ? "yes" : "no")
                  setshowconf3(true);
                  setrowdata(cell.cell.row.original);
                }}
              />
            ) : null}
          </span>
        );
      },
    },
    {
      Header: "Notifications",
      Cell: (cell) => {
        const itemN = cell.cell.row.original;
        return (
          <span
            className="btn btn-warning"
            onClick={() =>
              navigate("/Notifications", { state: { student: itemN } })
            }
          >
            Notifications
          </span>
        );
      },
    },
    {
      Header: "Actions",
      Cell: (cell) => {
        return (
          <>
            <UncontrolledDropdown>
              <DropdownToggle
                className="btn btn-light btn-sm"
                tag="button"
                data-bs-toggle="dropdown"
                direction="start"
              >
                <i className="bx bx-dots-horizontal-rounded"></i>
              </DropdownToggle>

              <DropdownMenu
                className="dropdown-menu-end"
                style={{ width: "100%", textAlign: "center" }}
              >
                <button
                  className="btn btn-success"
                  onClick={() =>
                    navigate("/StudentVideosStats", {
                      state: { student: cell?.cell?.row?.original },
                    })
                  }
                >
                  Videos Stats
                </button>

                <>
                  {permissions?.includes("*19_7") ||
                  permissions?.startsWith("19_7") ||
                  permissions == "all" ? (
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        navigate("/studentcourses", {
                          state: {
                            coursedata: StudentData,
                            unitData: cell.cell.row.original,
                          },
                        });
                      }}
                    >
                      View
                    </button>
                  ) : null}
                </>
                <button
                  style={{ margin: "10px 0" }}
                  className="btn btn-success"
                  onClick={() =>
                    navigate("/StudentBookStats", {
                      state: { student: cell?.cell?.row?.original },
                    })
                  }
                >
                  Book Stats
                </button>
              </DropdownMenu>
            </UncontrolledDropdown>
          </>
        );
      },
    },
  ];

  const handelDelete = async () => {
    axios
      .post(
        "https://camp-coding.tech/quest/platform/admin/students/delete_studnet.php",
        { student_id: rowdata?.student_id }
      )
      .then((res) => {
        if (res.status == "success") {
          toast.success(res.message);
          setDeleteId(false);
          setrowdata({});
          getStudents();
        } else if (res.status == "error") {
          toast.error(res.message);
        } else {
          toast.error("Something Went Error");
        }
      })
      .catch((err) => toast.error(err));
  };

  return (
    <React.Fragment>
      <div
        className="student_table"
        style={{ width: "100%", overflow: "auto", padding: "10px" }}
      >
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
        )}{" "}
      </div>

      <Modal title="Reset Serial" isOpen={isModalOpen}>
        <form
          action="#"
          style={{
            padding: "15px",
            display: "flex",
            flexDirection: "column",
          }}
          onSubmit={(e) => {
            e.preventDefault();
            changeSerial(e);
            setIsModalOpen(false);
          }}
        >
          <div className="modal-header">
            <h5 className="modal-title" id="orderdetailsModalLabel">
              {" "}
              Are You Sure Reset Serial For Student{" "}
              <span style={{ fontWeight: "700", color: "red" }}>
                ({item?.student_name}) ?
              </span>{" "}
            </h5>
            <CloseButton
              onClick={() => setIsModalOpen(false)}
              style={{ marginLeft: "auto" }}
            />
          </div>

          <button
            className="btn btn-danger"
            style={{ margin: "10px 0 0 auto" }}
          >
            {" "}
            Reset Serial{" "}
          </button>
        </form>
      </Modal>

      <Modal title="Add student subscription" isOpen={SubscriptionModal}>
        <div
          style={{
            padding: "15px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div className="modal-header">
            <CloseButton
              onClick={() => setSubscriptionModal(false)}
              style={{ marginLeft: "auto" }}
            />
          </div>

          <Row>
            <Col md={12}>
              <div className="mb-3">
                <Label className="form-label">select courses</Label>
                <Select
                  style={{ width: "100%" }}
                  options={coursesOptions}
                  value={SelectedCourseId}
                  mode="multiple"
                  onChange={(value) => setSelectedCourseId(value)}
                  showSearch
                  placeholder="Select a course"
                  optionFilterProp="label"
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                />
              </div>
              <div className="mb-3">
                <Label className="form-label">subscription end date</Label>
                <DatePicker
                  format="YYYY-MM-DD HH:mm:ss"
                  style={{ width: "100%" }}
                  showTime
                  onChange={(date, dateString) => {
                    setSelectedDate(dateString);
                  }}
                />
              </div>
            </Col>
          </Row>

          <button
            className="btn btn-danger"
            style={{ margin: "10px 0 0 auto" }}
            onClick={() => AddStudentSub(rowdata.student_id)}
          >
            Add
          </button>
        </div>
      </Modal>

      <Modal
        title="Add student book subscription"
        isOpen={BookSubscriptionModal}
      >
        <div
          style={{
            padding: "15px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div className="modal-header">
            <CloseButton
              onClick={() => setBookSubscriptionModal(false)}
              style={{ marginLeft: "auto" }}
            />
          </div>

          <Row>
            <Col md={12}>
              <div className="mb-3">
                <Label className="form-label">select books</Label>
                <Select
                  style={{ width: "100%" }}
                  options={Books}
                  value={SelectedBookId}
                  mode="multiple"
                  onChange={(value) => setSelectedBookId(value)}
                  showSearch
                  placeholder="Select books"
                  optionFilterProp="label"
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                />
              </div>
              <div className="mb-3">
                <Label className="form-label">subscription end date</Label>
                <DatePicker
                  format="YYYY-MM-DD HH:mm:ss"
                  style={{ width: "100%" }}
                  showTime
                  onChange={(date, dateString) => {
                    setSelectedBookDate(dateString);
                  }}
                />
              </div>
            </Col>
          </Row>

          <button
            className="btn btn-danger"
            style={{ margin: "10px 0 0 auto" }}
            onClick={() => AddStudentBookSub(rowdata.student_id)}
          >
            Add
          </button>
        </div>
      </Modal>

      {showconf ? (
        <Confirm3
          id={rowdata.number}
          cancleoperpaid={() => {
            setshowconf(false);
            // console.log("eew")
          }}
          confirmoperpaid={() => {
            // console.log("eew")
            // const send_data = {
            //   student_id:rowdata.student_id,
            //   status:rowdata.skip_headphone == "no" ? "yes" : "no"
            // }
            let value = rowdata.skip_headphone == "no" ? "yes" : "no";
            changeHeadPhone(rowdata.student_id, value);
            setshowconf(false);
          }}
          status={rowdata.skip_headphone == "no" ? "active" : "non active"}
          comp={"HeadePhone"}
        />
      ) : null}
      {showconf2 ? (
        <Confirm3
          id={rowdata.number}
          cancleoperpaid={() => {
            setshowconf2(false);
            // console.log("eew")
          }}
          confirmoperpaid={() => {
            // console.log("eew")
            // const send_data = {
            //   student_id:rowdata.student_id,
            //   status:rowdata.skip_headphone == "no" ? "yes" : "no"
            // }

            let value = rowdata.skip_sim == "no" ? "yes" : "no";
            changeSimCard(rowdata.student_id, value);
            setshowconf2(false);
          }}
          status={rowdata.skip_sim == "no" ? "active" : "non active"}
          comp={"Sim Card"}
        />
      ) : null}
      {showconf3 ? (
        <Confirm3
          id={rowdata.number}
          cancleoperpaid={() => {
            setshowconf3(false);
            // console.log("eew")
          }}
          confirmoperpaid={() => {
            // console.log("eew")
            // const send_data = {
            //   student_id:rowdata.student_id,
            //   status:rowdata.skip_headphone == "no" ? "yes" : "no"
            // }

            let value = rowdata.blocked == "no" ? "yes" : "no";
            changeBlock(rowdata.student_id, value);
            setshowconf3(false);
          }}
          status={rowdata.blocked == "no" ? "block" : "yes"}
          comp={"Sim Card"}
        />
      ) : null}

      <Modal isOpen={deleteId} toggle={() => setDeleteId(false)}>
        <ModalHeader toggle={() => setDeleteId(false)} tag="h4">
          Delete User
        </ModalHeader>
        <ModalBody>
          <Row>
            <Col md={12}>
              <h2>Are You Sure ?</h2>
            </Col>
          </Row>
          <Row>
            <Col>
              <div className="text-end">
                <button
                  onClick={() => handelDelete()}
                  className="btn btn-danger"
                >
                  Delete
                </button>
              </div>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
};

export default StudntListTable;
