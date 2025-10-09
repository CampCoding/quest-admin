import React, { useState } from "react";
import {
  CloseButton,
  Container,
  DropdownItem,
  Modal,
  ModalBody,
  ModalHeader,
} from "reactstrap";

import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import TableContainer from "../../components/Common/TableContainer";
import { Loader } from "rsuite";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineLoading } from "react-icons/ai";
import moment from "moment";
import { userData } from "../../store/getProfileData";
// import CourseListTable from "../CourseTable/courseListTable";

const MCQSearch = () => {
  const navigate = useNavigate();
  document.title = "Seach MCQ | Quest ";
  const [rowData, setRowData] = useState({});
  const [showRepModal, setShowRepModal] = useState(false);
  const [showPubModal, setShowPubModal] = useState(false);
  const [replatTxt, setReplayTxt] = useState("");
  const [title, setTitle] = useState("Videos");
  const [type, setType] = useState("videos");
  const [inquires, setInquires] = useState(false);
  const columns = [
    {
      Header: "No",
      Cell: (cell) => {
        return <b>{cell?.cell?.row?.original?.question_id}</b>;
      },
    },
    {
      Header: "question_text",
      accessor: "question_text",
    },
    {
      Header: type == "videos" ? "Video Name" : "Course Name",
      accessor: "name",
      Filter: false,
    },
    {
      Header: "replay",
      Cell: (cell) => {
        return (
          <>
            {permissions?.includes("*25_1") ||
            permissions?.startsWith("25_1") ||
            permissions == "all" ? (
              cell?.cell?.row?.original?.question_replay ? (
                "Replied"
              ) : (
                <button
                  onClick={() => {
                    setShowRepModal(true);
                    setRowData(cell.cell.row.original);
                  }}
                  className="btn btn-primary"
                >
                  Replay
                </button>
              )
            ) : null}
          </>
        );
      },
      Filter: false,
    },
    {
      Header: "status",
      accessor: "public",
      Cell: (cell) => {
        return (
          <>
            {permissions?.includes("*25_2") ||
            permissions?.startsWith("25_2") ||
            permissions == "all" ? (
              <button
                onClick={() => {
                  // handlechangepublic()
                  setShowPubModal(true);
                  setRowData(cell.cell.row.original);
                }}
                className={
                  cell.cell.row.original.public == "yes"
                    ? "showstatus pub btn btn-success"
                    : "showstatus btn nopub btn-danger"
                }
              >
                {cell.cell.row.original.public == "yes" ? "public" : "private"}
              </button>
            ) : null}
          </>
        );
      },
      Filter: false,
    },
    {
      Header: "time",
      accessor: "time",
      Cell: (cell) => {
        return (
          <span>
            {moment(cell.cell.row.original.time).format("Y-M-D H:m:s")}
          </span>
        );
      },
      Filter: false,
    },
    {
      Header: "Show Questions",
      Cell: (cell) => {
        return (
          <button
            className="btn btn-success"
            onClick={() => {
              navigate(
                type == "videos" ? "/videosquestions" : "/studentsquestions",
                {
                  state: { course_id: cell.cell.row.original.course_id },
                }
              );
            }}
          >
            show
          </button>
        );
      },
    },
    //
  ];
  const buttons = [
    { type: "videos", title: "Videos" },
    { type: "course", title: "Courses" },
  ];

  const getInquires = async () => {
    try {
      const inquiresData = await axios.post(
        "https://camp-coding.tech/quest/platform/admin/students/select_student_questions_not_answerd_by_user.php",
        {
          type: type,
          user_id: userData?.user_id,
          university_id: userData?.university_id,
        }
      );
      if (Array.isArray(inquiresData?.message))
        setInquires(inquiresData?.message);
      else setInquires([]);
    } catch (err) {
      setInquires([]);
    }
  };
  useEffect(() => {
    getInquires();
  }, [type]);
  const [pubLoading, setPubLoading] = useState(false);
  const handleChangePubStatus = () => {
    setPubLoading(true);
    const data_send = {
      question_id: rowData.question_id,
      value: rowData.public == "yes" ? "no" : "yes",
      university_id: userData?.university_id,
      user_id: userData?.user_id,
    };
    axios
      .post(
        "https://camp-coding.tech/quest/platform/admin/students/update_show_question_global.php",
        JSON.stringify(data_send)
      )
      .then((res) => {
        if (res.status == "success") {
          toast.success(res.message);
          getInquires();
          // handleupdatedata();
        } else if (res.status == "error") {
          toast.error(res.message);
        } else {
          toast.error("Something Went Wrong");
        }
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setPubLoading(false);
        setShowPubModal(false);
      });
  };
  const handlereplay = () => {
    if (replatTxt == "") {
      toast.warn("Enter The Respond");
      return;
    }
    setPubLoading(true);
    const data_send = {
      question_id: rowData.question_id,
      question_replay: replatTxt,
      university_id: userData?.university_id,
      user_id: userData?.user_id,
    };
    axios
      .post(
        "https://camp-coding.tech/quest/platform/admin/students/add_question_replay.php",
        JSON.stringify(data_send)
      )
      .then((res) => {
        if (res.status == "success") {
          toast.success(res.message);
          getInquires();
          // handleupdatedata();
        } else if (res.status == "error") {
          toast.error(res.message);
        } else {
          toast.error("Something Went Wrong");
        }
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setShowRepModal(false);
        setPubLoading(false);
      });
  };
  const permissions = userData?.permissions;

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
            {!inquires ? (
              <Loader />
            ) : inquires?.length ? (
              <TableContainer
                columns={columns}
                data={inquires}
                isGlobalFilter={true}
                customPageSize={10}
                className="Invoice table"
              />
            ) : (
              <h4>No Inquires</h4>
            )}
          </div>
        </Container>

        <ToastContainer />
      </div>

      <Modal
        title="change status"
        toggle={() => {
          setShowPubModal(!showPubModal);
        }}
        isOpen={showPubModal}
      >
        <ModalHeader>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <h4>Change Question Status</h4>
            <CloseButton
              onClick={() => {
                setShowPubModal(false);
              }}
            />
          </div>
        </ModalHeader>
        <ModalBody>
          <h4>
            Are You Sure That You Want To Change This Status to{" "}
            {rowData.public == "yes" ? "private" : "public"}
          </h4>
          <div
            style={{ display: "flex", alignItems: "center" }}
            className="actions"
          >
            <button
              style={{
                cursor: pubLoading ? "no-drop" : "pointer",
              }}
              disabled={pubLoading}
              onClick={() => {
                handleChangePubStatus();
              }}
              className="btn btn-primary"
            >
              {pubLoading ? <AiOutlineLoading /> : "Yes"}
            </button>
            <button
              onClick={() => {
                setShowPubModal(false);
              }}
              className="btn btn-success"
              style={{ width: "fit-content" }}
            >
              No
            </button>
          </div>
        </ModalBody>
      </Modal>

      <Modal
        title="replay"
        toggle={() => {
          setShowRepModal(!showRepModal);
        }}
        isOpen={showRepModal}
      >
        <ModalHeader>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <h4 style={{ textTransform: "capitalize" }}>
              replay to this question
            </h4>
            <CloseButton
              onClick={() => {
                setShowRepModal(false);
              }}
            />
          </div>
        </ModalHeader>
        <ModalBody>
          <label style={{ fontSize: "22px", marginBottom: "10px" }} htmlFor="">
            Response:
          </label>
          <textarea
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              outline: "none",
              marginTop: "10px",
            }}
            onChange={(e) => {
              setReplayTxt(e.target.value);
            }}
            name=""
            id=""
            cols="30"
            rows="10"
          ></textarea>
          <div
            style={{ display: "flex", alignItems: "center" }}
            className="actions"
          >
            <button
              style={{
                cursor: pubLoading ? "no-drop" : "pointer",
              }}
              disabled={pubLoading}
              onClick={() => {
                handlereplay();
              }}
              className="btn btn-primary"
            >
              {pubLoading ? <AiOutlineLoading /> : "Replay"}
            </button>
          </div>
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
};

export default MCQSearch;
