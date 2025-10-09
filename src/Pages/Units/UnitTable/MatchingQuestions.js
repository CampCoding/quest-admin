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
// import CopyQuestion from "./TrueFalseQuestions/true&falseQSsManagement/copy";
// import ShowHideQuestion from "./TrueFalseQuestions/true&falseQSsManagement/showHide";
import MatchingQuestionEdit from "./MatchingQuestions/edit";
import CopyQuestion from "./MatchingQuestions/marchingQSsManagement/copy";
import ShowHideQuestion from "./MatchingQuestions/marchingQSsManagement/showHide";
import MatchingAnswerModal from "./MatchingQuestions/marchingQSsManagement/MatchingAnswerModal";
import MatchingQs from "./MatchingQuestions/add";
const MatchingQuestionsList = ({
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
        "https://camp-coding.tech/quest/platform/admin/matching_qs/select_ques.php",
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
  const [showModal, setShowModal] = useState(false);

  const handleShow = (data) => setShowModal(data);
  const handleClose = () => setShowModal(false);
  const columns = [
    {
      Header: "No",
      Cell: (cell) => {
        return <b>{cell.cell.row.index + 1}</b>;
      },
    },
    {
      Header: "Matching Header ID",
      accessor: "matching_header_id",
    },
    {
      Header: "Title",
      accessor: "matching_title",
    },
    {
      Header: "Body",
      accessor: "matching_body",
    },
    {
      Header: "Image",
      Cell: (cell) => {
        return <img src={cell.cell.row.original.image_url} />;
      },
    },
    // {
    //   Header: "Voice",
    //   Cell: (cell) => {
    //     return <audio className="audioNote" src={cell.cell.row.original.voice_url} controls />;
    //   },
    // },
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
            {cell.cell.row.original.hidden === "yes" ? (
              <VisibilityOff className="hidden" />
            ) : (
              <Visibility className="shown" />
            )}
          </button>
        );
      },
    },
    {
      Header: "Add Answer",
      Cell: (cell) => {
        return (
          <button
            className="btn btn-primary"
            onClick={() => handleShow(cell.cell.row.original)}
          >
            Add Answer
          </button>
        );
      },
    },
    {
      Header: "Edit",
      Cell: (cell) => {
        return (
          <button
            className="btn btn-primary"
            onClick={() => setRowData(cell.cell.row.original)}
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
          <button
            className="btn btn-success"
            onClick={() => setShowCopy(cell.cell.row.original)}
          >
            Copy
          </button>
        );
      },
    },
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
                            Add Matching Questions
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
                  <MatchingQs
                    unit_id={location?.state?.unitData?.unit_id}
                    course_id={location?.state?.unitData?.course_id}
                    getQuestions={getQuestions}
                    setIsModalOpen={setIsModalOpen}
                  />
                </Modal>
                <Modal title="Edit question" isOpen={rowData}>
                  <CloseButton
                    onClick={() => setRowData(null)}
                    style={{ marginLeft: "auto" }}
                  />
                  <MatchingQuestionEdit
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
        <MatchingAnswerModal
          show={showModal}
          handleClose={handleClose}
          matching_header_id={showModal?.matching_header_id}
          answers={showModal?.matching_qs}
          getAnswers={getQuestions}
        />
      </div>
    </React.Fragment>
  );
};

export default MatchingQuestionsList;
