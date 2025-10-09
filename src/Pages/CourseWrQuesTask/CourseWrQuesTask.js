import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { isEmpty } from "lodash";
import * as Yup from "yup";
import { useFormik } from "formik";
// import './coursetype.css'
import { Slider, Stack } from "@mui/material";
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  UncontrolledTooltip,
  Input,
  FormFeedback,
  Label,
  Form,
  CloseButton,
} from "reactstrap";
// import './casetask.css'

// Import Breadcrumb
// import Breadcrumbs from "../../../components/Common/Breadcrumb";

// import DeleteModal from "../../../components/Common/DeleteModal";
// import {getCustomers as onGetCustomers, addNewCustomer as onAddNewCustomer, updateCustomer as onUpdateCustomer, deleteCustomer as onDeleteCustomer} from "../../../store/actions";

// redux
import { useSelector, useDispatch } from "react-redux";
// import TableContainer from '../../../components/Common/TableContainer';

import Breadcrumbs from "../../components/Common/Breadcrumb";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { toast } from "react-toastify";
import axios from "axios";
import { Loader } from "rsuite";
// import CourseWqsTableList from "./CourseWqsTaskTableList";
// import CourseCasesTableList from "./CourseCasesTableList";
import CourseWqsTableList from "./CourseWqsTaskTableList";
import { userData } from "../../store/getProfileData";

