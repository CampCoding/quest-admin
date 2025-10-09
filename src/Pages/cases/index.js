import React, { useState } from "react";
import {
  Col,
  Container,
  Form,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
} from "reactstrap";

import { Icon } from "@iconify/react";
import axios from "axios";
import { useCallback, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { Loader } from "rsuite";
import TableContainer from "../../components/Common/TableContainer";
import { userData } from "../../store/getProfileData";
import ReactQuill from "react-quill";
// import CourseListTable from "../CourseTable/courseListTable";

const CasesExam = () => {
  const navigate = useNavigate();
  const location = useLocation();
  document.title = "Cases Exam  | Quest ";
  const [modal, setmodal] = useState(false);
  const [numberOfPages, setNumberOfPages] = useState(false);
  const [CasesExam, setCasesExam] = useState(false);
  const [hiddenId, setHiddenId] = useState(null);
  const [CasesExam_url, setCasesExamUrl] = useState(false);
  const [loading, setLoading] = useState(false);
  const [CasesExams, setCasesExams] = useState(false);
  const [CasesExam_title, set_CasesExam_title] = useState("");
  const [edit, setEdit] = useState(null);
  const [rowData, setRowData] = useState(null);
  const [caseData, setCaseData] = useState({
    case_title: "",
    case_body: "",
    image_url: "",
    voice_url: "",
    topic_label: location?.state?.topicData?.topic_label,
    course_id: location?.state?.unitData?.course_id,
    unit_id: location?.state?.unitData?.unit_id,
  });

  const columns = [
    {
      Header: "case_title",
      accessor: "case_title",
    },

    {
      Header: "case_body",
      Cell: (cell) => {
        return (
          cell.cell.row.original?.case_body &&
          cell.cell.row.original?.case_body?.length && (
            <span
              dangerouslySetInnerHTML={{
                __html: cell.cell.row.original?.case_body
                  .split("//camp//")
                  .join("<br>")
                  .split("</B>")
                  .join("</strong>")
                  .split("<B>")
                  .join("<strong>")
                  .split("//camp//")
                  .join("<br>")
                  .split("</p>")
                  .join("</p>")
                  .split("//camp//")
                  .join("<p>"),
              }}
            ></span>
          )
        );
      },
    },

    {
      Header: "case_image",
      Cell: (cell) => {
        <img src={cell?.cell?.row?.original?.image_url} width="200" />;
      },
    },

    {
      Header: "Actions",
      Cell: (cell) => {
        return (
          <>
            {" "}
            <button
              className="btn btn-success"
              onClick={() => {
                setRowData({
                  ...cell?.cell?.row?.original,
                  case_body: cell.cell.row.original?.case_body
                    .split("//camp//")
                    .join("<br>")
                    .split("</B>")
                    .join("</strong>")
                    .split("<B>")
                    .join("<strong>")
                    .split("//camp//")
                    .join("<br>")
                    .split("</p>")
                    .join("</p>")
                    .split("//camp//")
                    .join("<p>"),
                });
              }}
            >
              Edit
            </button>
            <button
              style={{ margin: "10px" }}
              className="btn btn-success"
              onClick={() => {
                setHiddenId({
                  ...cell?.cell?.row?.original,
                  case_body: cell.cell.row.original?.case_body
                    .split("//camp//")
                    .join("<br>")
                    .split("</B>")
                    .join("</strong>")
                    .split("<B>")
                    .join("<strong>")
                    .split("//camp//")
                    .join("<br>")
                    .split("</p>")
                    .join("</p>")
                    .split("//camp//")
                    .join("<p>"),
                });
              }}
            >
              {cell?.cell?.row?.original?.hidden == "no" ? "Hide" : "Show"}
            </button>
          </>
        );
      },
    },
    {
      Header: "Questions",
      Cell: (cell) => {
        return (
          <button
            className="btn btn-success"
            onClick={() => {
              navigate("/CasesMCQQuestions", {
                state: {
                  unitData: location?.state?.unitData,
                  topicData: location?.state?.topicData,
                  caseData: cell.cell.row.original,
                },
              });
            }}
          >
            View
          </button>
        );
      },
    },
  ];

  useEffect(() => {
    getCasesExams();
  }, []);

  const getCasesExams = async () => {
    try {
      const get = await axios.post(
        "https://camp-coding.tech/quest/platform/admin/cases_tasks/topics/select_cases.php",
        {
          unit_id: location?.state?.unitData?.unit_id,
          topic_label: location?.state?.topicData?.topic_label,
        }
      );
      if (Array.isArray(get?.message)) setCasesExams(get.message);
      else setCasesExams([]);
    } catch (err) {
      setCasesExams([]);
    }
  };

  const uploadImage = async () => {
    setLoading(true);
    const formData = new FormData();
    console.log(caseData?.image_url);
    if (caseData?.image_url?.target?.files?.length) {
      formData.append("image", caseData?.image_url?.target?.files[0]);
      const url = await axios.post(
        "https://camp-coding.tech/quest/platform/admin/image_uplouder.php",
        formData
      );
      caseData && setCaseData({ ...caseData, image_url: url });
      rowData && setRowData({ ...rowData, image_url: url });
      toast.success("image Uploaded Successfully");
    }
    setLoading(false);
  };
  const addCasesExam = async (e) => {
    let caseContent = "";
    if (caseData?.case_body && caseData?.case_body?.length) {
      caseContent = caseData?.case_body;
      // ?.split("</p>")
      // .join("")
      // ?.split("<p>")
      // ?.join('//camp//')
      // ?.split("<br>")
      // .join("")
      // ?.split("<strong>")
      // ?.join("<B>")
      // ?.split("</strong>")
      // ?.join("</B>")
      // .replace(/^\/\/camp\/\/|\/\/camp\/\/$/g, '');
      console.log(caseData);
      // caseContent = caseContent
      //   .split("//camp//").join("<br>")
      //   .split("</B>").join("</strong>")
      //   .split("<B>").join("<strong>")
      //   .split("//camp//").join("<br>")
      //   .split("</p>").join("</p>")
      //   .split("//camp//").join("<p>");
    }

    const data_send = {
      ...caseData,
      case_body: caseContent,
    };
    console.log(data_send);

    // https://camp-coding.tech/quest/platform/admin/CasesExams/insert_CasesExams.php
    const add = await axios.post(
      "https://camp-coding.tech/quest/platform/admin/cases_tasks/insert_case_task.php",
      data_send
    );
    if (add.status == "success") {
      toast.success("Added");
      setCasesExam(false);
      getCasesExams();
      set_CasesExam_title("");
      setCaseData({});
      setRowData(null);
      setCasesExamUrl(false);
      setNumberOfPages(false);
    } else {
      toast.error(add.message);
    }
  };

  const editCasesExam = async (e) => {
    let caseContent = "";
    if (rowData?.case_body && rowData?.case_body?.length) {
      caseContent = rowData?.case_body;
      // ?.split("</p>")
      // .join("")
      // ?.split("<p>")
      // ?.join('//camp//')
      // ?.split("<br>")
      // .join("")
      // ?.split("<strong>")
      // ?.join("<B>")
      // ?.split("</strong>")
      // ?.join("</B>")
      // .replace(/^\/\/camp\/\/|\/\/camp\/\/$/g, '');
      console.log(rowData);
      // caseContent = caseContent
      //   .split("//camp//").join("<br>")
      //   .split("</B>").join("</strong>")
      //   .split("<B>").join("<strong>")
      //   .split("//camp//").join("<br>")
      //   .split("</p>").join("</p>")
      //   .split("//camp//").join("<p>");
    }

    const data_send = {
      ...rowData,
      case_body: caseContent,
    };
    console.log(data_send);

    // https://camp-coding.tech/quest/platform/admin/CasesExams/insert_CasesExams.php
    const add = await axios.post(
      "https://camp-coding.tech/quest/platform/admin/cases_tasks/update_case_info.php",
      data_send
    );
    if (add.status == "success") {
      toast.success("Added");
      setCasesExam(false);
      getCasesExams();
      set_CasesExam_title("");
      setCaseData({});
      setRowData(null);
      setCasesExamUrl(false);
      setNumberOfPages(false);
    } else {
      toast.error(add.message);
    }
  };
  const [loader, setLoader] = useState(false);
  const deleteAssign = async () => {
    setLoader(true);
    await axios
      .post(
        "https://camp-coding.tech/quest/platform/admin/cases_tasks/update_case_hidden.php",
        {
          case_task_id: hiddenId?.case_task_id,
          hidden_value: hiddenId?.hidden == "no" ? "yes" : "no",
        }
      )
      .then((res) => {
        toast.info(res?.message);
        getCasesExams();
      })
      .catch((err) => err);
    setLoader(false);
  };

  const toggle = useCallback(() => {
    if (modal) {
      setmodal(false);
    } else {
      setmodal(true);
    }
  }, [modal]);
  const permissions = userData?.permissions;

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <div className="header-btns">
            <button
              className="btn btn-success"
              onClick={() => {
                setmodal(true);
              }}
            >
              Add New Case
            </button>
          </div>
          <div id="table-invoices-list">
            {!CasesExams ? (
              <Loader />
            ) : CasesExams?.length ? (
              <TableContainer
                columns={columns}
                data={CasesExams}
                isGlobalFilter={true}
                customPageSize={10}
                className="Invoice table"
              />
            ) : (
              <h4>No CasesExams</h4>
            )}
          </div>
        </Container>

        <ToastContainer />
      </div>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle} tag="h4">
          Add New Case
        </ModalHeader>
        <ModalBody>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              return false;
            }}
          >
            <Row>
              <Col md={12}>
                <div className="mb-3">
                  <Label className="form-label">Topic Label</Label>
                  <Input
                    name="CasesExam_title"
                    type="text"
                    onChange={(e) => {
                      // console.log(item.id);
                      setCaseData({
                        ...caseData,
                        topic_label: e?.target?.value,
                      });
                    }}
                  />
                </div>

                <div className="mb-3">
                  <Label className="form-label">Cases Title</Label>
                  <Input
                    name="CasesExam_title"
                    type="text"
                    defaultValue={CasesExam_title}
                    onChange={(e) => {
                      // console.log(item.id);
                      setCaseData({
                        ...caseData,
                        case_title: e?.target?.value,
                      });
                    }}
                  />
                </div>

                <div className="mb-3">
                  <Label className="form-label">Cases Content</Label>

                  <ReactQuill
                    theme="snow"
                    value={caseData?.case_body}
                    onChange={(e) => {
                      // console.log(item.id);
                      setCaseData({ ...caseData, case_body: e });
                    }}
                  />
                </div>
                {/* <div className="mb-3">
                  <Label className="form-label">Case audio</Label>
                  <div
                    style={{
                      display: "flex",
                      width: "100%",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    {" "}
                    <input
                      type="file"
                      id="pdfInput"
                      onChange={(e) => e}
                    />{" "}
                    <span
                      className="btn btn-primary"
                    // onClick={() => uploadImage()}
                    >
                      {!loading ? (
                        <Icon icon="solar:upload-bold-duotone" />
                      ) : (
                        <Loader size="sm" />
                      )}
                    </span>
                  </div>

                </div> */}

                <div className="mb-3">
                  <Label className="form-label">Case Image</Label>
                  <div
                    style={{
                      display: "flex",
                      width: "100%",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    {" "}
                    <input
                      type="file"
                      id="pdfInput"
                      onChange={(e) =>
                        setCaseData({ ...caseData, image_url: e })
                      }
                    />{" "}
                    <span
                      className="btn btn-primary"
                      onClick={() => uploadImage()}
                    >
                      {!loading ? (
                        <Icon icon="solar:upload-bold-duotone" />
                      ) : (
                        <Loader size="sm" />
                      )}
                    </span>
                  </div>
                </div>
              </Col>
            </Row>
            <Row>
              <Col>
                <div className="text-end">
                  <button
                    type="submit"
                    className="btn btn-success save-user"
                    onClick={() => {
                      addCasesExam();
                    }}
                  >
                    Save
                  </button>
                </div>
              </Col>
            </Row>
          </Form>
        </ModalBody>
      </Modal>

      <Modal isOpen={rowData} toggle={() => setRowData(null)}>
        <ModalHeader toggle={() => setRowData(null)} tag="h4">
          Edit Case
        </ModalHeader>
        <ModalBody>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              return false;
            }}
          >
            <Row>
              <Col md={12}>
                <div className="mb-3">
                  <Label className="form-label">Cases Title</Label>
                  <Input
                    name="CasesExam_title"
                    type="text"
                    value={rowData?.case_title}
                    onChange={(e) => {
                      // console.log(item.id);
                      setRowData({ ...rowData, case_title: e?.target?.value });
                    }}
                  />
                </div>

                <div className="mb-3">
                  <Label className="form-label">Cases Content</Label>

                  <ReactQuill
                    theme="snow"
                    value={rowData?.case_body}
                    onChange={(e) => {
                      // console.log(item.id);
                      setRowData({ ...rowData, case_body: e });
                    }}
                  />
                </div>
                {/* <div className="mb-3">
                  <Label className="form-label">Case audio</Label>
                  <div
                    style={{
                      display: "flex",
                      width: "100%",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    {" "}
                    <input
                      type="file"
                      id="pdfInput"
                      onChange={(e) => e}
                    />{" "}
                    <span
                      className="btn btn-primary"
                    // onClick={() => uploadImage()}
                    >
                      {!loading ? (
                        <Icon icon="solar:upload-bold-duotone" />
                      ) : (
                        <Loader size="sm" />
                      )}
                    </span>
                  </div>

                </div> */}

                <div className="mb-3">
                  <Label className="form-label">Case Image</Label>
                  <div
                    style={{
                      display: "flex",
                      width: "100%",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    {" "}
                    <input
                      type="file"
                      id="pdfInput"
                      onChange={(e) =>
                        setCaseData({ ...caseData, image_url: e })
                      }
                    />{" "}
                    <span
                      className="btn btn-primary"
                      onClick={() => uploadImage()}
                    >
                      {!loading ? (
                        <Icon icon="solar:upload-bold-duotone" />
                      ) : (
                        <Loader size="sm" />
                      )}
                    </span>
                  </div>
                </div>
              </Col>
            </Row>
            <Row>
              <Col>
                <div className="text-end">
                  <button
                    type="submit"
                    className="btn btn-success save-user"
                    onClick={() => {
                      editCasesExam();
                    }}
                  >
                    Save
                  </button>
                </div>
              </Col>
            </Row>
          </Form>
        </ModalBody>
      </Modal>

      <Modal
        headerTitle={"Show / Hide Case"}
        isOpen={hiddenId}
        toggle={() => setHiddenId(null)}
        children={
          <form action="#" onSubmit={(e) => e.preventDefault()}>
            <h3 style={{ padding: "20px" }}>
              {hiddenId?.hidden == "no" ? "Hide - " : "Show - "}{" "}
              {hiddenId?.case_title}..?
            </h3>
            <div
              className="d-flex align-items-center"
              style={{ padding: "20px" }}
            >
              <button
                className="btn btn-primary"
                style={{ width: "fit-content", margin: "0 10px" }}
                onClick={() => {
                  deleteAssign();
                }}
              >
                {hiddenId?.hidden == "no" ? "Hide" : "Show"}
              </button>
              <button
                className="btn btn-success"
                onClick={() => setHiddenId(null)}
              >
                Cencel
              </button>
            </div>{" "}
          </form>
        }
      />
    </React.Fragment>
  );
};

export default CasesExam;
