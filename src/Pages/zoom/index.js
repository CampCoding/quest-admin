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
import { Loader, Toggle } from "rsuite";
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
import { ToggleButton } from "@mui/material";
// import CourseListTable from "../CourseTable/courseListTable";

const ZoomEmail = () => {
  const navigate = useNavigate();
  document.title = "E-Book Store | Quest ";
  const [modal, setmodal] = useState(false);
  const [numberOfPages, setNumberOfPages] = useState(false);
  const [book, setBook] = useState(false);
  const [book_url, setBookUrl] = useState(false);
  const [loading, setLoading] = useState(false);
  const [zoomEmails, setZoomEmail] = useState(false);
  const [account_name, set_account_name] = useState("");
  const [edit, setEdit] = useState(null);
  const [checked, setChecked] = useState(false);
  const [showHide, setShowHide] = useState(null);
  const columns = [
    {
      Header: "account_name",
      accessor: "account_name",
    },
    {
      Header: "account_sdkKey",
      accessor: "account_sdkKey",
    },
    {
      Header: "account_sdkSecret",
      accessor: "account_sdkSecret",
    },
    {
      Header: "have_poll",
      accessor: "have_poll",
      Cell: (cell) => {
        return (
          <span>{cell.cell.row.original.have_poll == "yes" ? "✅" : "❌"}</span>
        );
      },
    },
    {
      Header: "Status",
      Cell: (cell) => {
        switch (cell.cell.row.original.hidden) {
          case "no":
            return (
              <div
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setShowHide(cell.cell.row.original);
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
                  setShowHide(cell.cell.row.original);
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
      },
    },
    // {
    //   Header: "Action",
    //   Cell: (cell) => {
    //     return (
    //       <>
    //         <UncontrolledDropdown>
    //           <DropdownToggle
    //             className="btn btn-light btn-sm"
    //             tag="button"
    //             data-bs-toggle="dropdown"
    //             direction="start"
    //           >
    //             <i className="bx bx-dots-horizontal-rounded"></i>
    //           </DropdownToggle>
    //           <DropdownMenu className="dropdown-menu-end">
    //             <DropdownItem
    //               onClick={() => {
    //                 setEdit(cell.cell.row.original);
    //               }}
    //             >
    //               Edit
    //             </DropdownItem>
    //           </DropdownMenu>
    //         </UncontrolledDropdown>
    //       </>
    //     );
    //   },
    // },
  ];
  useEffect(() => {
    if (edit) {
      setBookUrl(edit?.book_url);
      setNumberOfPages(edit?.pages_count);
      set_account_name(edit?.account_name);
    }
  }, [edit]);
  useEffect(() => {
    getZoomEmails();
  }, []);

  const getZoomEmails = async () => {
    try {
      const get = await axios.get(
        "https://camp-coding.tech/quest/platform/admin/zoom/select_zoom_sdk.php"
      );
      if (Array.isArray(get?.message)) setZoomEmail(get.message);
      else setZoomEmail([]);
    } catch (err) {
      setZoomEmail([]);
    }
  };

  const addZoomEmail = async (e) => {
    e?.preventDefault();

    const data_send = {
      account_name: e?.currentTarget?.account_name?.value,
      account_sdkKey: e?.currentTarget?.account_sdkKey?.value,
      account_sdkSecret: e?.currentTarget?.account_sdkSecret?.value,
      have_poll: checked ? "yes" : "no",
    };

    // https://camp-coding.tech/quest/platform/admin/ebooks/insert_ebooks.php
    const add = await axios.post(
      "https://camp-coding.tech/quest/platform/admin/zoom/add_zoom_sdk.php",
      data_send
    );
    if (add.status == "success") {
      toast.success("Added");
      setBook(false);
      getZoomEmails();
      setChecked(false);
      setBookUrl(false);
      setNumberOfPages(false);
    } else {
      toast.error(add.message);
    }
  };

  // const editZoomEmail = async (e) => {
  //   // https://camp-coding.tech/quest/platform/admin/ebooks/insert_ebooks.php
  //   const add = await axios.post(
  //     "https://camp-coding.tech/quest/platform/admin/zoom/hide_zoom_sdk.php",
  //     edit
  //   );
  //   if (add.status == "success") {
  //     toast.success("Updated");
  //     setBook(false);
  //     getZoomEmails();
  //     setEdit({});
  //     setBookUrl(false);
  //     setNumberOfPages(false);
  //   } else {
  //     toast.error(add.message);
  //   }
  // };
  const showHideZoomEmail = async (e) => {
    // https://camp-coding.tech/quest/platform/admin/ebooks/insert_ebooks.php
    const add = await axios.post(
      "https://camp-coding.tech/quest/platform/admin/zoom/hide_zoom_sdk.php",
      {
        ...showHide,
        status: showHide?.hidden == "yes" ? "no" : "yes",
      }
    );
    if (add.status == "success") {
      toast.success("Updated");
      setBook(false);
      getZoomEmails();
      setShowHide(null);
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
            <button
              className="btn btn-success"
              onClick={() => {
                setmodal(true);
              }}
            >
              Add New Zoom Email
            </button>
          </div>
          <div id="table-invoices-list">
            {!zoomEmails ? (
              <Loader />
            ) : zoomEmails?.length ? (
              <TableContainer
                columns={columns}
                data={zoomEmails}
                isGlobalFilter={true}
                customPageSize={10}
                className="Invoice table"
              />
            ) : (
              <h4>No Zoom Emails</h4>
            )}
          </div>
        </Container>

        <ToastContainer />
      </div>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle} tag="h4">
          Add New Zoom Email
        </ModalHeader>
        <ModalBody>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              addZoomEmail(e);
              return false;
            }}
          >
            <Row>
              <Col md={12}>
                <div className="mb-3">
                  <Label className="form-label">Zoom account_name</Label>
                  <Input
                    name="account_name"
                    type="text"
                    defaultValue={account_name}
                  />
                </div>
                <div className="mb-3">
                  <Label className="form-label">Zoom account_sdkKey</Label>
                  <Input
                    name="account_sdkKey"
                    type="text"
                    // defaultValue={account_sdkKey}
                  />
                </div>
                <div className="mb-3">
                  <Label className="form-label">Zoom account_sdkSecret</Label>
                  <Input
                    name="account_sdkSecret"
                    type="text"
                    // defaultValue={account_sdkSecret}
                  />
                </div>
                <div className="mb-3">
                  <Label className="form-label">Zoom have_poll</Label>
                  <Toggle checked={checked} onChange={(e) => setChecked(e)} />
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
      <Modal isOpen={showHide} toggle={() => setShowHide(false)}>
        <ModalHeader toggle={() => setShowHide(false)} tag="h4">
          Show / Hide
        </ModalHeader>
        <ModalBody>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              showHideZoomEmail(e);
              return false;
            }}
          >
            <Row>
              <Col md={12}>
                <h3>Are You Sure To Hide/Show This Email ?</h3>
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
      {/* <Modal isOpen={edit} toggle={() => setEdit(false)}>
        <ModalHeader toggle={() => setEdit(false)} tag="h4">
          Edit Zoom Email
        </ModalHeader>
        <ModalBody>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              editZoomEmail(e);
              return false;
            }}
          >
            <Row>
              <Col md={12}>
                <div className="mb-3">
                  <Label className="form-label">Zoom account_name</Label>
                  <Input
                    name="account_name"
                    type="text"
                    value={edit?.account_name}
                    onChange={(e) =>
                      setEdit({ ...edit, account_name: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <Label className="form-label">Zoom account_sdkKey</Label>
                  <Input
                    name="account_sdkKey"
                    type="text"
                    value={edit?.account_sdkKey}
                    onChange={(e) =>
                      setEdit({ ...edit, account_sdkKey: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <Label className="form-label">Zoom account_sdkSecret</Label>
                  <Input
                    name="account_sdkSecret"
                    type="text"
                    value={edit?.account_sdkSecret}
                    onChange={(e) =>
                      setEdit({ ...edit, account_sdkSecret: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <Label className="form-label">Zoom have_poll</Label>
                  <Toggle
                    checked={edit?.have_poll == "yes"}
                    onChange={(e) =>
                      setEdit({ ...edit, have_poll: e ? "yes" : "no" })
                    }
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
      </Modal> */}
    </React.Fragment>
  );
};

export default ZoomEmail;
