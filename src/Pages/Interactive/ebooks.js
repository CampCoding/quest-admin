import "pdfjs-dist/build/pdf.worker.entry"; // Import the worker entry file
import React, { useState } from "react";
import { Form as FormT, Radio, RadioGroup, SelectPicker } from "rsuite";

import { Icon } from "@iconify/react";
import {
  Paid,
  PaidRounded,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import axios from "axios";
import "flatpickr/dist/themes/material_blue.css";
import { useCallback, useEffect } from "react";
import { toast } from "react-toastify";
import {
  Card,
  CardBody,
  Col,
  Container,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Form,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
  UncontrolledDropdown,
  ModalFooter,
} from "reactstrap";
import { Loader } from "rsuite";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import Confirm from "../../components/ConfComp/Confirm";
import { userData } from "../../store/getProfileData";
import EbooksTableList from "../Lessons/LessonsTabel/EbooksTableList";
import { useNavigate, useParams } from "react-router-dom";
import { Select } from "antd";
const Ebooks = ({ CourseId, unitId, allunitdata, cd }) => {
  const [type, setType] = useState(false);
  const [bookLink, setBookLink] = useState(false);

  const [rowdata, setrowdata] = useState({});
  const [showconf, setshowconf] = useState(false);
  const [deleteId, setDeleteId] = useState(false);

  //
  const [modal, setmodal] = useState(false);
  const navigate = useNavigate();
  /* ====================   Files   ===================*/
  const [loading, setLoading] = useState(false);
  const [book_title, set_book_title] = useState("");
  const [book_type, setbook_type] = useState("");
  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      // No file selected
      return;
    }
    setBook(file);
    var reader = new FileReader();
    reader.readAsBinaryString(event.target.files[0]);
    reader.onloadend = function () {
      var count = reader.result.match(/\/Type[\s]*\/Page[^s]/g)?.length;
      if (count) {
        setNumberOfPages(count);
        set_book_title(file?.name);
      } else {
        setNumberOfPages(false);
        set_book_title("");
      }
    };
  };
  const uploadPdf = async () => {
    setLoading(true);
    const formData = new FormData();
    if (book) {
      formData.append("file_attachment", book);
      const url = await axios.post(
        "https://camp-coding.tech/quest/platform/admin/uploud_pdf.php",
        formData
      );
      console.log(url);
      if (url.status == "success") {
        setBookUrl(url.message);
        toast.success("File Uploaded Successfully");
      } else {
        toast.error(url.message);
      }
    }
    setLoading(false);
  };

  /**
   * Formats the size
   */
  function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }

  function tog_mod() {
    setmodal(!modal);
  }
  /* ====================   Files   ===================*/

  const toggle = useCallback(() => {
    if (modal) {
      setmodal(false);
    } else {
      setmodal(true);
    }
  }, [modal]);

  const [ebook_data, setEbookData] = useState(false);
  const [edit, setEdit] = useState(false);
  const [ebooks, setEbooks] = useState(false);
  const [bookStore, setBookStore] = useState(false);
  const [bookType, setBookType] = useState(false);
  const [item, setItem] = useState(false);
  const permissions = userData?.permissions;
  const { university_id, grade_id } = useParams();

  const [itemLoader, setItemLoader] = useState(false);
  const getEbooks = async () => {
    setItemLoader(true);
    const data_send = {
      university_id: university_id,
      grade_id: grade_id,
    };
    const get = await axios.post(
      "https://camp-coding.tech/quest/platform/admin/ebooks/select_grade_ebooks.php",
      data_send
    );
    setEbooks(
      get.message ? get.message : get?.data?.message ? get?.data?.message : []
    );
    console.log(get);
    setItemLoader(false);
  };

  const getAllEbooks = async () => {
    setItemLoader(true);
    const get = await axios.get(
      "https://camp-coding.tech/quest/platform/admin/books_store/select_books.php"
    );
    setBookStore(get.message);
    setItemLoader(false);
  };

  const showHideEbooks = async (send_data) => {
    const ebooks_1 = await axios.post(
      "https://camp-coding.tech/quest/platform/admin/ebooks/update_ebook_hidden.php",
      send_data
    );

    if (ebooks_1.status == "success") {
      toast.success(ebooks_1.message);
      await getEbooks();
      setEdit(false);
    } else {
      toast.error(ebooks_1.message);
    }
  };

  const editEbook = async (e) => {
    const data_send = {
      course_id: CourseId,
      unit_id: unitId,
      book_url: book_url ? book_url : item?.book_url,
      book_title: e.currentTarget.ebook_title.value
        ? e.currentTarget.ebook_title.value
        : item?.ebook_title,
      book_id: item.book_id,
      page_count: numberOfPages ? numberOfPages : item.page_count,
    };
    const edit = await axios.post(
      "https://camp-coding.tech/quest/platform/admin/ebooks/update_ebook_info.php",
      data_send
    );

    if (edit.status == "success") {
      toast.success(edit.message);
      await getEbooks();
      setEdit(false);
    } else {
      toast.error(edit.message);
    }
  };

  const handelDelete = async () => {
    axios
      .post(
        "https://camp-coding.tech/quest/platform/admin/ebooks/delete_ebook.php",
        { book_id: item?.book_id }
      )
      .then((res) => {
        if (res.status == "success") {
          toast.success(res.message);
          setDeleteId(false);
          setItem({});
          getEbooks();
        } else if (res.status == "error") {
          toast.error(res.message);
        } else {
          toast.error("Something Went Error");
        }
      })
      .catch((err) => toast.error(err));
  };

  const MakeFree = async (book_id) => {
    try {
      const Download = await axios.post(
        "https://camp-coding.tech/quest/platform/admin/ebooks/toggle_book_free.php",
        {
          book_id,
        }
      );

      console.log(Download);

      if (Download.status == "success") {
        getEbooks();
        toast.success(Download.message);
      } else {
        toast.error(Download.message);
      }
    } catch (e) {
      console.log(e);
    }
  };

  // editEbook
  useEffect(() => {
    getEbooks();
  }, []);
  const columns = [
    {
      Header: "No",
      Cell: (cell) => {
        return <b>{cell.cell.row.index + 1}</b>;
      },
    },
    {
      Header: "Ebook title",
      accessor: "book_title",
    },
    {
      Header: "Ebook type",
      accessor: "type",
    },
    {
      Header: "Pages Count",
      accessor: "page_count",
    },
    {
      Header: "Pdf",
      Cell: (cell) => {
        return (
          <a target="_blank" href={cell.cell.row.original.book_url}>
            Show Book
          </a>
        );
      },
    },
    {
      Header: "Free",
      Cell: (cell) => {
        return (
          <>
            {permissions?.includes("*3_1") ||
            permissions?.startsWith("3_1") ||
            permissions == "all" ? (
              <button
                className="btn"
                onClick={() => {
                  const item = cell.cell.row.original;
                  MakeFree(cell.cell.row.original.book_id);
                }}
              >
                {cell.cell.row.original.free == "1" ? (
                  <Paid className="hidden" color="green" />
                ) : (
                  <PaidRounded className="shown" color="red" />
                )}
              </button>
            ) : null}
          </>
        );
      },
    },
    {
      Header: "Status",
      Cell: (cell) => {
        if (
          permissions?.includes("*5_5") ||
          permissions?.startsWith("5_5") ||
          permissions == "all"
        )
          switch (cell.cell.row.original.hidden) {
            case "no":
              return (
                <div
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setshowconf(true);
                    setrowdata({
                      ...cell.cell.row.original,
                      number: cell.cell.row.index + 1,
                    });
                    // const item = cell.cell.row.original;
                    // const send_data = {
                    //   hidden_value: item.hidden == "no" ? "yes" : "no",
                    //   book_id: item.book_id
                    // }
                    // showHideEbooks(send_data)
                  }}
                >
                  <Visibility className="shown" />
                </div>
              );

            case "yes":
              return (
                <div
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setshowconf(true);
                    setrowdata({
                      ...cell.cell.row.original,
                      number: cell.cell.row.index + 1,
                    });
                    // const item = cell.cell.row.original;
                    // const send_data = {
                    //   hidden_value: item.hidden == "no" ? "yes" : "no",
                    //   book_id: item.book_id
                    // }
                    // showHideEbooks(send_data)
                  }}
                >
                  <VisibilityOff className="hidden" />
                </div>
              );

            default:
              return (
                <span className="badge badge-pill badge-soft-success font-size-12">
                  {cell.cell.row.original.hidden}
                </span>
              );
          }
        else {
          return null;
        }
      },
    },
    {
      Header: "Action",
      Cell: (cell) => {
        return (
          <>
            {
              <div style={{ display: "flex", gap: "10px" }}>
                <UncontrolledDropdown>
                  <DropdownToggle
                    className="btn btn-light btn-sm"
                    tag="button"
                    data-bs-toggle="dropdown"
                    direction="start"
                  >
                    <i className="bx bx-dots-horizontal-rounded"></i>
                  </DropdownToggle>
                  <DropdownMenu className="dropdown-menu-end">
                    {permissions?.includes("*5_3") ||
                    permissions?.startsWith("5_3") ||
                    permissions == "all" ? (
                      <DropdownItem
                        onClick={() => {
                          setEdit(true);
                          setItem(cell.cell.row.original);
                        }}
                      >
                        Edit
                      </DropdownItem>
                    ) : null}

                    <DropdownItem>
                      <button
                        className="btn btn-success"
                        onClick={() =>
                          navigate("/EbookStats", {
                            state: { book: cell.cell.row.original },
                          })
                        }
                      >
                        Statistics
                      </button>
                    </DropdownItem>
                    <DropdownItem
                      onClick={() => handlecopyitem(cell.cell.row.original)}
                    >
                      Copy
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
                <button
                  className="btn btn-danger"
                  onClick={() => {
                    setDeleteId(true);
                    setItem(cell.cell.row.original);
                  }}
                >
                  Delete
                </button>
              </div>
            }
          </>
        );
      },
    },
  ];
  const handlecopyitem = (data) => {
    const data_send = {
      ebook_id: data.ebook_id,
    };

    axios
      .post(
        "https://camp-coding.tech/quest/platform/admin/ebooks/make_copy_from_ebooks.php",
        JSON.stringify(data_send)
      )
      .then((res) => {
        if (res.status == "success") {
          toast.success(res.message);
          getEbooks();
        } else if (res.status == "error") {
          toast.error(res.message);
        } else {
          toast.error("Something Went Error");
        }
      });
  };
  const [numberOfPages, setNumberOfPages] = useState(false);
  const [book, setBook] = useState(false);
  const [itemTLoader, setItemTLoader] = useState(false);
  const [uploadModal, setUploadModal] = useState(false);
  const [book_url, setBookUrl] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(false);
  const [bookData_r, setBookDataR] = useState(false);
  const [bookTitle, setBookTitle] = useState("");
  const [searchValue, setSearchValue] = useState(false);

  const addBook = async (e) => {
    const data_send = {
      grade_id: grade_id,
      university_id: university_id,
      book_title: e.currentTarget.book_title.value,
      book_url: selectedCourse?.book_code
        ? selectedCourse?.book_code
        : book_url,
      page_count: selectedCourse?.pages_count
        ? selectedCourse?.pages_count
        : numberOfPages,
      type: book_type,
    };

    const add = await axios.post(
      "https://camp-coding.tech/quest/platform/admin/ebooks/insert_ebooks.php",
      data_send
    );

    if (add.status == "success") {
      toast.success("Added");
      setBook(false);
      setBookUrl(false);
      setNumberOfPages(false);
      setSelectedCourse(null);
      setBookTitle(null);
      setBookUrl(null);
      setNumberOfPages(null);
      setUploadModal(false);
      getEbooks();
      setmodal(false);
    } else {
      toast.error(add.message);
    }
  };
  useEffect(() => {
    if (modal) getAllEbooks();
  }, [modal]);
  useEffect(() => {
    console.log(selectedCourse);
    if (selectedCourse) setBookTitle(selectedCourse?.book_title);
  }, [selectedCourse]);
  return (
    <React.Fragment>
      <Container fluid={true}>
        <Breadcrumbs
          title={cd.course_name}
          breadcrumbItem={allunitdata?.unit_name + " > Ebooks List"}
        />

        <Row>
          <Col lg={12}>
            <Card>
              <CardBody>
                <div className="position-relative">
                  <div className="modal-button mt-2">
                    <Row className="align-items-start">
                      <Col className="col-sm">
                        <div>
                          {/* <button
                            type="button"
                            className="btn btn-success mb-4"
                            data-bs-toggle="modal"
                            data-bs-target="#addCourseModal"
                            onClick={() => {
                              setmodal(true);
                            }}
                          >
                            <i
                              onClick={() => {
                                setmodal(true);
                              }}
                              className="mdi mdi-plus me-1"
                            ></i>{" "}
                            Add Ebook
                          </button> */}
                          <button
                            type="button"
                            className="btn btn-success mb-4"
                            data-bs-toggle="modal"
                            data-bs-target="#addCourseModal"
                            onClick={() => {
                              setUploadModal(true);
                            }}
                          >
                            <i
                              onClick={() => {
                                setUploadModal(true);
                              }}
                              className="mdi mdi-plus me-1"
                            ></i>{" "}
                            Upload Ebook
                          </button>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </div>
                <div id="table-invoices-list">
                  {itemLoader ? (
                    <Loader />
                  ) : (
                    <>
                      {ebooks && ebooks.length ? (
                        <EbooksTableList
                          showHideEbook={showHideEbooks}
                          data={ebooks}
                          columns={columns}
                        />
                      ) : (
                        <h4>No Ebooks</h4>
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
          Add New Ebook
        </ModalHeader>
        <ModalBody>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              addBook(e);
              return false;
            }}
          >
            <Row>
              <Col md={12}>
                <div className="mb-3">
                  <Label className="form-label">Ebook Title</Label>
                  <Input
                    name="book_title"
                    type="text"
                    value={bookTitle}
                    onChange={(e) => setBookTitle(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <Label className="form-label">Ebook Code</Label>
                  <div className="input_Field">
                    <FormT.Group controlId="radioList">
                      <RadioGroup
                        name="radioList"
                        onChange={(e) => {
                          setBookDataR(false);
                          setSelectedCourse(null);
                          setBookType(e);
                        }}
                      >
                        <p>Get Book</p>
                        <Radio value="vlist">Select From List</Radio>
                        <Radio value="vsid">Search By Book source Id</Radio>
                      </RadioGroup>
                    </FormT.Group>
                    {bookType == "vsid" ? (
                      bookStore && bookStore.length ? (
                        <>
                          <input
                            type="search"
                            className="search_type"
                            onChange={(e) =>
                              setSearchValue(e.currentTarget.value)
                            }
                            placeholder="Book Source ID"
                          />
                          {searchValue && searchValue.length != "" ? (
                            <ul
                              className="options"
                              style={{ listStyle: "none" }}
                            >
                              {itemTLoader ? (
                                <Loader />
                              ) : bookStore && bookStore.length ? (
                                bookStore.map((item) => {
                                  return item.book_id
                                    .toString()
                                    .includes(searchValue) ||
                                    item.book_code
                                      .toString()
                                      .includes(searchValue) ? (
                                    <li
                                      onClick={() => {
                                        setSelectedCourse(item);
                                        // setSearchValue(false);
                                      }}
                                    >
                                      {item.book_title}
                                    </li>
                                  ) : null;
                                })
                              ) : (
                                <h3>No Books</h3>
                              )}
                            </ul>
                          ) : null}
                        </>
                      ) : (
                        <h3>No Books</h3>
                      )
                    ) : bookType == "vlist" ? (
                      bookStore && bookStore.length ? (
                        <>
                          <SelectPicker
                            label="Select Book"
                            data={bookStore.map((item) => {
                              return {
                                label: item?.book_title,
                                value: item?.book_id,
                              };
                            })}
                            style={{ width: 224 }}
                            required
                            onChange={(e) =>
                              setSelectedCourse(
                                bookStore.filter((item) => {
                                  return item?.book_id == e;
                                })[0]
                              )
                            }
                          />
                        </>
                      ) : (
                        <h3>No Books</h3>
                      )
                    ) : null}
                  </div>
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
      <Modal isOpen={edit} toggle={() => setEdit(false)}>
        <ModalHeader toggle={() => setEdit(false)} tag="h4">
          Edit Written Ebook
        </ModalHeader>
        <ModalBody>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              editEbook(e);
              return false;
            }}
          >
            <Row>
              <Col md={12}>
                <div className="mb-3">
                  <Label className="form-label">Ebook Title</Label>
                  <Input
                    type="text"
                    name="ebook_title"
                    defaultValue={item?.book_title}
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
      <Modal isOpen={uploadModal} toggle={() => setUploadModal(false)}>
        <ModalHeader toggle={() => setUploadModal(false)} tag="h4">
          Add New Ebook
        </ModalHeader>
        <ModalBody>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              addBook(e);
              return false;
            }}
          >
            <Row>
              <Col md={12}>
                <div className="mb-3">
                  <Label className="form-label">Ebook Title</Label>
                  <Input
                    name="book_title"
                    type="text"
                    defaultValue={book_title}
                  />
                </div>
                <div className="mb-3">
                  <Label className="form-label">Ebook Type</Label>
                  <Select
                    onChange={(e) => setbook_type(e)}
                    value={book_type}
                    options={[
                      { label: "Theoretical", value: "Theoretical" },
                      { label: "Questions", value: "Questions" },
                      { label: "Boards", value: "Boards" },
                    ]}
                    style={{ width: "100%" }}
                  />
                </div>
                <div className="mb-3">
                  <Label className="form-label">ebook file</Label>
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
                      accept=".pdf"
                      onChange={handleFileSelect}
                    />{" "}
                    <span
                      className="btn btn-primary"
                      onClick={() => uploadPdf()}
                    >
                      {!loading ? (
                        <Icon icon="solar:upload-bold-duotone" />
                      ) : (
                        <Loader size="sm" />
                      )}
                    </span>
                  </div>
                  <h4>
                    {numberOfPages ? (
                      <span>numberOfPages : {numberOfPages}</span>
                    ) : null}
                  </h4>
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
      {showconf ? (
        <Confirm
          id={rowdata.number}
          cancleoper={() => {
            setshowconf(false);
          }}
          confirmoper={() => {
            const send_data = {
              hidden_value: rowdata.hidden == "no" ? "yes" : "no",
              book_id: rowdata.book_id,
            };
            showHideEbooks(send_data);
            setshowconf(false);
          }}
          status={rowdata.hidden == "no" ? "hide" : "show"}
          comp={"unit"}
        />
      ) : null}

      <Modal isOpen={!!deleteId} toggle={() => setDeleteId(false)} centered>
        <ModalHeader toggle={() => setDeleteId(false)}>
          Delete ebook
        </ModalHeader>
        <ModalBody>
          <h5>Are You Sure To Delete ebook - {item?.book_title} ?</h5>
        </ModalBody>
        <ModalFooter>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <button
              className="btn btn-danger "
              style={{ margin: "0 !important" }}
              onClick={handelDelete}
            >
              Yes
            </button>
            <button
              className="btn btn-primary"
              style={{ margin: "0" }}
              onClick={() => setDeleteId(false)}
            >
              No
            </button>
          </div>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  );
};

export default Ebooks;
