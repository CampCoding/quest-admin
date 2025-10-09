import React from "react";
import {
  CloseButton,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Modal,
  ModalBody,
  ModalHeader,
  UncontrolledDropdown,
} from "reactstrap";
// import TableContainer from "./../../../../components/Common/TableContainer";
// import { CourseData } from "../../../../CommonData/Data/Course";
import { useNavigate } from "react-router-dom";
import TableContainer from "../../../components/Common/TableContainer";
import { ExamData } from "../../../CommonData/Data/Exams";
import moment from "moment";
import { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { AiOutlineLoading } from "react-icons/ai";
import { userData } from "../../../store/getProfileData";
const StudentTableList = ({ exams, handleupdatedata }) => {
  const navigate = useNavigate();
  const [rowData, setRowData] = useState({});
  const [showRepModal, setShowRepModal] = useState(false);
  const [showPubModal, setShowPubModal] = useState(false);
  const [replatTxt, setReplayTxt] = useState("");
  const permissions = userData?.permissions;

  const columns = [
    {
      Header: "Question ID",
      accessor: "question_id",
      Filter: false,
    },
    {
      Header: "Course Name",
      accessor: "name",
      Filter: false,
    },
    {
      Header: "Question Text",
      accessor: "question_text",
    },
    {
      Header: "Question replay",
      accessor: "question_replay",
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
      Header: "Action",
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
              <DropdownMenu className="dropdown-menu-end">
                <DropdownItem>Edit</DropdownItem>
                <DropdownItem
                  onClick={() => {
                    const examdata = { ...cell.cell.row.original };
                    navigate("/examquestion", {
                      state: { examdata },
                    });
                  }}
                >
                  Show
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </>
        );
      },
    },
  ];
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
          handleupdatedata();
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
          handleupdatedata();
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
  return (
    <React.Fragment>
      <TableContainer
        columns={columns}
        data={exams}
        isGlobalFilter={true}
        customPageSize={10}
        className="Invoice table"
      />

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

      <ToastContainer />
    </React.Fragment>
  );
};

export default StudentTableList;
