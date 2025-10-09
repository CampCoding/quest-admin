import React, { useState } from "react";
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
import { toast } from "react-toastify";
import axios from "axios";
// import TableContainer from "./../../../../components/Common/TableContainer";
// import { CourseData } from "../../../../CommonData/Data/Course";
import { useNavigate } from "react-router-dom";
// import TableContainer from "../../../components/Common/TableContainer";
// import { ExamData } from "../../../CommonData/Data/Exams";
import moment from "moment";
import TableContainer from "../../components/Common/TableContainer";
import { userData } from "../../store/getProfileData";

const CourseWqsTableList = ({ TaskWqs }) => {
  const [showcourseedit, setshowcourseedit] = useState(false);
  const [taskImg, setTaskImg] = useState("");
  const permissions = userData?.permissions;

  const navigate = useNavigate();
  const columns = [
    {
      Header: "task ID",
      accessor: "task_id",
      Filter: false,
    },
    {
      Header: "task question",
      accessor: "task_text",
      //   Filter: false,
    },
    // {
    //   Header: "exam_details",
    //   accessor: "exam_details",
    //   Filter: false,
    // },
    {
      Header: "Timer(h)",
      // accessor: "timer",
      Cell: (cell) => {
        return <span>{cell.cell.row.original.timer / 60}</span>;
      },
      Filter: false,
    },
    {
      Header: "Task Image",
      // accessor: "timer",
      Cell: (cell) => {
        return <img src={cell.cell.row.original.task} alt="" />;
      },
      Filter: false,
    },
    {
      Header: "Actions",
      // accessor: "timer",
      Cell: (cell) => {
        return (
          <>
            {permissions?.includes("*2_3") ||
            permissions?.startsWith("2_3") ||
            permissions == "all" ? (
              <>
                {cell.cell.row.original?.finished == "1" ? (
                  <span>Finished</span>
                ) : (
                  <button
                    onClick={() => {
                      setshowcourseedit({
                        task_id: cell.cell.row.original.task_id,
                      });
                    }}
                    className="btn btn-success"
                  >
                    End Task
                  </button>
                )}
              </>
            ) : null}
          </>
        );
      },
      Filter: false,
    },
    {
      Header: "Results",
      // accessor: "timer",
      Cell: (cell) => {
        return (
          <>
            {permissions?.includes("*2_2") ||
            permissions?.startsWith("2_2") ||
            permissions == "all" ? (
              <button
                onClick={() => {
                  navigate("/taskResult", {
                    state: { task_id: cell.cell.row.original.task_id },
                  });
                }}
                className="btn btn-success"
              >
                View
              </button>
            ) : null}
          </>
        );
      },
      Filter: false,
    },
  ];
  const endTask = () => {
    axios
      .post(
        "https://camp-coding.tech/quest/platform/admin/tasks/finish_task.php",

        showcourseedit
      )
      .then((res) => {
        if (res.status == "success") {
          toast.success(res.message);
          setshowcourseedit(false);
          window.location.reload();
        } else {
          toast.error(res.message);
        }
      });
  };
  return (
    <React.Fragment>
      <TableContainer
        columns={columns}
        data={TaskWqs}
        isGlobalFilter={true}
        customPageSize={10}
        className="Invoice table"
      />
      <Modal isOpen={showcourseedit} toggle={setshowcourseedit}>
        <ModalHeader tag="h4">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              alignItems: "center",
            }}
          >
            <h4>End Task</h4>
            <CloseButton
              onClick={() => {
                setshowcourseedit(false);
              }}
              style={{ marginLeft: "auto" }}
            />
          </div>
        </ModalHeader>
        <ModalBody>
          Are You Sure ..?
          <br />
          <div className="end_btns">
            <button
              className="btn btn-warning"
              onClick={() => endTask()}
              style={{ width: "fit-content !important", margin: "10px" }}
            >
              End
            </button>
            <button
              className="btn btn-success"
              onClick={() => setshowcourseedit(false)}
              style={{ width: "100% !important" }}
            >
              Close
            </button>
          </div>
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
};

export default CourseWqsTableList;
