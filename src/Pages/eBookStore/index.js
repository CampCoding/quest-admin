import React, { useState } from "react";
import {
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
} from "reactstrap";

import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import TableContainer from "../../components/Common/TableContainer";
import { Loader } from "rsuite";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";
import { Icon } from "@iconify/react";
import {
  ContentCopyOutlined,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import CopyToClipboard from "react-copy-to-clipboard";
import { userData } from "../../store/getProfileData";
// import CourseListTable from "../CourseTable/courseListTable";

const EBook = () => {
  const navigate = useNavigate();
  document.title = "E-Book Store | Quest ";
  const [modal, setmodal] = useState(false);
  const [numberOfPages, setNumberOfPages] = useState(false);
  const [book, setBook] = useState(false);
  const [book_url, setBookUrl] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ebooks, setEbooks] = useState(false);
  const [book_title, set_book_title] = useState("");
  const [edit, setEdit] = useState(null);

  const columns = [
    {
      Header: "book_code",
      Cell: (cell) => {
        return (
          <>
            {permissions?.includes("*12_3") ||
            permissions?.startsWith("12_3") ||
            permissions == "all" ? (
              <CopyToClipboard
                style={{
                  padding: "0 14px",
                  cursor: "pointer",
                  width: "100%",
                  display: "flex",
                  gap: "10px",
                  alignItems: "center",
                }}
                text={cell.cell.row.original?.book_code}
                onCopy={() => toast.success("Copied")}
              >
                <span
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <b
                    style={{
                      fontSize: "22px",
                      fontWeight: "700",
                      color: "green",
                    }}
                  >
                    {cell.cell.row.original?.book_code}
                  </b>
                  <em>
                    <ContentCopyOutlined />
                  </em>
                </span>
              </CopyToClipboard>
            ) : null}
          </>
        );
      },
    },
    {
      Header: "Ebook title",
      accessor: "book_title",
    },
    {
      Header: "Pages Count",
      accessor: "pages_count",
    },
    {
      Header: "Pdf",
      Cell: (cell) => {
        return (
          <>
            {" "}
            {permissions?.includes("*12_6") ||
            permissions?.startsWith("12_6") ||
            permissions == "all" ? (
              <a target="_blank" href={cell.cell.row.original?.book_url}>
                Show Book
              </a>
            ) : null}
          </>
        );
      },
    },
    // Indexing
    {
      Header: "Indexing",
      Cell: (cell) => {
        return (
          <button
            className="btn btn-primary"
            onClick={() => {
              navigate("/Indexing", { state: cell.cell.row.original?.book_id });
            }}
          >
            Indexing
          </button>
        );
      },
    },
    {
      Header: "Status",
      Cell: (cell) => {
        if (
          permissions?.includes("*12_4") ||
          permissions?.startsWith("12_4") ||
          permissions == "all"
        )
          switch (cell.cell.row.original.hidden) {
            case "no":
              return (
                <div style={{ cursor: "pointer" }} onClick={() => {}}>
                  <Visibility className="shown" />
                </div>
              );

            case "yes":
              return (
                <div style={{ cursor: "pointer" }} onClick={() => {}}>
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
      },
    },
    {
      Header: "Action",
      Cell: (cell) => {
        return (
          <>
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
                {permissions?.includes("*12_2") ||
                permissions?.startsWith("12_2") ||
                permissions == "all" ? (
                  <DropdownItem
                    onClick={() => {
                      setEdit(cell.cell.row.original);
                    }}
                  >
                    Edit
                  </DropdownItem>
                ) : null}
              </DropdownMenu>
            </UncontrolledDropdown>
          </>
        );
      },
    },
  ];
  useEffect(() => {
    if (edit) {
      setBookUrl(edit?.book_url);
      setNumberOfPages(edit?.pages_count);
      set_book_title(edit?.book_title);
    }
  }, [edit]);
  useEffect(() => {
    getEbooks();
  }, []);

  const getEbooks = async () => {
    try {
      const get = await axios.get(
        "https://camp-coding.tech/quest/platform/admin/books_store/select_books.php"
      );
      if (Array.isArray(get?.message)) setEbooks(get.message);
      else setEbooks([]);
    } catch (err) {
      setEbooks([]);
    }
  };
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
  const addBook = async (e) => {
    if (book && !book_url && !book_url?.length) {
      return toast.error("Upload Book First");
    }
    const data_send = {
      book_title:
        e.currentTarget.book_title.value &&
        e.currentTarget.book_title.value?.length
          ? e.currentTarget.book_title.value
          : book_title,
      book_url: book_url,
      page_count: numberOfPages,
    };

    // https://camp-coding.tech/quest/platform/admin/ebooks/insert_ebooks.php
    const add = await axios.post(
      "https://camp-coding.tech/quest/platform/admin/books_store/insert_book.php",
      data_send
    );
    if (add.status == "success") {
      toast.success("Added");
      setBook(false);
      getEbooks();
      set_book_title("");

      setBookUrl(false);
      setNumberOfPages(false);
    } else {
      toast.error(add.message);
    }
  };

  const editBook = async (e) => {
    if (book && !book_url && !book_url?.length) {
      return toast.error("Upload Book First");
    }
    const data_send = {
      book_title:
        e.currentTarget.book_title.value &&
        e.currentTarget.book_title.value?.length
          ? e.currentTarget.book_title.value
          : book_title,
      book_url: book_url,
      book_id: edit?.book_id,
      page_count: numberOfPages,
    };

    // https://camp-coding.tech/quest/platform/admin/ebooks/insert_ebooks.php
    const add = await axios.post(
      "https://camp-coding.tech/quest/platform/admin/books_store/update_book_info.php",
      data_send
    );
    if (add.status == "success") {
      toast.success("Updated");
      setBook(false);
      getEbooks();
      setEdit({});
      setBookUrl(false);
      setNumberOfPages(false);
    } else {
      toast.error(add.message);
    }
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
            {permissions?.includes("*12_1") ||
            permissions?.startsWith("12_1") ||
            permissions == "all" ? (
              <button
                className="btn btn-success"
                onClick={() => {
                  setmodal(true);
                }}
              >
                Add New E-book
              </button>
            ) : null}
          </div>
          <div id="table-invoices-list">
            {!ebooks ? (
              <Loader />
            ) : ebooks?.length ? (
              <TableContainer
                columns={columns}
                data={ebooks}
                isGlobalFilter={true}
                customPageSize={10}
                className="Invoice table"
              />
            ) : (
              <h4>No EBooks</h4>
            )}
          </div>
        </Container>

        <ToastContainer />
      </div>
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
                    defaultValue={book_title}
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
      <Modal isOpen={edit} toggle={() => setEdit(false)}>
        <ModalHeader toggle={() => setEdit(false)} tag="h4">
          Edit Ebook
        </ModalHeader>
        <ModalBody>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              editBook(e);
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
                    defaultValue={edit?.book_title}
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
    </React.Fragment>
  );
};

export default EBook;
