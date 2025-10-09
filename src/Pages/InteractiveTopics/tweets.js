import React, { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import TableContainer from "../../components/Common/TableContainer";
import ReactQuill from "react-quill";
import {
  Row,
  Col,
  Container,
  Card,
  CardBody,
  CloseButton,
  Modal,
  Button,
  Input,
  Label,
  Form,
  ModalBody,
  ModalHeader,
} from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import "flatpickr/dist/themes/material_blue.css";
import { Loader } from "rsuite";
import axios from "axios";
import { toast } from "react-toastify";
import { AiOutlinePlus } from "react-icons/ai";
import { userData } from "../../store/getProfileData";
const TopicTweets = ({ CourseId, unitId, allunitdata, cd }) => {
  const permissions = userData?.permissions;

  const [topics, setTopics] = useState(false);
  const navigate = useNavigate();
  const [uploadLoading, setUploadLoading] = useState(false);
  const [tweets_show, setTweetShow] = useState(false);

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
      "https://camp-coding.tech/quest/platform/admin/tweets/topics/select_tweets_unit_topics.php",
      data_send
    );
    setTopics(get.message);
    setItemLoader(false);
  };
  const [modal, setmodal] = useState(false);
  const toggle = useCallback(() => {
    if (modal) {
      setmodal(false);
    } else {
      setmodal(true);
    }
  }, [modal]);
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
        "https://camp-coding.tech/quest/platform/admin/topics/edit_tweets_topic.php",
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
  const [tweetanswerlist, settweetanswerlist] = useState([
    { id: "0", tweet_value: "" },
  ]);
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
      Header: "Tweets",
      Cell: (cell) => {
        return (
          <button
            className="btn btn-success"
            onClick={() => {
              const item = cell.cell.row.original;

              navigate("/interActiveTopicsTweets", {
                state: {
                  unitId: unitId,
                  CourseId: CourseId,
                  topicData: cell.cell.row.original,
                },
              });
            }}
          >
            Tweets
          </button>
        );
      },
    },
  ];
  const addTweet = async (e) => {
    // console.log(tweetanswerlist);
    const tweets = [...tweetanswerlist];
    // console.log(tweets)
    let tweetstxt = "";
    for (let i = 0; i < tweets.length; i++) {
      if (i == 0) {
        tweetstxt += tweets[i]?.tweet_value;
      } else {
        tweetstxt += "//camp//" + tweets[i]?.tweet_value + "//camp//";
      }
    }
    const en = tweetstxt
      .split("</p>")
      .join("")
      .replace(/<\/p><p>/g, "//camp//")
      .replace(/<p>/g, "")
      .replace(/<\/p>/g, "")
      .replace(/<br>/g, "")
      .replace(/<p>/g, "")
      .replace(/<strong>/g, "<B>")
      .replace(/<\/strong>/g, "</B>");
    const data_send = {
      tweet_value: en,
      tweet_title: e.currentTarget.tweet_title.value,
      course_id: CourseId,
      unit_id: unitId,
      topic_label: e.currentTarget.topic_label.value,
    };

    const add = await axios.post(
      "https://camp-coding.tech/quest/platform/admin/tweets/insert_tweets.php",
      data_send
    );

    if (add.status == "success") {
      toast.success("Added");
      await getTopics();
      setmodal(false);
    } else {
      toast.error(add.message);
    }
  };
  const handlesavetxt = (e, i, txt) => {
    // console.log(i)
    // console.log(txt)
    // ;
    const list = [...tweetanswerlist];
    list[i][txt] = e;
    settweetanswerlist(list);
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
            <Card>
              <CardBody>
                <div className="position-relative">
                  <div className="modal-button mt-2">
                    {permissions?.includes("*8_4") ||
                    permissions?.startsWith("8_4") ||
                    permissions == "all" ? (
                      <button
                        class="btn btn-success mp-09"
                        onClick={() => {
                          setTweetShow(true);
                        }}
                      >
                        Upload Tweets Excel File
                      </button>
                    ) : null}
                    {permissions?.includes("*8_1") ||
                    permissions?.startsWith("8_1") ||
                    permissions == "all" ? (
                      <button
                        type="button"
                        className="btn btn-success"
                        data-bs-toggle="modal"
                        data-bs-target="#addCourseModal"
                        onClick={() => {
                          // showModal()
                          setmodal(true);
                        }}
                      >
                        <i
                          onClick={() => {
                            setmodal(true);
                          }}
                          className="mdi mdi-plus me-1"
                        ></i>{" "}
                        Add Tweet
                      </button>
                    ) : null}
                  </div>
                </div>
                <div id="table-invoices-list">
                  {!topics ? (
                    <Loader />
                  ) : (
                    <>
                      {topics && topics.length ? (
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
      <Modal title="Upload Tweets Excel File" isOpen={tweets_show}>
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
              setTweetShow(false);
            }}
            style={{ marginLeft: "auto" }}
          />
          <p>{"Unit Name" + ": " + allunitdata?.unit_name}</p>
          <div className="input_Field">
            <label forHtml="course_id">Tweets Excel File</label>
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
          Add New Tweet
        </ModalHeader>
        <ModalBody>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              addTweet(e);
              return false;
            }}
          >
            <Row>
              <Col md={12}>
                <div className="mb-3">
                  <Label className="form-label">Topic Name</Label>
                  <Input name="topic_label" type="text" />
                </div>
                <div className="mb-3">
                  <Label className="form-label">Tweet Title</Label>
                  <Input name="tweet_title" type="text" />
                </div>
                <div className="mb-3">
                  <div className="add_newanstwee">
                    <label className="form-label">Answer</label>
                    <AiOutlinePlus
                      onClick={() => {
                        settweetanswerlist([
                          ...tweetanswerlist,
                          { id: tweetanswerlist.length, tweet_value: "" },
                        ]);
                      }}
                    />
                  </div>
                  {tweetanswerlist.map((item, index) => {
                    return (
                      <div className="tweet_ans">
                        <ReactQuill
                          theme="snow"
                          value={item.tweet_value}
                          onChange={(e) => {
                            // console.log(item.id);
                            handlesavetxt(e, index, "tweet_value");
                          }}
                          style={{ minHeight: "300px" }}
                        />
                        {index !== 0 ? (
                          <Button
                            onClick={() => {
                              // console.log(item.id)
                              settweetanswerlist(
                                tweetanswerlist.filter(
                                  (it) => item.id !== it.id
                                )
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

export default TopicTweets;
