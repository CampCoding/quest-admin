import React, { useEffect, useState } from "react";
import { Card, CardBody, CloseButton, Col, Modal, Row } from "reactstrap";
// import TableContainer from "./../../../../components/Common/TableContainer";
// import { CourseData } from "../../../../CommonData/Data/Course";
import { Loader } from "rsuite";
import TableContainer from "../../../components/Common/TableContainer";
import TrueFalseQuestion from "./TrueFalseQuestions/add";
import { useLocation } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";
import TrueFalseQuestionEdit from "./TrueFalseQuestions/edit";
import CopyQuestion from "./TrueFalseQuestions/true&falseQSsManagement/copy";
import ShowHideQuestion from "./TrueFalseQuestions/true&falseQSsManagement/showHide";
const TopicTrueFalseQuestionList = ({
  Units,

  passed,
}) => {
  const location = useLocation();
  const [rowData, setRowData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTopic, setselectedTopic] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(false);
  const [showHideForm, setShowHideForm] = useState(false);
  const [questions, setQuestions] = useState(null);
  const [showCopy, setShowCopy] = useState(null);
  const getQuestions = async () => {
    try {
      const data_send = {
        course_id: location?.state?.unitData?.course_id,
        unit_id: location?.state?.unitData?.unit_id,
        topic_label: location?.state?.topicData?.topic_label,
      };
      const get = await axios.post(
        "https://camp-coding.tech/quest/platform/admin/true_false_ques/select_question.php",
        data_send
      );
      setQuestions(get.message);
    } catch (err) {
      setQuestions([]);
    }
  };
  useEffect(() => {
    getQuestions();
  }, []);
  const columns = [
    {
      Header: "No",
      Cell: (cell) => {
        return <b>{cell.cell.row.index + 1}</b>;
      },
    },
    {
      Header: "question id",
      accessor: "qs_id",
    },
    {
      Header: "question Title",
      accessor: "qs_text",
    },
    {
      Header: "question answer",
      accessor: "qs_answer",
    },
    {
      Header: "Hidden",
      Cell: (cell) => {
        return (
          <button
            className="btn"
            onClick={() => {
              const item = cell.cell.row.original;
              setShowHideForm(item);
            }}
          >
            {cell.cell.row.original.hidden == "yes" ? (
              <VisibilityOff className="hidden" />
            ) : (
              <Visibility className="shown" />
            )}
          </button>
        );
      },
    },
    {
      Header: "question Image",
      Cell: (cell) => {
        return <img src={cell.cell.row?.original?.qs_image_url} />;
      },
    },
    {
      Header: "Edit",
      Cell: (cell) => {
        return (
          <button
            className="btn btn-primary"
            onClick={() => setRowData(cell.cell.row?.original)}
          >
            Edit
          </button>
        );
      },
    },
    {
      Header: "Copy",
      Cell: (cell) => {
        return (
          <>
            <button
              className="btn btn-success"
              onClick={() => {
                setShowCopy({ ...cell.cell.row.original });
              }}
            >
              Copy
            </button>
            {/* <button
              style={{ margin: "10px 0" }}
              className="btn btn-primary"
              onClick={() => {
                setMoveData({ ...cell.cell.row.original });
              }}
            >
              Move
            </button> */}
          </>
        );
      },
    },

    // {
    //   Header: 'overall Images',
    //   Cell: (cell) => {
    //     return (
    //       <>
    //         {" "}
    //         <button
    //           className="btn btn-success"
    //           onClick={() => {
    //             setQuestionOpen(cell.cell.row.original);

    //             return setOverAllImages(
    //               cell.cell.row.original.array_overall_image
    //                 ? cell.cell.row.original.array_overall_image
    //                 : []
    //             );

    //           }}
    //         >
    //           {"overall images"}
    //         </button>
    //       </>
    //     );
    //   },
    // },

    // {
    //   Header: 'Status',
    //   Cell: (cell) => {

    //       switch (cell.cell.row.original.hidden) {
    //         case 'no':
    //           return (
    //             <div
    //               style={{ cursor: 'pointer' }}
    //               onClick={() => {
    //                 setshowconf(true);
    //                 setrowdata({
    //                   ...cell.cell.row.original,
    //                   number: cell.cell.row.index + 1,
    //                 });
    //                 // const item = cell.cell.row.original;
    //                 // const send_data = {
    //                 //   hidden_value: item.hidden == "no" ? "yes" : "no",
    //                 //   wq_id: item.wq_id
    //                 // }
    //                 // showHideQuestions(send_data)
    //               }}
    //             >
    //               <Visibility className="shown" />
    //             </div>
    //           );

    //         case 'yes':
    //           return (
    //             <div
    //               style={{ cursor: 'pointer' }}
    //               onClick={() => {
    //                 setshowconf(true);
    //                 setrowdata({
    //                   ...cell.cell.row.original,
    //                   number: cell.cell.row.index + 1,
    //                 });
    //               }}
    //             >
    //               <VisibilityOff className="hidden" />
    //             </div>
    //           );

    //         default:
    //           return (
    //             <span className="badge badge-pill badge-soft-success font-size-12">
    //               {cell.cell.row.original.hidden}
    //             </span>
    //           );
    //       }
    //   },
    // },
  ];
  return (
    <React.Fragment>
      <div className="page-content">
        <Row>
          <Col lg={12}>
            <Card>
              <CardBody>
                <div className="position-relative">
                  <div className="modal-button mt-2">
                    <Row className="align-items-start">
                      <Col className="col-sm">
                        <div>
                          <button
                            class="btn btn-success"
                            onClick={() => {
                              setIsModalOpen(true);
                            }}
                          >
                            Add TrueAndFalse Questions
                          </button>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </div>{" "}
                {!questions ? (
                  <Loader />
                ) : questions.length ? (
                  <TableContainer
                    columns={columns}
                    data={questions}
                    isGlobalFilter={true}
                    customPageSize={10}
                    className="Invoice table"
                  />
                ) : !questions?.length ? (
                  <h2>No Questions</h2>
                ) : (
                  <Loader />
                )}
                <Modal title="add question" isOpen={isModalOpen}>
                  <CloseButton
                    onClick={() => setIsModalOpen(false)}
                    style={{ marginLeft: "auto" }}
                  />
                  <TrueFalseQuestion
                    getQuestions={getQuestions}
                    unit_id={location?.state?.unitData?.unit_id}
                    course_id={location?.state?.unitData?.course_id}
                    topic_label={location?.state?.topicData?.topic_label}
                    setIsModalOpen={setIsModalOpen}
                  />
                </Modal>
                <Modal title="Edit question" isOpen={rowData}>
                  <CloseButton
                    onClick={() => setRowData(null)}
                    style={{ marginLeft: "auto" }}
                  />
                  <TrueFalseQuestionEdit
                    getQuestions={getQuestions}
                    unit_id={location?.state?.unitData?.unit_id}
                    course_id={location?.state?.unitData?.course_id}
                    topic_label={location?.state?.topicData?.topic_label}
                    questionRowData={rowData}
                    setRowData={setRowData}
                  />
                </Modal>{" "}
                <Modal
                  isOpen={showHideForm}
                  toggle={setShowHideForm}
                  close={setShowHideForm}
                >
                  <CloseButton
                    onClick={() => setShowHideForm(false)}
                    style={{ marginLeft: "auto" }}
                  />
                  <ShowHideQuestion
                    unitData={location?.state?.unitData}
                    setSelectedUnit={setSelectedUnit}
                    selectedUnit={selectedUnit}
                    selectedCourse={selectedCourse}
                    setSelectedCourse={setSelectedCourse}
                    getFunction={getQuestions}
                    selectedTopic={selectedTopic}
                    setselectedTopic={setselectedTopic}
                    questionData={showHideForm}
                    setQuestionData={setShowHideForm}
                  />
                </Modal>
                <Modal
                  isOpen={showCopy}
                  toggle={setShowCopy}
                  close={setShowCopy}
                >
                  <CloseButton
                    onClick={() => setShowCopy(false)}
                    style={{ marginLeft: "auto" }}
                  />
                  <CopyQuestion
                    unitData={location?.state?.unitData}
                    setSelectedUnit={setSelectedUnit}
                    selectedUnit={selectedUnit}
                    selectedCourse={selectedCourse}
                    setSelectedCourse={setSelectedCourse}
                    getFunction={getQuestions}
                    selectedTopic={selectedTopic}
                    setselectedTopic={setselectedTopic}
                    questionData={showCopy}
                    setQuestionData={setShowCopy}
                  />
                </Modal>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </React.Fragment>
  );
};

export default TopicTrueFalseQuestionList;
