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
// import TableContainer from "./../../../../components/Common/TableContainer";
// import { CourseData } from "../../../../CommonData/Data/Course";
import { useNavigate } from "react-router-dom";
import TableContainer from "../../../components/Common/TableContainer";
import { ExamData } from "../../../CommonData/Data/Exams";
import moment from "moment";
import { userData } from "../../../store/getProfileData";
import { Loader, Toggle } from "rsuite";
import ExportFile from "../../Units/UnitTable/export";

const ExamListTable = ({ exams, checkExams }) => {
  const navigate = useNavigate();
  const permissions = userData?.permissions;
  const [print, setPrint] = useState(false);
  const [solved, setSolved] = useState(true);
  const [prints, setPrints] = useState(false);
  const [exportFile, setExportFile] = useState(null);

  const [images, setImages] = useState(true);
  const PrintAllQuestions = async (exam_id, exam_name) => {
    console.log(prints);
    const link =
      solved && images
        ? "exam/print_exam_mcqs.php"
        : solved && !images
        ? "exam/print_exam_mcq_without_images.php"
        : !solved && images
        ? "exam/print_exam_mcqs_not_solved.php"
        : !solved && !images
        ? "exam/print_exam_mcq_not_solved_without_images.php"
        : null;
    setPrint(true);
    try {
      window.open(
        "https://camp-coding.tech/quest/platform/admin/mcq_print/print/" +
          link +
          "?id=" +
          exam_id +
          "&name=" +
          exam_name?.split("&")?.join("*camp*"),

        "_blanck"
      );
      setPrint(false);
    } catch (e) {
      console.log(e);
      setPrint(false);
    }
  };
  const columns = [
    {
      Header: "Exam ID",
      accessor: "exam_id",
      Filter: false,
    },
    {
      Header: "exam_name",
      accessor: "exam_name",
      //   Filter: false,
    },
    // {
    //   Header: "exam_details",
    //   accessor: "exam_details",
    //   Filter: false,
    // },
    {
      Header: "Print Questions",
      Cell: (cell) => {
        if (userData?.user_id == 37 || userData?.user_id == 27)
          return (
            <>
              {" "}
              {print ? (
                <Loader />
              ) : (
                <button
                  class="btn btn-success"
                  onClick={() => {
                    setPrints(cell?.cell?.row?.original);
                  }}
                >
                  Print
                </button>
              )}
            </>
          );
      },
    },
    {
      Header: "Download Exam",
      Cell: (cell) => {
        if (userData?.user_id == 37 || userData?.user_id == 27)
          return (
            <>
              {" "}
              {print ? (
                <Loader />
              ) : (
                <button
                  class="btn btn-success"
                  onClick={() => {
                    setExportFile(cell?.cell?.row?.original);
                  }}
                >
                  Download
                </button>
              )}
            </>
          );
      },
    },
    {
      Header: "Timer",
      accessor: "timer",
      Filter: false,
    },
    {
      Header: "start date",
      Cell: (cell) => {
        return (
          <span>
            {moment(cell.cell.row.original.start_date).format("Y-M-D H:m:s")}
          </span>
        );
      },
      Filter: false,
    },
    {
      Header: "end date",
      Cell: (cell) => {
        return (
          <span>
            {moment(cell.cell.row.original.end_date).format("Y-M-D H:m:s")}
          </span>
        );
      },
      Filter: false,
    },
    // {
    //   Header: "Statistics",
    //   Cell: (cell) => {
    //     return (
    //       <button
    //         type="button"
    //         className="btn btn-success"
    //         data-bs-toggle="modal"
    //         data-bs-target="#addCourseModal"
    //         style={{ whiteSpace: "nowrap", width: "fit-content" }}
    //         onClick={() => {
    //           navigate("/examQuestionStatistics", { state: { exam_id: cell.cell.row.original.exam_id } })
    //         }}
    //       >
    //         View
    //       </button>
    //     )
    //   },
    //   Filter: false,
    // },
    {
      Header: "Results",
      Cell: (cell) => {
        return (
          <div>
            {permissions?.includes("*20_2") ||
            permissions?.startsWith("20_2") ||
            permissions == "all" ? (
              <>
                {!cell.cell.row?.original?.have_result ? (
                  <span className="btn btn-primary">No Results</span>
                ) : (
                  <button
                    type="button"
                    className="btn btn-success"
                    data-bs-toggle="modal"
                    data-bs-target="#addCourseModal"
                    style={{ whiteSpace: "nowrap", width: "fit-content" }}
                    onClick={() => {
                      navigate("/examListPublicResult", {
                        state: { exam_id: cell.cell.row.original.exam_id },
                      });
                    }}
                  >
                    Results
                  </button>
                )}
              </>
            ) : null}
          </div>
        );
      },
    },
    {
      Header: "Action",
      Cell: (cell) => {
        return (
          <>
            {/* <UncontrolledDropdown> */}
            {/* <DropdownToggle
                className="btn btn-light btn-sm"
                tag="button"
                data-bs-toggle="dropdown"
                direction="start"
              >
                <i className="bx bx-dots-horizontal-rounded"></i>
              </DropdownToggle> */}
            {/* <DropdownMenu className="dropdown-menu-end"> */}
            {/* <DropdownItem>Edit</DropdownItem> */}
            {permissions?.includes("*20_8") ||
            permissions?.startsWith("20_8") ||
            permissions == "all" ? (
              <button
                className="btn btn-primary"
                onClick={() => {
                  const examdata = { ...cell.cell.row.original };
                  navigate("/publicexamquestion", {
                    state: { examdata },
                  });
                }}
              >
                Show
              </button>
            ) : null}
            <button
              className="btn btn-primary"
              onClick={() => {
                return checkExams ? checkExams(cell.cell.row.original) : null;
              }}
            >
              Check
            </button>
            {/* <Dropd<button
                className="btn btn-primary"
                onClick={() => {
                  const examdata = { ...cell.cell.row.original };
                  navigate("/publicexamquestion", {
                    state: { examdata },
                  });
                }}
              >
                Show
              </button>ownItem
                  onClick={() => {
                    
                    navigate("/examquestion", {
                      state: { examdata: cell.cell.row.original },
                    });
                  }}
                >
                  Show
                </DropdownItem> */}
            {/* <DropdownItem>Delete</DropdownItem> */}
            {/* </DropdownMenu>
            </UncontrolledDropdown> */}
          </>
        );
      },
    },
  ];
  return (
    <React.Fragment>
      <TableContainer
        columns={columns}
        data={exams}
        isGlobalFilter={true}
        customPageSize={10}
        className="Invoice table"
      />

      <div className="prints">
        <Modal isOpen={prints} toggle={setPrints}>
          <ModalHeader tag="h4" className={"printsCloumns"}>
            <h5>Print Questions</h5>{" "}
            <CloseButton
              onClick={() => setPrints(false)}
              style={{ marginLeft: "auto" }}
            />
          </ModalHeader>
          <ModalBody className={"prints"}>
            <div className="rowDiv btnsRowDiv">
              {/* <button
                onClick={() => {
                  PrintAllQuestions(
                    prints?.unit_id,
                    prints?.topic_label,
                    "print_topic_mcqs"
                  );
                }}
                className="btn btn-success"
              >
                Print solved + images
              </button>
              <button
                onClick={() => {
                  PrintAllQuestions(
                    prints?.unit_id,
                    prints?.topic_label,
                    "print_topic_mcq_without_images"
                  );
                }}
                className="btn btn-success"
              >
                Print solved + without-images
              </button>
              <button
                onClick={() => {
                  PrintAllQuestions(
                    prints?.unit_id,
                    prints?.topic_label,
                    "print_topic_mcqs_not_solved"
                  );
                }}
                className="btn btn-success"
              >
                Print not-solved + images
              </button>
              <button
                onClick={() => {
                  PrintAllQuestions(
                    prints?.unit_id,
                    prints?.topic_label,
                    "print_topic_mcq_not_solved_without_images"
                  );
                }}
                className="btn btn-success"
              >
                Print not-solved + without-images
              </button>{" "} */}
              <div className="printsCloumns">
                <div className="printsRowCol">
                  <span>Solved</span>
                  <div className="rowPrints">
                    <span>No</span>
                    <Toggle checked={solved} onChange={(e) => setSolved(e)} />
                    <span>Yes</span>{" "}
                  </div>
                </div>
                <div className="printsRowCol">
                  <span>Images</span>
                  <div className="rowPrints">
                    <span>Not Included</span>
                    <Toggle checked={images} onChange={(e) => setImages(e)} />
                    <span>Included</span>{" "}
                  </div>
                </div>
              </div>
            </div>
            <button
              style={{ margin: "10px", marginLeft: "auto" }}
              className="btn btn-success"
              onClick={() =>
                PrintAllQuestions(prints?.exam_id, prints?.exam_name)
              }
            >
              Print
            </button>
          </ModalBody>
        </Modal>
        <ExportFile modal={exportFile} setModal={setExportFile} type={"exam"} />
      </div>
    </React.Fragment>
  );
};

export default ExamListTable;
