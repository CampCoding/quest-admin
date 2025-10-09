/* eslint-disable no-sparse-arrays */
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import "./casetask.css";
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
// import './casetimeStamp.css'

// Import Breadcrumb
// import Breadcrumbs from "../../../components/Common/Breadcrumb";

// import DeleteModal from "../../../components/Common/DeleteModal";
// import {getCustomers as onGetCustomers, addNewCustomer as onAddNewCustomer, updateCustomer as onUpdateCustomer, deleteCustomer as onDeleteCustomer} from "../../../store/actions";

// redux
// import TableContainer from '../../../components/Common/TableContainer';

import Breadcrumbs from "../../components/Common/Breadcrumb";
import { toast } from "react-toastify";
import axios from "axios";
import { Loader } from "rsuite";
import "./casetask.css";
// import CourseWqsTableList from "./CourseWqsTimeStampTableList";
// import CourseCasesTableList from "./CourseCasesTableList";
import CourseWqsTableList from "./CourseCasesTableList";
import TableContainer from "../../components/Common/TableContainer";
import TimePicker from "./timePicker";

const TimeStamp = (props) => {
  const [addLoading, setAddLoading] = useState(false);
  const [timeStampData, setTimeStampData] = useState([
    {
      id: 0,
      text: null,
      startTime: null,
    },
  ]);
  useEffect(() => {
    console.log(timeStampData);
  }, [timeStampData]);
  document.title = "video Time Stamp | Quest";
  const location = useLocation();
  const video_id = location?.state?.video_id;
  const [showAddTimeStamp, setShowAddTimeStamp] = useState(false);
  const [timeStamps, setTimeStamps] = useState(false);
  const [editTimeStamps, setEditTimeStamps] = useState(null);
  const [deleteTimeStamps, setDeleteTimeStamps] = useState(false);
  const [selectedTime, setSelectedTime] = useState("00:00:00");

  const handleSliderChange = (event, id) => {
    if (id || id == 0)
      setTimeStampData(
        timeStampData?.map((t_item, t_index) => {
          if (t_item?.id == id) {
            t_item.startTime = event;
          }
          return t_item;
        })
      );
    if (!id && id != 0)
      setEditTimeStamps({
        ...editTimeStamps,
        stamp_time: event,
      });
  };
  const addIndexes = (e) => {
    const form = e.target;
    const resultArray = timeStampData?.map((item) => {
      const item_w = [item?.startTime, item?.text];
      return item_w.join("**");
    });

    axios
      .post(
        "https://camp-coding.tech/quest/platform/admin/videos/insert_timestamp.php",
        {
          video_id: video_id,
          stamp_data: resultArray.join("**matary**"),
        }
      )
      .then((res) => {
        if (res.status == "success") {
          toast.success(res.message);
          // window.location.reload();
          setShowAddTimeStamp(false);
          getTimeStamps();
          setTimeStampData([
            {
              id: 0,
              text: null,
              startTime: null,
            },
          ]);
          form?.reset();
        } else {
          toast.error(res.message);
        }
      });
  };
  const editTimeStamp = (e) => {
    const form = e.target;
    editTimeStamps.stamp_title = editTimeStamps?.name;
    axios
      .post(
        "https://camp-coding.tech/quest/platform/admin/videos/update_video_timestamp.php",

        editTimeStamps
      )
      .then((res) => {
        if (res.status == "success") {
          toast.success(res.message);
          // window.location.reload();
          setEditTimeStamps(false);
          getTimeStamps();

          form?.reset();
        } else {
          toast.error(res.message);
        }
      });
  };
  const deleteTimeStamp = (e) => {
    const form = e.target;

    axios
      .post(
        "https://camp-coding.tech/quest/platform/admin/videos/delete_video_timestamp.php",

        deleteTimeStamps
      )
      .then((res) => {
        if (res.status == "success") {
          toast.success(res.message);
          // window.location.reload();
          setEditTimeStamps(false);
          getTimeStamps();

          form?.reset();
        } else {
          toast.error(res.message);
        }
      });
  };
  const getTimeStamps = async () => {
    try {
      const get = await axios.post(
        "https://camp-coding.tech/quest/platform/admin/videos/select_video_timestamp_data.php",
        {
          video_id,
        }
      );
      if (Array.isArray(get?.message)) setTimeStamps(get.message);
      else setTimeStamps([]);
    } catch (err) {
      setTimeStamps([]);
    }
  };

  const columns = [
    {
      Header: "No",
      Cell: (cell) => {
        return <b>{cell.cell.row?.original?.stamp_id}</b>;
      },
    },
    ,
    {
      Header: "Time Stamp Title",
      accessor: "name",
    },
    {
      Header: "Time",
      accessor: "startTime",
      Filter: false,
      Cell: (cell) => {
        return <>{cell.cell.row.original?.startTime?.split(".")[0]}</>;
      },
    },

    {
      Header: "Edit",
      Cell: (cell) => {
        return (
          <>
            <button
              className="btn btn-primary"
              onClick={() => {
                setEditTimeStamps(cell.cell.row?.original);
              }}
            >
              Edit
            </button>{" "}
            <button
              className="btn btn-danger"
              onClick={() => {
                setDeleteTimeStamps(cell.cell.row?.original);
              }}
            >
              Delete
            </button>
          </>
        );
      },
    },
  ];
  useEffect(() => {
    getTimeStamps();
  }, []);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Time Stamp" breadcrumbItem="Customers" />
          <button
            className="btn btn-success"
            onClick={() => setShowAddTimeStamp(true)}
          >
            Add Time Stamps
          </button>
          <Row>
            <Col xs="12">
              <Card>
                <CardBody>
                  {/* <CourseWqsTableList TimeStampWqs={timeStamps} /> */}
                  {!timeStamps ? (
                    <Loader />
                  ) : timeStamps?.length ? (
                    <TableContainer
                      columns={columns}
                      data={timeStamps}
                      isGlobalFilter={true}
                      customPageSize={10}
                      className="Invoice table"
                    />
                  ) : (
                    <h4>No Time Stamps</h4>
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
      <Modal isOpen={showAddTimeStamp}>
        <ModalHeader tag="h4">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              alignItems: "center",
            }}
          >
            <h4>Add Video TimeStamp</h4>
            <CloseButton
              onClick={() => {
                setShowAddTimeStamp(false);
              }}
              style={{ marginLeft: "auto" }}
            />
          </div>
        </ModalHeader>
        <ModalBody>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              addIndexes(e);
              // addTimeStamp();
            }}
          >
            <div className="inputStampsList">
              <div className="addTimStamp">
                <span> Add Time Stamp</span>
                <span
                  className="btn btn-success"
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    setTimeStampData([
                      ...timeStampData,
                      {
                        id: timeStampData?.length,
                        text: null,
                        startTime: null,
                      },
                    ])
                  }
                >
                  +
                </span>
              </div>
              {timeStampData?.map((item, index) => {
                return (
                  <div className="listTimeStamp">
                    {/* <div className="mb-3">
                      <label className="form-label" htmlFor="coursename">
                        TimeStamp Start Time
                      </label>
                      <input
                        type="range"
                        min={0}
                        max={240} // 4 hours * 60 minutes
                        step={1}
                        onChange={(e) => handleSliderChange(e, item?.id)}
                      />
                      <p>Selected Time: {timeStampData[item?.id]?.startTime}</p>
                    </div> */}
                    <TimePicker
                      value={timeStampData[item?.id]?.startTime}
                      setValue={(value) => handleSliderChange(value, item?.id)}
                    />
                    <div className="mb-3">
                      <label className="form-label" htmlFor="coursename">
                        TimeStamp text
                      </label>
                      <input
                        type="text"
                        value={timeStampData[index]?.text}
                        onChange={(e) => {
                          setTimeStampData(
                            timeStampData?.map((t_item, t_index) => {
                              if (t_item?.id == item?.id) {
                                t_item.text = e.target.value;
                              }
                              return t_item;
                            })
                          );
                        }}
                      />
                    </div>
                    <span
                      className="btn btn-danger"
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        setTimeStampData(
                          timeStampData?.filter(
                            (fl_item) => fl_item?.id != item?.id
                          )
                        )
                      }
                    >
                      -
                    </span>
                  </div>
                );
              })}
            </div>
            <button
              disabled={addLoading}
              style={{ cursor: addLoading ? "no-drop" : "pointer" }}
              className="btn btn-success"
            >
              {addLoading ? <Loader /> : "Add TimeStamp"}
            </button>
          </form>
        </ModalBody>
      </Modal>
      <Modal isOpen={editTimeStamps}>
        <ModalHeader tag="h4">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              alignItems: "center",
            }}
          >
            <h4>Edit Video TimeStamp</h4>
            <CloseButton
              onClick={() => {
                setEditTimeStamps(false);
              }}
              style={{ marginLeft: "auto" }}
            />
          </div>
        </ModalHeader>
        <ModalBody>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              editTimeStamp(e);
              // addTimeStamp();
            }}
          >
            <div className="inputStampsList">
              <div className="listTimeStamp">
                <div className="mb-3">
                  <label className="form-label" htmlFor="coursename">
                    TimeStamp Start Time
                  </label>

                  <TimePicker
                    value={editTimeStamps?.startTime}
                    setValue={(value) => handleSliderChange(value, null)}
                  />
                  {console.log(editTimeStamps)}
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="coursename">
                    Time Stamp text
                  </label>
                  <input
                    type="text"
                    // value={timeStamps?.stamp_title}
                    defaultValue={editTimeStamps?.name}
                    onChange={(e) => {
                      setEditTimeStamps({
                        ...editTimeStamps,
                        stamp_title: e.target.value,
                      });
                    }}
                  />
                </div>
              </div>
            </div>
            <button
              disabled={addLoading}
              style={{ cursor: addLoading ? "no-drop" : "pointer" }}
              className="btn btn-success"
            >
              {addLoading ? <Loader /> : "Edit TimeStamp"}
            </button>
          </form>
        </ModalBody>
      </Modal>
      <Modal isOpen={deleteTimeStamps}>
        <ModalHeader tag="h4">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              alignItems: "center",
            }}
          >
            <h4>Delete Video TimeStamp</h4>
            <CloseButton
              onClick={() => {
                setDeleteTimeStamps(false);
              }}
              style={{ marginLeft: "auto" }}
            />
          </div>
        </ModalHeader>
        <ModalBody>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              deleteTimeStamp(e);
              // addTimeStamp();
            }}
          >
            <h5>Are You Sure ..?</h5>
            <div className="rowDiv">
              {" "}
              <button
                disabled={addLoading}
                style={{ cursor: addLoading ? "no-drop" : "pointer" }}
                className="btn btn-danger"
              >
                {addLoading ? <Loader /> : "Yes"}
              </button>
            </div>
          </form>
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
};

export default TimeStamp;
