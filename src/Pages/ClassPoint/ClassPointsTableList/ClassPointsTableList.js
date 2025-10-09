import React, { useState } from "react";
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Row,
  UncontrolledDropdown,
} from "reactstrap";
import axios from "axios";
// import TableContainer from "./../../../../components/Common/TableContainer";
// import { CourseData } from "../../../../CommonData/Data/Course";
import { useNavigate } from "react-router-dom";
import TableContainer from "../../../components/Common/TableContainer";
import { ExamData } from "../../../CommonData/Data/Exams";
import moment from "moment";
import CopyToClipboard from "react-copy-to-clipboard";
import { ContentCopyOutlined } from "@mui/icons-material";
import { toast } from "react-toastify";
import { userData } from "../../../store/getProfileData";

const ClassPointsTableList = ({
  classPoints,
  setEditData,
  getallClassPoints,
}) => {
  const navigate = useNavigate();
  const permissions = userData?.permissions;
  const columns = [
    {
      Header: "ClassPoint ID",
      accessor: "class_point_id",
      Filter: false,
    },
    {
      Header: "title",
      accessor: "title",
      //   Filter: false,
    },
    // {
    //   Header: "exam_details",
    //   accessor: "exam_details",
    //   Filter: false,
    // },
    {
      Header: "university name",
      accessor: "university_name",
      Filter: false,
    },
    {
      Header: "grade name",
      accessor: "grade_name",
      Filter: false,
    },
    // {
    //   Header: "Course name",
    //   accessor: "course_name",
    //   Filter: false
    // },
    {
      Header: "start date",
      Cell: (cell) => {
        return (
          <span>
            {moment(cell.row.original.start_date).format("YYYY-MM-DD")}
          </span>
        );
      },
      Filter: false,
    },
    {
      Header: "start time",
      Cell: (cell) => {
        return (
          <span>
            {moment(cell.row.original.start_time, "HH:mm:ss").format(
              "HH:mm:ss"
            )}
          </span>
        );
      },
      Filter: false,
    },

    // {
    //   Header: "status",
    //   Cell: (cell) => {
    //     return (
    //       <span>{}</span>
    //     )
    //   },
    //   Filter: false,
    // },
    // {
    //   Header: "Meating Id",
    //   Cell: (cell) => {
    //     return (
    //       <CopyToClipboard
    //         style={{
    //           padding: "0 14px",
    //           cursor: "pointer",
    //           width: "100%",
    //           display: "flex",
    //           gap: "10px",
    //           alignItems: "center"
    //         }}
    //         text={cell.cell.row.original?.channel_id}
    //         onCopy={() => toast.success("Copied")}
    //       >
    //         <span
    //           style={{
    //             width: "100%",
    //             display: "flex",
    //             justifyContent: "space-between",
    //             alignItems: "center"
    //           }}
    //         >
    //           <b
    //             style={{ fontSize: "22px", fontWeight: "700", color: "green" }}
    //           >
    //             {cell.cell.row.original?.channel_id}
    //           </b>
    //           <em>
    //             <ContentCopyOutlined />
    //           </em>
    //         </span>
    //       </CopyToClipboard>
    //     );
    //   },
    //   Filter: false
    // },
    // {
    //   Header: "ended",
    //   Cell: (cell) => {
    //     return (
    //       <div>
    //         {cell.cell.row.original.ended!='0'?(<img style={{ width:'20px' }} src={require("../../../assets/images/ended.png")}/>):(
    //           <p style={{ width:'30px',height:'30px',backgroundColor:'yellow',borderRadius:'50%' }}></p>
    //         )}
    //       </div>
    //     )
    //   },
    //   Filter: false,
    // },
    // {
    //   Header: "Poll",
    //   Cell: (cell) => {
    //     return (
    //       <button
    //         className="btn btn-primary"
    //         onClick={() => {
    //           navigate("/classPointmcqquestion", {
    //             state: { classPoint_id: cell.cell.row.original.classPoint_id }
    //           });
    //           // navigate("/classPoint",{state:{channel_id:cell.cell.row.original?.channel_id,classPoint_id:cell.cell.row.original?.classPoint_id}})
    //         }}
    //       >
    //         poll
    //       </button>
    //     );
    //   },
    //   Filter: false
    // },
    // {
    //   Header: "Go ClassPoint",
    //   Cell: (cell) => {
    //     return (
    //       <button
    //         className="btn btn-primary"
    //         onClick={async () => {
    //           await axios.post(
    //             "https://camp-coding.tech/quest/platform/admin/classPoint_poll/start_meeting.php",
    //             {
    //               classPoint_id: cell.cell.row.original?.classPoint_id
    //             }
    //           );
    //           toast.done("Meeting Started")
    //           // navigate("/classPoint", {
    //           //   state: {
    //           //     channel_id: cell.cell.row.original?.channel_id,
    //           //     classPoint_id: cell.cell.row.original?.classPoint_id
    //           //   }
    //           // });
    //         }}
    //       >
    //         Start Meeting
    //       </button>
    //     );
    //   },
    //   Filter: false
    // },
    {
      Header: "Action",
      Cell: (cell) => {
        return (
          <>
            {/* <UncontrolledDropdown>
              <DropdownToggle
                className="btn btn-light btn-sm"
                tag="button"
                data-bs-toggle="dropdown"
                direction="start"
              >
                <i className="bx bx-dots-horizontal-rounded"></i>
              </DropdownToggle> */}
            {/* <DropdownMenu className="dropdown-menu-end"> */}
            {/* <DropdownMenu>{" "} */}
            <>
              <Row style={{ flexWrap: "nowrap" }}>
                <button
                  className="btn btn-success"
                  style={{ width: "fit-content", margin: "10px 5px" }}
                  onClick={() => {
                    hadleendclassPoint(cell.cell.row.original?.class_point_id);
                  }}
                >
                  end
                </button>
                <button
                  style={{ width: "fit-content", margin: "10px 5px" }}
                  className="btn btn-success"
                  onClick={() => {
                    hadlestartclassPoint(
                      cell.cell.row.original?.class_point_id
                    );
                  }}
                >
                  start
                </button>
                <button
                  style={{ width: "fit-content", margin: "10px 5px" }}
                  className="btn btn-success"
                  onClick={() => {
                    setEditData(cell.cell.row.original);
                  }}
                >
                  Edit
                </button>
              </Row>
            </>
            {/* </DropdownMenu> */}
            {/* </UncontrolledDropdown> */}
          </>
        );
      },
    },
  ];
  const hadleendclassPoint = (classPoint_id) => {
    const data_send = {
      class_point_id: classPoint_id,
    };
    axios
      .post(
        "https://camp-coding.tech/quest/platform/admin/class_point/update_class_point_end.php",
        JSON.stringify(data_send)
      )
      .then((res) => {
        if (res.status == "success") {
          toast.success(res.message);
          getallClassPoints();
        } else if (res.status == "error") {
          toast.error(res.message);
        } else {
          toast.error("Something Went Error");
        }
      })
      .catch((err) => console.log(err));
  };
  const hadlestartclassPoint = (classPoint_id, channel_name) => {
    axios
      .post(
        "https://camp-coding.tech/quest/platform/admin/class_point/AccessToken2Sample.php",
        {
          channelName: classPoint_id,
        }
      )
      .then((res1) => {
        if (res1.status == "success") {
          const data_send = {
            class_point_id: classPoint_id,
            AccessToken: res1.message,
          };
          axios
            .post(
              "https://camp-coding.tech/quest/platform/admin/class_point/start_class_point_now.php",
              JSON.stringify(data_send)
            )
            .then((res) => {
              if (res.status == "success") {
                toast.success(res.message);

                navigate(
                  "/via?token=" + res1.message + "&channel=" + classPoint_id
                );
              } else if (res.status == "error") {
                toast.error(res.message);
              } else {
                toast.error("Something Went Error");
              }
            })
            .catch((err) => console.log(err));
        }
      });
  };
  return (
    <React.Fragment>
      <TableContainer
        columns={columns}
        data={classPoints}
        isGlobalFilter={true}
        customPageSize={10}
        getallClassPoints={getallClassPoints}
        className="Invoice table"
      />
    </React.Fragment>
  );
};

export default ClassPointsTableList;