const CourseWrQuesTask = (props) => {
  const [tasktype, settasktype] = useState("cases");
  document.title = "Customers | Quest ";
  const location = useLocation();
  const { course_data } = location?.state;
  const [tasks, settasks] = useState([]);
  const [imagesFiles, setImagesFiles] = useState([]);
  const [showcourseedit, setshowcourseedit] = useState(false);
  const [taskData, setTaskData] = useState({});
  const [img, setimg] = useState(null);
  const [answer_image_url, setanswer_image_url] = useState(null);
  // answer_image_url
  const [imgloading, setimgloading] = useState(false);
  const getWqsTasks = () => {
    const data_send = {
      course_id: course_data?.course_id,
      type: "wqs",
    };
    axios
      .post(
        "https://camp-coding.tech/quest/platform/admin/tasks/select_tasks.php",
        JSON.stringify(data_send)
      )
      .then((res) => {
        setshowcourseedit(false);
        settasks(res.message);
      })
      .catch((err) => console.log(err));
  };

  const [addloading, setAddLoading] = useState(false);

  const uploadImage = async () => {
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
    toast.success("Image Uploaded Successfully");
    setTaskData({ ...taskData, task: url });
  };

  useEffect(() => {
    console.log(imagesFiles);
  }, [imagesFiles]);

  // const addTask = async () => {
  //   setAddLoading(true);

  //   const formdata = new FormData();
  //   formdata.append("image", img);
  //   const url = await axios.post(
  //     "https://camp-coding.tech/quest/platform/admin/image_uplouder.php",
  //     formdata
  //   );

  //   const imagesArr = [];
  //   if (imagesFiles && imagesFiles?.length) {
  //     imagesFiles?.map(async (image) => {
  //       const answerformdata = new FormData();
  //       answerformdata.append("image", image);
  //       const answer_image = await axios.post(
  //         "https://camp-coding.tech/quest/platform/admin/image_uplouder.php",
  //         answerformdata
  //       );
  //       return imagesArr.push(answer_image);
  //     });
  //   }
  //   const data_send = {
  //     course_id: course_data.course_id,
  //     task_text: taskData.task_text,
  //     timer: taskData.time * 60,
  //     type: 'wqs',
  //     task_image: url?.headers ? "" : url,
  //     answer:
  //       imagesArr && Array.isArray(imagesArr)
  //         ? imagesArr?.split("**camp**")
  //         : null,
  //     task_comment: taskData.task_comment,
  //     text_model_answer: taskData?.text_model_answer,
  //   };
  //   axios
  //     .post(
  //       "https://camp-coding.tech/quest/platform/admin/tasks/add_task.php",
  //       data_send
  //     )
  //     .then((res) => {
  //       if (res.status == 'success') {
  //         toast.success(res.message);
  //         getWqsTasks();
  //         setshowcourseedit(false);
  //       } else if (res.status == 'error') {
  //         toast.error(res.message);
  //       } else {
  //         toast.error("حدث خطأ ماٍ");
  //       }
  //     })
  //     .catch((err) => console.log(err))
  //     .finally(() => {
  //       setAddLoading(false);
  //     });
  // };

  const addTask = async () => {
    setAddLoading(true);
    const imagesArr = [];

    const formdata = new FormData();
    formdata.append("image", img);

    try {
      const url = await axios.post(
        "https://camp-coding.tech/quest/platform/admin/image_uplouder.php",
        formdata
      );

      if (imagesFiles && imagesFiles.length) {
        await Promise.all(
          imagesFiles.map(async (image) => {
            const answerformdata = new FormData();
            answerformdata.append("image", image);
            const answer_image = await axios.post(
              "https://camp-coding.tech/quest/platform/admin/image_uplouder.php",
              answerformdata
            );
            imagesArr.push(answer_image);
          })
        );
      }

      const data_send = {
        course_id: course_data.course_id,
        task_text: taskData.task_text,
        timer: taskData.time * 60,
        type: "wqs",
        task_image: url?.headers ? "" : url,
        answer:
          imagesArr && imagesArr?.length && Array.isArray(imagesArr)
            ? imagesArr?.join("**camp**")
            : null,
        task_comment: taskData.task_comment,
        text_model_answer: taskData?.text_model_answer,
      };

      axios
        .post(
          "https://camp-coding.tech/quest/platform/admin/tasks/add_task.php",
          data_send
        )
        .then((res) => {
          if (res.status === "success") {
            toast.success(res.message);
            getWqsTasks();
            setshowcourseedit(false);
          } else if (res.status === "error") {
            toast.error(res.message);
          } else {
            toast.error("حدث خطأ ماٍ");
          }
        })
        .catch((err) => console.log(err))
        .finally(() => {
          setAddLoading(false);
        });
    } catch (error) {
      console.error(error);
      setAddLoading(false);
    }
  };

  useEffect(() => {
    getWqsTasks();
  }, []);
  const permissions = userData?.permissions;

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Wqs Questions" breadcrumbItem="Customers" />
          <Row>
            <Col xs="12">
              <Card>
                <CardBody>
                  {permissions?.includes("*2_1") ||
                  permissions?.startsWith("2_1") ||
                  permissions == "all" ? (
                    <div className="addtask">
                      <button
                        onClick={() => {
                          setshowcourseedit(true);
                        }}
                        className="btn btn-success"
                      >
                        +Add
                      </button>
                    </div>
                  ) : null}
                  <CourseWqsTableList TaskWqs={tasks} />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
      <Modal isOpen={showcourseedit}>
        <ModalHeader tag="h4">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              alignItems: "center",
            }}
          >
            <h4>Add Wqs Task</h4>
            <CloseButton
              onClick={() => {
                setshowcourseedit(false);
              }}
              style={{ marginLeft: "auto" }}
            />
          </div>
        </ModalHeader>
        <ModalBody>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              addTask();
            }}
          >
            {/* <h4 style={{ textAlign:'center',marginBottom:'5px' }}>Select Task Type</h4>
                                  <div className="mt-3 tasktype">
                                    <button
                                      className={tasktype=='cases'?'active':''}
                                      onClick={()=>{
                                        settasktype("cases")
                                      }}
                                    >cases</button>
                                    <button
                                      className={tasktype=='wqs'?'active':''}
                                        onClick={()=>{
                                          settasktype("wqs")
                                        }}
                                    >wqs</button>
                                  </div> */}
            <div className="mb-3 img_upload">
              <label className="form-label" htmlFor="coursename">
                Task image
              </label>
              <input
                onChange={(e) => {
                  setimg(e.target.files[0]);
                }}
                className="form-control"
                type="file"
                id="courseimage"
              />
              {/* <button
                            disabled={imgloading}
                            style={{cursor:imgloading?<Loader/>:'pointer'}}
                            onClick={()=>{
                              uploadImage()
                            }}
                          >
                            {
                              imgloading?<Loader/>:"upload"
                            }
                          </button> */}
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="coursename">
                Task text
              </label>
              <textarea
                name=""
                onChange={(e) => {
                  setTaskData({ ...taskData, task_text: e.target.value });
                }}
                className="form-control"
                id=""
                cols="30"
                rows="10"
              ></textarea>
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="coursename">
                Task Time({taskData.time} Minutes ) ={" "}
                {!isNaN((((taskData.time * 1) / 60) * 1).toFixed(2))
                  ? (((taskData.time * 1) / 60) * 1).toFixed(2)
                  : 0}{" "}
                Hours
              </label>

              <Stack
                spacing={2}
                direction="row"
                sx={{ mb: 1 }}
                alignItems="center"
                style={{
                  padding: "0.47rem 0.75rem",
                }}
              >
                <Slider
                  aria-label="time"
                  min={0}
                  max={200}
                  valueLabelDisplay="auto"
                  onChange={(e) => {
                    setTaskData({ ...taskData, time: e.target.value });
                    //
                    // setexamdata({ ...examdata, timer: e.target.value })
                  }}
                />
              </Stack>
            </div>
            <div className="mb-3 img_upload">
              <label className="form-label" htmlFor="coursename">
                Answer image
              </label>
              <input
                onChange={(e) => {
                  setImagesFiles(
                    e.target.files?.length
                      ? Object.keys(e.target.files).map(
                          (file) => e.target.files[`${file}`]
                        )
                      : []
                  );
                }}
                className="form-control"
                type="file"
                multiple="true"
                id="courseimage"
              />
            </div>
            {/* <div className="mb-3">
              <label className="form-label" htmlFor="coursename">
                Task Comment
              </label>
              <textarea
                name=""
                onChange={(e) => {
                  setTaskData({ ...taskData, task_comment: e.target.value });
                }}
                className="form-control"
                id=""
                cols="30"
                rows="10"
              ></textarea>
            </div> */}
            <div className="mb-3">
              <label className="form-label" htmlFor="coursename">
                Task Model Answer
              </label>
              <textarea
                name=""
                onChange={(e) => {
                  setTaskData({
                    ...taskData,
                    text_model_answer: e.target.value,
                  });
                }}
                className="form-control"
                id=""
                cols="30"
                rows="10"
              ></textarea>
            </div>
            <button
              disabled={addloading}
              style={{ cursor: addloading ? "no-drop" : "pointer" }}
              className="btn btn-success"
            >
              {addloading ? <Loader /> : "Add Task"}
            </button>
          </form>
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
};

export default CourseWrQuesTask;
