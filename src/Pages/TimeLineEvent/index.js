import React, { useMemo, useState } from "react";
import { Container, Modal, Spinner } from "reactstrap";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
// import 'react-big-calendar/lib/sass/styles.css';
// import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import { Calendar, Views, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import events from "./resources/events";
import axios from "axios";
import { Loader } from "rsuite";
import { useEffect } from "react";
import { useCallback } from "react";

// import CourseListTable from "../CourseTable/courseListTable";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { toast } from "react-toastify";
import { userData } from "../../store/getProfileData";
const TimeLine = () => {
  const localizer = momentLocalizer(moment);
  const [rowData, setRowData] = useState({});
  const [meetData, setMeetData] = useState({
    title: "",
    instructor_name: "",
    account_id: "",
  });
  const [dateForCheck, setDateForCheck] = useState({
    start: "",
    end: "",
  });
  const [addLoading, setAddLoading] = useState(false);
  const [selectedInter, setSelectedInter] = useState("");
  const [accounts, setAccounts] = useState([]);
  const [avilabelAccounts, setAvilabelAccounts] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [myEvents, setEvents] = useState(events);
  const [cancLoading, setCancLoading] = useState(false);
  const [timeLines, setTimeLines] = useState(null);
  const [dateData, setDateData] = useState({
    start: "",
    end: "",
  });
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [interLoading, setInterLoading] = useState(false);
  const [intersections, setIntersections] = useState([]);

  const handleSelectSlot = useCallback(
    ({ start, end }) => {
      const data_send = {
        start: moment(start).format("YYYY-MM-DD HH:MM:SS"),
        end: moment(end).format("YYYY-MM-DD HH:MM:SS"),
      };

      axios
        .post(
          "https://camp-coding.tech/quest/platform/admin/meeting_reservation/select_available_after_intersection.php",
          JSON.stringify(data_send)
        )
        .then((res) => {
          if (res.status == "success") {
            setIntersections(res.message);
            setSelectedInter(res?.message[0]?.account_id);
            setMeetData({
              ...meetData,
              account_id: res.message[0].account_id,
              start: moment(start).format("YYYY-MM-DD HH:MM:SS"),
              end: moment(end).format("YYYY-MM-DD HH:MM:SS"),
            });
          }
        })
        .finally(() => {
          setInterLoading(false);
        });
      setShowAddModal(true);
    },
    [setEvents]
  );

  const getallTimeLines = () => {
    axios
      .get(
        "https://camp-coding.tech/quest/platform/admin/meeting_reservation/select_reservations.php"
      )
      .then((res) => {
        const updatedMessage = res?.message?.map((item, index, array) => {
          item.start = new Date(item.start);
          item.end = new Date(item.end);
          item.display = "background";
          item.color = "white";
          item.backgroundColor = "";
          item.fontWeight = 900;
          item.borderColor = "transparent";
          if (item?.account_name == "Melmatary1612@gmail.com") {
            item.backgroundColor = "yellow";
            item.color = "black";
          } else if (item?.account_name == "Drelmatary@gmail.com") {
            item.backgroundColor = "#007fff";
            item.color = "white";
          } else {
            item.backgroundColor = "#00ffff";
            item.color = "black";
          }
          // for (let i = 0; i < array.length; i++) {
          //   if (i !== index) {
          //     const otherItem = array[i];
          //     const isOverlap =
          //       (item.start >= otherItem.start && item.start < otherItem.end) ||
          //       (item.end > otherItem.start && item.end <= otherItem.end) ||
          //       (item.start <= otherItem.start && item.end >= otherItem.end);

          //     if (isOverlap) {
          //       item.backgroundColor = getRandomColor();
          //       break;
          //     }
          //   }
          // }

          return item;
        });
        setTimeLines(updatedMessage || []);
      });
  };
  function getRandomColor() {
    // Generate a random hex color code
    return "#" + Math.floor(Math.random() * 16777215).toString(16);
  }
  const handleSelectEvent = useCallback((event) => {
    setShowModal(true);
    setRowData(event);
    // event.title
  }, []);

  const { defaultDate, scrollToTime } = useMemo(
    () => ({
      defaultDate: new Date(),
      scrollToTime: new Date(1970, 1, 1, 6),
    }),
    []
  );

  const handleCancel = () => {
    setCancLoading(true);
    const data_send = {
      id: rowData?.id,
    };
    axios
      .post(
        "https://camp-coding.tech/quest/platform/admin/meeting_reservation/cancel_reservation.php",
        data_send
      )
      .then((res) => {
        if (res.status == "success") {
          toast.success(res.message);
          getallTimeLines();
          setShowModal(false);
        } else if (res.status == "error") {
          toast.error(res.message);
        } else {
          toast.error("Something Went Error");
        }
      })
      .catch((e) => console.log(e))
      .finally(() => {
        setCancLoading(false);
      });
  };
  const handleGetZoomsAccounts = () => {
    axios
      .get(
        "https://camp-coding.tech/quest/platform//admin/zoom/select_zoom_can_use.php"
      )
      .then((res) => {
        if (res.status == "success") {
          setAccounts(res.message);
          setAvilabelAccounts(res.message);
        }
      })
      .catch((e) => console.log(e));
  };

  const handleRefresh = () => {
    setInterLoading(true);
    const data_send = {
      ...dateData,
    };
    axios
      .post(
        "https://camp-coding.tech/quest/platform/admin/meeting_reservation/select_available_after_intersection.php",
        JSON.stringify(data_send)
      )
      .then((res) => {
        if (res.status == "success") {
          setIntersections(res.message);
          setSelectedInter(res.message[0].account_id);
          setMeetData({ ...meetData, account_id: res.message[0].account_id });
        }
      })
      .finally(() => {
        setInterLoading(false);
      });
  };

  useEffect(() => {
    getallTimeLines();
    handleGetZoomsAccounts();
  }, []);
  const eventStyleGetter = (event, start, end, isSelected) => {
    // Customize the styles based on the event's email
    const emailColorMap = {
      "Melmatary1612@gmail.com": "red",
      "mohamedelmataryy@gmail.com": "blue",
      "Drelmatary@gmail.com": "green",
      // Add more email-color mappings as needed
    };

    const backgroundColor = emailColorMap[event?.account_name] || "gray"; // Default color if not found in the mapping
    const style = {
      backgroundColor,
      borderRadius: "5px",
      opacity: 0.8,
      color: "white",
      border: "1px solid #ccc",
      display: "block",
    };

    return {
      style,
    };
  };
  const handleAddNew = () => {
    if (meetData.account_id == "") {
      toast.warn("Choose Account Number");
      return;
    }
    if (meetData.title == "") {
      toast.warn("Enter Meeting Title");
      return;
    }
    if (meetData.instructor_name == "") {
      toast.warn("Enter Instructor Name");
      return;
    }
    setAddLoading(true);

    axios
      .post(
        "https://camp-coding.tech/quest/platform/admin/meeting_reservation/reserve_meeting.php",
        JSON.stringify({
          ...meetData,
          created_by_admin_id: userData?.user_id,
        })
      )
      .then((res) => {
        if (res.status == "success") {
          setShowAddModal(false);
          getallTimeLines();
          toast.success(res.message);
        } else if (res.status == "error") {
          toast.error(res.message);
          setShowError(true);
          setErrorMessage(res.message);
        } else {
          toast.error("Something Went Error");
        }
      })
      .catch((e) => console.log(e))
      .finally(() => {
        setAddLoading(false);
      });
  };
  useEffect(() => {
    if (showError) {
      setTimeout(() => {
        setShowError(false);
      }, 3000);
    }
  }, [showError]);
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <div>
            {!timeLines ? (
              <Loader />
            ) : timeLines?.length ? (
              <Calendar
                // dayLayoutAlgorithm={'no-overlap'}
                defaultDate={defaultDate}
                // defaultView={"timeGridWeek"}
                events={timeLines}
                tooltipAccessor={(event) =>
                  event?.title + " / " + event?.account_name
                }
                localizer={localizer}
                onSelectEvent={handleSelectEvent}
                onSelectSlot={handleSelectSlot}
                selectable
                scrollToTime={scrollToTime}
                eventPropGetter={(myEventsList) => {
                  const backgroundColor = myEventsList.backgroundColor
                    ? myEventsList.backgroundColor
                    : "blue";
                  const color = myEventsList.color
                    ? myEventsList.color
                    : "blue";
                  const borderColor = myEventsList?.borderColor;
                  return { style: { backgroundColor, color, borderColor } };
                }}
              />
            ) : null}
          </div>
          <div className="showtimedata">
            <Modal
              isOpen={showModal}
              toggle={() => {
                setShowModal(!showModal);
              }}
              id="success-btn"
              centered
            >
              <div className="modal-content">
                <div className="modal-body">
                  <div className="ModalTable">
                    <table>
                      <tr>
                        <td>Title</td>
                        <td>{rowData?.title}</td>
                      </tr>
                      <tr>
                        <td>Start Date</td>
                        <td>
                          {moment(rowData?.start).format(
                            "MMMM Do YYYY, h:mm:ss a"
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td>End Date</td>
                        <td>
                          {moment(rowData?.end).format(
                            "MMMM Do YYYY, h:mm:ss a"
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td>Instructor Name</td>
                        <td>{rowData?.instructor_name}</td>
                      </tr>
                      <tr>
                        <td>Zoom Account Email</td>
                        <td>{rowData?.account_name}</td>
                      </tr>
                      <tr>
                        <td>Created By</td>
                        <td>{rowData?.created_by_admin_name}</td>
                      </tr>
                      <tr>
                        <td>Created Date</td>
                        <td>{moment(rowData?.created_date).format("L")}</td>
                      </tr>
                    </table>
                    <div className="my-2">
                      <button
                        style={{ marginRight: "10px" }}
                        onClick={() => {
                          setShowModal(false);
                        }}
                        className="btn btn-danger"
                      >
                        {cancLoading ? <Spinner /> : "Close Model"}
                      </button>
                      {rowData?.created_by_admin_id == userData?.user_id ? (
                        <button
                          onClick={() => {
                            handleCancel();
                          }}
                          className="btn btn-danger"
                        >
                          {cancLoading ? <Spinner /> : "End Meeting"}
                        </button>
                      ) : null}
                    </div>
                    {/* <h5>Account N</h5> */}
                  </div>
                </div>
              </div>
            </Modal>

            <Modal
              isOpen={showAddModal}
              toggle={() => {
                setShowAddModal(!showAddModal);
              }}
              id="success-btn"
              centered
            >
              <div className="modal-content">
                <div className="modal-body">
                  <div className="my-2">
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: "5px",
                      }}
                      htmlFor=""
                      className="my-2"
                    >
                      <span></span>
                    </label>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <select
                        disabled={interLoading}
                        value={meetData.account_id}
                        onChange={(e) => {
                          // setSelectedInter(e.target.value)
                          setMeetData({
                            ...meetData,
                            account_id: e.target.value,
                          });
                        }}
                        name=""
                        className="form-control"
                        id=""
                      >
                        {intersections.map((item, index) => {
                          return (
                            <option value={item.account_id}>
                              {item.account_name}
                            </option>
                          );
                        })}
                      </select>
                      <img
                        style={{
                          width: "30px",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          handleRefresh();
                        }}
                        src={require("../../assets/images/refre.png")}
                      />
                    </div>
                  </div>
                  <div className="my-2">
                    <label htmlFor="">Meeting Title</label>
                    <input
                      onChange={(e) => {
                        setMeetData({ ...meetData, title: e.target.value });
                      }}
                      placeholder="Meeting Title"
                      type="text"
                      className="form-control"
                    />
                  </div>
                  <div className="my-2">
                    <label htmlFor="">Instructor Name</label>
                    <input
                      onChange={(e) => {
                        setMeetData({
                          ...meetData,
                          instructor_name: e.target.value,
                        });
                      }}
                      placeholder="Instructor Name"
                      type="text"
                      className="form-control"
                    />
                  </div>
                  <div>
                    <p
                      style={{
                        color: "red",
                        textAlign: "center",
                      }}
                    >
                      {showError ? <>Error:{errorMessage}</> : null}
                    </p>
                  </div>
                  <div className="my-3 d-flex align-items-center justify-content-between">
                    <button
                      disabled={addLoading}
                      onClick={() => {
                        handleAddNew();
                      }}
                      className="btn btn-success"
                    >
                      {addLoading ? <Spinner /> : "Add"}
                    </button>
                    <button
                      onClick={() => {
                        setShowAddModal(false);
                      }}
                      style={{ width: "fit-content", marginTop: "0px" }}
                      className="btn btn-danger clos_btn"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </Modal>
          </div>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default TimeLine;
