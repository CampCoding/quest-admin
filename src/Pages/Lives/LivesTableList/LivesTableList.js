import axios from "axios";
import React from "react";
import { Row } from "reactstrap";
// import TableContainer from "./../../../../components/Common/TableContainer";
// import { CourseData } from "../../../../CommonData/Data/Course";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import TableContainer from "../../../components/Common/TableContainer";
import { userData } from "../../../store/getProfileData";

const LivesTableList = ({ lives, setEditData, getallLives, type }) => {
  const navigate = useNavigate();
  const permissions = userData?.permissions;
  const columns = [
    {
      Header: "Live ID",
      accessor: "live_id",
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

    {
      Header: "Account Email",
      Cell: (cell) => {
        // console.log("cell.cell.row.original.start_time",cell.cell.row.original.start_time);
        return <span>{cell.cell.row.original?.sdk_data?.account_name}</span>;
      },
      Filter: false,
    }, // {
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
    //           navigate("/livemcqquestion", {
    //             state: { live_id: cell.cell.row.original.live_id }
    //           });
    //           // navigate("/live",{state:{channel_id:cell.cell.row.original?.channel_id,live_id:cell.cell.row.original?.live_id}})
    //         }}
    //       >
    //         poll
    //       </button>
    //     );
    //   },
    //   Filter: false
    // },
    // {
    //   Header: "Go Live",
    //   Cell: (cell) => {
    //     return (
    //       <button
    //         className="btn btn-primary"
    //         onClick={async () => {
    //           await axios.post(
    //             "https://camp-coding.tech/quest/platform/admin/live_poll/start_meeting.php",
    //             {
    //               live_id: cell.cell.row.original?.live_id
    //             }
    //           );
    //           toast.done("Meeting Started")
    //           // navigate("/live", {
    //           //   state: {
    //           //     channel_id: cell.cell.row.original?.channel_id,
    //           //     live_id: cell.cell.row.original?.live_id
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
            {/* <DropdownMenu> */}{" "}
            <>
              {permissions?.includes("*23_2") ||
              permissions?.startsWith("23_2") ||
              permissions == "all" ? (
                <Row>
                  <button
                    className="btn btn-danger"
                    onClick={() => {
                      hadleendlive(cell.cell.row.original?.live_id);
                    }}
                  >
                    end
                  </button>
                  <button
                    style={{ margin: "10px 0" }}
                    className="btn btn-primary"
                    onClick={() => {
                      setEditData(cell.cell.row.original);
                    }}
                  >
                    Edit
                  </button>
                  {type == "vconnect" ? (
                    <button
                      className="btn btn-success"
                      onClick={() => {
                        // setEditData(cell.cell.row.original);
                      }}
                    >
                      Start
                    </button>
                  ) : null}
                </Row>
              ) : null}
            </>
            {/* </DropdownMenu> */}
            {/* </UncontrolledDropdown> */}
          </>
        );
      },
    },
  ];
  const hadleendlive = (live_id) => {
    const data_send = {
      live_id,
    };
    axios
      .post(
        "https://camp-coding.tech/quest/platform/admin/live/updat_live_end.php",
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
      })
      .catch((err) => console.log(err));
  };
  return (
    <React.Fragment>
      <TableContainer
        columns={columns}
        data={lives}
        isGlobalFilter={true}
        customPageSize={10}
        className="Invoice table"
      />
    </React.Fragment>
  );
};

export default LivesTableList;
