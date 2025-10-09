import React, { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import TableContainer from "../../components/Common/TableContainer";
import {
  Row,
  Col,
  Container,
  Modal,
  TabContent,
  TabPane,
  Tooltip,
  Card,
  CardBody,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  ModalHeader,
  ModalBody,
  Form,
  Label,
  Input,
  FormFeedback,
  CloseButton,
} from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import "flatpickr/dist/themes/material_blue.css";
import { Loader } from "rsuite";
import axios from "axios";
import { toast } from "react-toastify";
import { userData } from "../../store/getProfileData";

const Topic_Flash_Cards = ({ CourseId, unitId, allunitdata, cd }) => {
  const [topics, setTopics] = useState(false);
  const navigate = useNavigate();
  const [uploadLoading, setUploadLoading] = useState(false);
  const [itemLoader, setItemLoader] = useState(false);
  useEffect(() => {
    getTopics();
  }, []);
  const getTopics = async () => {
    setItemLoader(true);
    const data_send = {
      course_id: CourseId,
      unit_id: unitId,
    };
    const get = await axios.post(
      "https://camp-coding.tech/quest/platform/admin/flash_cards/topics/select_flash_cards_unit_topics.php",
      data_send
    );
    setTopics(get.message);

    setItemLoader(false);
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
        "https://camp-coding.tech/quest/platform/admin/topics/edit_flashcards_topic.php",
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
  const [flash_show, setFlashShow] = useState(false);
  const uploadExcel = async (e, type) => {
    setUploadLoading(true);
    const formData = new FormData(e?.target);
    const form = e.target;

    formData.append("file_attachment", e.target.file_attachment.files[0]);
    formData.append("course_id", CourseId);
    formData.append("unit_id", unitId);
    const excelUploading = await axios.post(
      type == "questions"
        ? "https://camp-coding.tech/quest/platform/admin/mcq/upload_questions_new.php"
        : type == "tweets"
        ? "https://camp-coding.tech/quest/platform/admin/tweets/upload_excel_tweets_dashboard.php"
        : type == "flash_cards"
        ? "https://camp-coding.tech/quest/platform/admin/flash_cards/upload_excel_file_flash_dashboard.php"
        : type == "WQ"
        ? ""
        : "",
      formData
    );
    console.log(
      excelUploading,
      unitId,
      e.target.file_attachment.files[0],
      CourseId
    );
    if (excelUploading) {
      await getTopics();
      toast.success(
        "Uploaded Successfully - Number Of Pages: " + excelUploading
      );

      setFlashShow(false);
      form.reset();
    } else {
      toast.error(excelUploading.message);
    }
    setUploadLoading(false);
  };
  const permissions = userData?.permissions;

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
      Header: "Flash Card",
      Cell: (cell) => {
        return (
          <button
            className="btn btn-success"
            onClick={() => {
              const item = cell.cell.row.original;

              navigate("/interActiveTopicsFlashCards", {
                state: {
                  unitId: unitId,
                  CourseId: CourseId,
                  topicData: cell.cell.row.original,
                },
              });
            }}
          >
            Flash Cards
          </button>
        );
      },
    },
  ];
  const [side1, setSide1] = useState(false);
  const [side2, setSide2] = useState(false);
  const [isBack, setIsBack] = useState(false);
  const [modal, setModal] = useState(false);
  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
    } else {
      setModal(true);
    }
  }, [modal]);
  const addFlashCard = async (e) => {
    const data_send = {
      flash_card_side_1: e.currentTarget.flashCard_title.value,
      topic_label: e.currentTarget.topic_label.value,
      flash_card_side_2: e.currentTarget.flashCard_value.value,
      course_id: CourseId,
      unit_id: unitId,
      author: "",
    };

    const add = await axios.post(
      "https://camp-coding.tech/quest/platform/admin/flash_cards/add_flash_cards.php",
      data_send
    );

    if (add.status == "success") {
      toast.success("Added");
      await getTopics();
      setSide1(false);
      setSide2(false);
      setIsBack(false);
      setModal(false);
    } else {
      toast.error(add.message);
    }
  };

  return (
    <React.Fragment>
      <Container fluid={true}>
        <Breadcrumbs
          title={cd?.course_name}
          breadcrumbItem={allunitdata?.unit_name + " > Topics"}
        />

        <Row>
          <Col lg={12}>
            {permissions?.includes("*7_4") ||
            permissions?.startsWith("7_4") ||
            permissions == "all" ? (
              <button
                class="btn btn-success mp-09"
                onClick={() => {
                  setFlashShow(true);
                }}
              >
                Upload Flash Cards
              </button>
            ) : null}
            {permissions?.includes("*7_1") ||
            permissions?.startsWith("7_1") ||
            permissions == "all" ? (
              <button
                type="button"
                className="btn btn-success"
                data-bs-toggle="modal"
                data-bs-target="#addCourseModal"
                style={{ marginBottom: "0 !important" }}
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
                Add Flash Card
              </button>
            ) : null}
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
      <Modal title="Upload Flash Cards Excel File" isOpen={flash_show}>
        <form
          action="#"
          style={{
            padding: "15px",
            display: "flex",
            flexDirection: "column",
          }}
          onSubmit={(e) => {
            e.preventDefault();
            return !uploadLoading ? uploadExcel(e, "flash_cards") : null;
          }}
        >
          <CloseButton
            onClick={() => {
              setUploadLoading(false);
              setFlashShow(false);
            }}
            style={{ marginLeft: "auto" }}
          />
          <p>{"Unit Name" + ": " + allunitdata?.unit_name}</p>
          <div className="input_Field">
            <label forHtml="course_id">Flash Cards Excel File</label>
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
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle} tag="h4">
          Add New Flash Card
        </ModalHeader>
        <ModalBody>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              addFlashCard(e);
              return false;
            }}
          >
            <Row>
              <Col md={12}>
                <div class={isBack ? "card-flid back" : "card-flid"}>
                  <div class="card-inner">
                    <div class="card-front">{side1}</div>

                    <div class="card-back">{side2}</div>
                  </div>
                </div>
                <div className="mb-3">
                  <Label className="form-label">Topic Name</Label>
                  <Input name="topic_label" type="text" />
                </div>
                <div className="mb-3">
                  <Label className="form-label">Side 1</Label>
                  <Input
                    name="flashCard_title"
                    type="text"
                    onChange={(e) => setSide1(e.currentTarget.value)}
                    onFocus={() => {
                      setIsBack(false);
                    }}
                  />
                </div>
                <div className="mb-3">
                  <Label className="form-label">Side 2</Label>
                  <Input
                    name="flashCard_value"
                    type="text"
                    onChange={(e) => setSide2(e.currentTarget.value)}
                    onFocus={() => {
                      setIsBack(true);
                    }}
                  />
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
    </React.Fragment>
  );
};

export default Topic_Flash_Cards;
