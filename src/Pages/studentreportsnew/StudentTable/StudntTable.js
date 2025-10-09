import React, { useEffect, useState } from "react";
import {
  CloseButton,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Modal,
  UncontrolledDropdown,
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
import { WhatsApp } from "@mui/icons-material";
const StudntListTable = ({ getStudents, Units, courseData, tab }) => {
  const navigate = useNavigate();
  const [item, setItem] = useState(false);
  const [rowdata, setrowdata] = useState({});
  const [showconf, setshowconf] = useState(false);
  const [showconf2, setshowconf2] = useState(false);
  const [showconf3, setshowconf3] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const columns = [
    {
      Header: "No",
      Cell: (cell) => {
        return <b>{cell.cell.row.original?.order_no}</b>;
      },
    },
    {
      Header: "Image",
      Cell: (cell) => {
        return (
          <img
            src={cell.cell.row.original?.student_avater_url}
            alt=""
            style={{ width: "60px" }}
          />
        );
      },
    },
    {
      Header: "student_name",
      accessor: "student_name",
      Filter: false,
    },
    {
      Header: "student_nick_name",
      accessor: "student_nickname",
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
      Header: "WhatsApp",
      Cell: (cell) => {
        return (
          <>
            <span
              style={{
                color: "green",
                display: "block",
                width: "100%",
                textAlign: "center",
                fontSize: "22px",
                height: "100%",
                cursor: "pointer",
              }}
              onClick={() => {
                window.open(
                  "https://wa.me/+20" + cell?.cell?.row?.original?.phone
                );
              }}
            >
              <WhatsApp />
            </span>
          </>
        );
      },
    },
    {
      Header: "Email",
      Cell: (cell) => {
        return (
          <>
            <button
              className="btn btn-primary"
              onClick={() => {
                axios
                  .post(
                    `https://camp-coding.tech/quest/platform/admin/email/send_smtp.php`,
                    {
                      student_email: cell.cell.row.original?.student_email,
                    }
                  )
                  .then((res) => toast.info(res.message));
              }}
            >
              Send
            </button>
          </>
        );
      },
    },
    {
      Header: "Report",
      Cell: (cell) => {
        return (
          <>
            <button
              className="btn btn-primary"
              onClick={() => {
                window.open(
                  `https://camp-coding.tech/quest/platform/admin/email/get_student_data.php?student_email=${cell.cell.row.original?.student_email}`,
                  "_blanck"
                );
              }}
            >
              View
            </button>
          </>
        );
      },
    },
  ];

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
          <h2>No Students</h2>
        ) : null}{" "}
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
    </React.Fragment>
  );
};

export default StudntListTable;
