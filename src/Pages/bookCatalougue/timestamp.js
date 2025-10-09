import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";

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
// import CourseWqsTableList from "./CourseWqsBookIndexTableList";
// import CourseCasesTableList from "./CourseCasesTableList";
import CourseWqsTableList from "./CourseCasesTableList";
import TableContainer from "../../components/Common/TableContainer";

const Indexing = (props) => {
  const [addLoading, setAddLoading] = useState(false);
  const [timeStampData, setBookIndexData] = useState([
    {
      id: 0,
      text: null,
      startTime: null,
    },
  ]);

  document.title = "Book Indexing | Quest ";
  const location = useLocation();
  const book_id = location?.state;
  const addIndexes = (e) => {
    const form = e.target;
    const resultArray = timeStampData?.map((item) => {
      const item_w = [item?.text, item?.startTime];
      return item_w.join("**");
    });

    axios
      .post(
        "https://camp-coding.tech/quest/platform/admin/ebooks/insert_book_index.php",
        {
          book_id: book_id,
          index_data: resultArray.join("**matary**"),
        }
      )
      .then((res) => {
        if (res.status == "success") {
          toast.success(res.message);
          // window.location.reload();
          setShowAddBookIndex(false);
          getBookIndeses();
          setBookIndexData([
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
  const [showAddBookIndex, setShowAddBookIndex] = useState(false);
  const [timeStamps, setBookIndeses] = useState(false);
  const [editBookIndeses, setEditBookIndeses] = useState(false);
  const [deleteBookIndeses, setDeleteBookIndeses] = useState(false);

  const editBookIndex = (e) => {
    const form = e.target;

    axios
      .post(
        "https://camp-coding.tech/quest/platform/admin/ebooks/edit_book_indexs.php",

        editBookIndeses
      )
      .then((res) => {
        if (res.status == "success") {
          toast.success(res.message);
          // window.location.reload();
          setEditBookIndeses(false);
          getBookIndeses();

          form?.reset();
        } else {
          toast.error(res.message);
        }
      });
  };
  const deleteBookIndex = (e) => {
    const form = e.target;

    axios
      .post(
        "https://camp-coding.tech/quest/platform/admin/ebooks/delete_indexs.php",

        deleteBookIndeses
      )
      .then((res) => {
        if (res.status == "success") {
          toast.success(res.message);
          // window.location.reload();
          setEditBookIndeses(false);
          getBookIndeses();

          form?.reset();
        } else {
          toast.error(res.message);
        }
      });
  };
  const getBookIndeses = async () => {
    try {
      const get = await axios.post(
        "https://camp-coding.tech/quest/platform/admin/ebooks/select_indexs.php",
        {
          book_id,
        }
      );
      if (Array.isArray(get?.message)) setBookIndeses(get.message);
      else setBookIndeses([]);
    } catch (err) {
      setBookIndeses([]);
    }
  };

  const columns = [
    {
      Header: "No",
      Cell: (cell) => {
        return <b>{cell.cell.row?.original?.index_id}</b>;
      },
    },
    ,
    {
      Header: "Index Title",
      accessor: "title",
    },
    {
      Header: "page",
      accessor: "page",
      Filter: false,
    },

    {
      Header: "Edit",
      Cell: (cell) => {
        return (
          <>
            <button
              className="btn btn-primary"
              onClick={() => {
                setEditBookIndeses(cell.cell.row?.original);
              }}
            >
              Edit
            </button>{" "}
            <button
              className="btn btn-danger"
              onClick={() => {
                setDeleteBookIndeses(cell.cell.row?.original);
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
    getBookIndeses();
  }, []);
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Indexing" breadcrumbItem="Customers" />
          <button
            className="btn btn-success"
            onClick={() => setShowAddBookIndex(true)}
          >
            Add Book Indexes
          </button>
          <Row>
            <Col xs="12">
              <Card>
                <CardBody>
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
      <Modal isOpen={showAddBookIndex}>
        <ModalHeader tag="h4">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              alignItems: "center",
            }}
          >
            <h4>Add Book Index</h4>
            <CloseButton
              onClick={() => {
                setShowAddBookIndex(false);
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
              // addBookIndex();
            }}
          >
            <div className="inputStampsList">
              <div className="addTimStamp">
                <span>Add Book Index</span>
                <span
                  className="btn btn-success"
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    setBookIndexData([
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
                  <div className="listBookIndex">
                    <div className="mb-3">
                      <label className="form-label" htmlFor="coursename">
                        Index Page Number
                      </label>
                      <input
                        type="number"
                        value={timeStampData[index]?.startTime}
                        onChange={(e) => {
                          setBookIndexData(
                            timeStampData?.map((t_item, t_index) => {
                              if (t_item?.id == item?.id) {
                                t_item.startTime = e.target.value;
                              }
                              return t_item;
                            })
                          );
                        }}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="coursename">
                        Index text
                      </label>
                      <input
                        type="text"
                        value={timeStampData[index]?.text}
                        onChange={(e) => {
                          setBookIndexData(
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
                        setBookIndexData(
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
              {addLoading ? <Loader /> : "Add IndexIng"}
            </button>
          </form>
        </ModalBody>
      </Modal>
      <Modal isOpen={editBookIndeses}>
        <ModalHeader tag="h4">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              alignItems: "center",
            }}
          >
            <h4>Edit Video BookIndex</h4>
            <CloseButton
              onClick={() => {
                setEditBookIndeses(false);
              }}
              style={{ marginLeft: "auto" }}
            />
          </div>
        </ModalHeader>
        <ModalBody>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              editBookIndex(e);
              // addBookIndex();
            }}
          >
            <div className="inputStampsList">
              <div className="listBookIndex">
                <div className="mb-3">
                  <label className="form-label" htmlFor="coursename">
                    Index Page
                  </label>
                  <input
                    type="number"
                    // value={timeStamps?.stamp_title}
                    defaultValue={editBookIndeses?.page}
                    onChange={(e) => {
                      setEditBookIndeses({
                        ...editBookIndeses,
                        page: e.target.value,
                      });
                    }}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="coursename">
                    Index title
                  </label>
                  <input
                    type="text"
                    // value={timeStamps?.stamp_title}
                    defaultValue={editBookIndeses?.title}
                    onChange={(e) => {
                      setEditBookIndeses({
                        ...editBookIndeses,
                        title: e.target.value,
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
              {addLoading ? <Loader /> : "Edit BookIndex"}
            </button>
          </form>
        </ModalBody>
      </Modal>
      <Modal isOpen={deleteBookIndeses}>
        <ModalHeader tag="h4">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              alignItems: "center",
            }}
          >
            <h4>Delete Video BookIndex</h4>
            <CloseButton
              onClick={() => {
                setDeleteBookIndeses(false);
              }}
              style={{ marginLeft: "auto" }}
            />
          </div>
        </ModalHeader>
        <ModalBody>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              deleteBookIndex(e);
              // addBookIndex();
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

export default Indexing;
