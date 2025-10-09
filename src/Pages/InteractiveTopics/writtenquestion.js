import React, { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import TableContainer from "../../components/Common/TableContainer";
import {
  Row,
  Col,
  Container,
  Card,
  CardBody,
  CloseButton,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  Label,
  Input,
  Button,
} from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import "flatpickr/dist/themes/material_blue.css";
import { Loader } from "rsuite";
import axios from "axios";
import { toast } from "react-toastify";
import { AiOutlinePlus } from "react-icons/ai";
import ReactQuill from "react-quill";
import { userData } from "../../store/getProfileData";
import { MenuItem, Select } from "@mui/material";

const TopicWrittenQuestions = ({ CourseId, allunitdata, unitId, cd }) => {
  const [topics, setTopics] = useState(false);
  const [wq_data, setWqData] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [itemLoader, setItemLoader] = useState(false);
  useEffect(() => {
    getTopics();
  }, []);
  const permissions = userData?.permissions;

  const getTopics = async () => {
    setItemLoader(true);
    const data_send = {
      course_id: CourseId,
      unit_id: unitId,
    };
    const get = await axios.post(
      "https://camp-coding.tech/quest/platform/admin/wqs/topics/select_wq_unit_topics.php",
      data_send
    );
    setTopics(get.message);
    setItemLoader(false);
  };

  const [unit_id, setUnitId] = useState(false);
  const [MCQ_Show, setMCQShow] = useState(false);
  const [tweets_show, setTweetShow] = useState(false);
  const [wq_show, setWQShow] = useState(false);
  const [flash_show, setFlashShow] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [questionslist, setquestionslist] = useState([
    { id: "0", wq_value: "" },
  ]);
  const [imgloading, setimgloading] = useState(false);
  const [img, setImg] = useState(false);
  const [modal, setModal] = useState(false);
  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
    } else {
      setModal(true);
    }
  }, [modal]);
  const [qImage, setQImage] = useState(false);
  const addQuestion = async (e) => {
    const questions = [...questionslist];
    // console.log(tweets)
    let questionstxt = "";
    for (let i = 0; i < questions.length; i++) {
      if (i == 0) {
        questionstxt += questions[i]?.wq_value;
      } else {
        questionstxt += "//camp//" + questions[i]?.wq_value + "//camp//";
      }
    }

    const en = questionstxt
      .split("</p>")
      .join("")
      .replace(/<\/p><p>/g, "//camp//")
      .replace(/<p>/g, "")
      .replace(/<\/p>/g, "")
      .replace(/<br>/g, "")
      .replace(/<p>/g, "")
      .replace(/<strong>/g, "<B>")
      .replace(/<\/strong>/g, "</B>");
    // </p><p>
    console.log(en);
    // console.log("original after : ", en.replace(/\/\/camp\/\//g, '<p><br></p>').replace(/<B>/g, '<strong>').replace(/<\/B>/g, '</strong>'));

    const data_send = {
      wq_value: en,
      wq_title: e.currentTarget.question_title.value,
      topic_label: e.currentTarget.topic_label.value,
      course_id: CourseId,
      unit_id: unitId,
      image_url: qImage,
    };
    console.log("Edit", data_send);
    const add = await axios.post(
      "https://camp-coding.tech/quest/platform/admin/wqs/insert_wqs.php",
      data_send
    );
    if (add.status == "success") {
      toast.success("Added");
      getTopics();
      setImg(false);
      setModal(false);
    } else {
      toast.error(add.message);
    }
  };
  const uploadImage = async (e) => {
    setimgloading(true);
    const formdata = new FormData();
    formdata.append("image", img);
    const url = await axios
      .post(
        "https://camp-coding.tech/quest/platform/admin/image_uplouder.php",
        formdata
      )
      .finally(() => {
        setimgloading(false);
      });

    setQImage(url?.data);
    toast.success("Image Uploaded Successfully");
  };
  const [showEditForm, setShowEditForm] = useState(false);
  const showEdittedForm = () => setShowEditForm(!showEditForm);
  const [selectedTopic, setselectedTopic] = useState(false);
  const handleEditTopic = (e) => {
    const data_send = {
      old_topic_name: selectedTopic?.topic_label,
      new_topic_name: e?.target?.topicNewName?.value,
      unit_id: unitId,
    };
    axios
      .post(
        "https://camp-coding.tech/quest/platform/admin/topics/edit_wqs_topic.php",
        JSON.stringify(data_send)
      )
      .then((res) => {
        if (res.status == "success") {
          toast.success("Success");
          setselectedTopic(false);
          getTopics();
          showEdittedForm();
        } else if (res.status == "error") {
          toast.error(res.message);
        } else {
          toast.error("Something Went Error");
        }
      });
  };

  const columns = [
    {
      Header: "No",
      Cell: (cell) => {
        return <b>{cell.cell.row.index + 1}</b>;
      },
    },
    {
      Header: "Topic Title",
      accessor: "name",
    },
    {
      Header: "Topic Copy",
      Cell: (cell) => {
        return (
          <button
            className="btn btn-success"
            onClick={() => setsetShowCopy(cell.cell.row.original)}
          >
            Copy
          </button>
        );
      },
    },
    {
      Header: "Edit",
      Cell: (cell) => {
        return (
          <button
            className="btn"
            onClick={() => {
              const item = cell.cell.row.original;
              setShowEditForm(true);
              setselectedTopic(cell.cell.row.original);
            }}
          >
            Edit
          </button>
        );
      },
    },
    {
      Header: "Written Question",
      Cell: (cell) => {
        return (
          <button
            className="btn btn-success"
            onClick={() => {
              const item = cell.cell.row.original;

              navigate("/interActiveTopicsWrittenQuestions", {
                state: {
                  unitId: unitId,
                  CourseId: CourseId,
                  topicData: cell.cell.row.original,
                },
              });
            }}
          >
            Written Questions
          </button>
        );
      },
    },
  ];
  const [Folders, SetFolders] = useState([]);
  const [showCopy, setsetShowCopy] = useState(false);
  useEffect(() => {
    if (MCQ_Show) getFolders();
  }, [MCQ_Show]);
  const getFolders = () => {
    axios
      .get(
        "https://camp-coding.tech/quest/platform/admin/images_data/select_folders_data.php"
      )
      .then((res) => {
        if (Array.isArray(res)) {
          SetFolders(res?.filter((item, index) => index > 1));
        }
      })
      .catch((err) => console.log(err));
  };
  const uploadExcel = async (e, type) => {
    setUploadLoading(true);
    const formData = new FormData(e?.target);
    const form = e.target;

    formData.append("file_attachment", e.target.file_attachment.files[0]);
    formData.append("course_id", allunitdata.course_id);
    formData.append("unit_id", allunitdata?.unit_id);
    formData.append("folder_name", e?.target?.folder_name?.value);
    // folder_name
    const excelUploading = await axios.post(
      type == "questions"
        ? "https://camp-coding.tech/quest/platform/admin/mcq/upload_questions_new.php"
        : type == "tweets"
        ? "https://camp-coding.tech/quest/platform/admin/tweets/upload_excel_tweets_dashboard.php"
        : type == "flash_cards"
        ? "https://camp-coding.tech/quest/platform/admin/flash_cards/upload_excel_file_flash_dashboard.php"
        : type == "WQ"
        ? "https://camp-coding.tech/quest/platform/admin/wqs/upload_excel_file_wqs.php"
        : type == "cases"
        ? "https://camp-coding.tech/quest/platform/admin/cases/upload_excel_file_cases.php"
        : "",
      formData
    );

    if (excelUploading) {
      await getTopics();
      toast.success(
        "Uploaded Successfully - Number Of Pages: " + excelUploading
      );
      setMCQShow(false);
      form.reset();
    } else {
      setUploadLoading(false);

      toast.error(excelUploading.message);
    }
  };
  const handlesavetxt = (e, i, txt) => {
    console.log(i);
    // console.log(i)
    // console.log(txt)
    // ;
    const list = [...questionslist];
    list[i][txt] = e;
    setquestionslist(list);
    //
  };
  return (
    <React.Fragment>
      <Container fluid={true}>
        <Breadcrumbs
          title={cd?.course_name}
          breadcrumbItem={allunitdata?.unit_name + " > Topics"}
        />
        <Col className="col-sm">
          <div>
            {permissions?.includes("*9_1") ||
            permissions?.startsWith("9_1") ||
            permissions == "all" ? (
              <button
                type="button"
                className="btn btn-success"
                data-bs-toggle="modal"
                data-bs-target="#addCourseModal"
                onClick={() => {
                  // showModal()
                  setModal(true);
                }}
              >
                <i
                  onClick={() => {
                    setModal(true);
                  }}
                  className="mdi mdi-plus me-1"
                ></i>{" "}
                Add Written Question
              </button>
            ) : null}
            {permissions?.includes("*9_4") ||
            permissions?.startsWith("9_4") ||
            permissions == "all" ? (
              <button
                class="btn btn-success mp-09"
                onClick={() => {
                  setMCQShow(true);
                }}
              >
                Upload Written Questions
              </button>
            ) : null}
          </div>
        </Col>
        <Row>
          <Col lg={12}>
            <Card>
              <CardBody>
                <div className="position-relative">
                  <div className="modal-button mt-2">
                    <Row className="align-items-start"></Row>
                  </div>
                </div>
                <div id="table-invoices-list">
                  {!topics ? (
                    <Loader />
                  ) : (
                    <>
                      {Array.isArray(topics) && topics.length ? (
                        <TableContainer
                          columns={columns}
                          data={topics}
                          isGlobalFilter={true}
                          customPageSize={10}
                          className="Invoice table"
                        />
                      ) : (
                        <h4>No Topics</h4>
                      )}
                    </>
                  )}
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle} tag="h4">
          Add New Written Question
        </ModalHeader>
        <ModalBody>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              addQuestion(e);
              return false;
            }}
          >
            <Row>
              <Col md={12}>
                <div className="mb-3">
                  <Label className="form-label">Topic Lbbel</Label>
                  <Input type="text" name="topic_label" />
                </div>
                <div className="mb-3">
                  <Label className="form-label">Question Title</Label>
                  <Input type="text" name="question_title" />
                </div>
                <div className="inputField withtext upimgdiv">
                  <label htmlFor="exam_img">Question image</label>
                  <Input
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "4px",
                    }}
                    type="file"
                    name="exam_img"
                    id="exam_img"
                    placeholder="question text"
                    // required
                    onChange={(e) => setImg(e.target.files[0])}
                  />
                  {imgloading ? (
                    <Loader size="md" />
                  ) : (
                    <img
                      onClick={() => {
                        uploadImage();
                      }}
                      className="up_img"
                      src={require("../../assets/images/upload.png")}
                      alt=""
                    />
                  )}
                </div>
                <div className="mb-3">
                  <div className="add_newanstwee">
                    <Label className="form-label">Answer</Label>
                    <AiOutlinePlus
                      onClick={() => {
                        setquestionslist([
                          ...questionslist,
                          { id: questionslist.length, wq_value: "" },
                        ]);
                      }}
                    />
                  </div>
                  {questionslist.map((item, index) => {
                    return (
                      <div className="tweet_ans">
                        <ReactQuill
                          theme="snow"
                          value={item.wq_value}
                          onChange={(e) => {
                            // console.log(item.id);
                            handlesavetxt(e, index, "wq_value");
                          }}
                        />
                        {index !== 0 ? (
                          <Button
                            onClick={() => {
                              // console.log(item.id)
                              setquestionslist(
                                questionslist.filter((it) => item.id !== it.id)
                              );
                            }}
                            color="red"
                            appearance="primary"
                          >
                            Delete
                          </Button>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </Col>
            </Row>
            <Row>
              <Col>
                <div className="text-end">
                  <button type="submit" className="btn btn-success save-user">
                    Save
                  </button>
                </div>
              </Col>
            </Row>
          </Form>
        </ModalBody>
      </Modal>
      {/* <Modal title="Upload Written Questions Excel File" isOpen={wq_show}>
        <form
          action="#"
          style={{
            padding: "15px",
            display: "flex",
            flexDirection: "column",
          }}
          onSubmit={(e) => {
            e.preventDefault();
            return !uploadLoading ? uploadExcel(e, "tweets") : null;
          }}
        >
          <CloseButton
            onClick={() => {
              setUploadLoading(false);
              setWQShow(false);
            }}
            style={{ marginLeft: "auto" }}
          />
          <p>{"Unit Name" + "(-)" + allunitdata?.unit_name}</p>
          <div className="input_Field">
            <label forHtml="course_id">Excel File</label>
            <div className="input_Field">
              <input type="file" name="file_attachment" />
            </div>
          </div>
          <button
            className="btn btn-success"
            style={{ margin: "10px 0 0 auto" }}
          >
            {" "}
            {uploadLoading ? <Loader /> : "Upload Excel File"}{" "}
          </button>
        </form>
      </Modal> */}
      <Modal title="Edit Topic" isOpen={showEditForm} toggle={showEdittedForm}>
        <form
          action="#"
          style={{
            padding: "15px",
            display: "flex",
            flexDirection: "column",
          }}
          onSubmit={(e) => {
            e.preventDefault();
            handleEditTopic(e);
          }}
        >
          <CloseButton
            onClick={() => showEdittedForm()}
            style={{ marginLeft: "auto" }}
          />

          <div className="input_Field">
            <label htmlFor="topicNewName">New Name</label>
            <Input
              type="text"
              name="topicNewName"
              id="topicNewName"
              defaultValue={selectedTopic?.topic_name}
            />
          </div>
          <button
            className="btn btn-success"
            style={{ margin: "10px 0 0 auto" }}
          >
            {" "}
            Edit{" "}
          </button>
        </form>
      </Modal>
      <Modal title="Upload Excel File" isOpen={MCQ_Show}>
        <form
          action="#"
          style={{
            padding: "15px",
            display: "flex",
            flexDirection: "column",
          }}
          onSubmit={(e) => {
            e.preventDefault();
            return !uploadLoading ? uploadExcel(e, "WQ") : null;
          }}
        >
          <CloseButton
            onClick={() => {
              setUploadLoading(false);
              setMCQShow(false);
            }}
            style={{ marginLeft: "auto" }}
          />
          <label style={{ fontSize: "22px" }} htmlFor="">
            Folders
          </label>
          <Select
            style={{
              width: "100%",
              borderRadius: "4px",
              margin: "10px 0",
            }}
            type="text"
            name="folder_name"
            id="folder_name"
          >
            {Folders.map((item, index) => {
              return (
                <MenuItem value={item} key={index}>
                  {item}
                </MenuItem>
              );
            })}
          </Select>
          <div className="input_Field">
            <label forHtml="course_id">Excel File</label>
            <div className="input_Field">
              <input type="file" name="file_attachment" />
            </div>
          </div>
          <button
            className="btn btn-success"
            style={{ margin: "10px 0 0 auto" }}
          >
            {" "}
            {uploadLoading ? <Loader /> : "Upload Excel File"}{" "}
          </button>
        </form>
      </Modal>
    </React.Fragment>
  );
};

export default TopicWrittenQuestions;
