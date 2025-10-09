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

import { Icon } from "@iconify/react";
import {
  ContentCopyOutlined,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import axios from "axios";
import { useCallback, useEffect } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { Loader } from "rsuite";
import TableContainer from "../../components/Common/TableContainer";
import { userData } from "../../store/getProfileData";
// import CourseListTable from "../CourseTable/courseListTable";

const Notifications = () => {
  const navigate = useNavigate();
  const location = useLocation();
  document.title = "Notifications | Quest ";
  const [modal, setmodal] = useState(false);

  const [ebooks, setEbooks] = useState(false);
  const [book_title, set_book_title] = useState("");

  const columns = [
    {
      Header: "Notification Text",
      accessor: "title",
    },
    {
      Header: "Viewed",
      Cell: (cell) => {
        return (
          <span>
            {cell?.cell?.row?.original?.seen == "1" ? "Viewed" : "Not Viewed"}
          </span>
        );
      },
    },
  ];

  useEffect(() => {
    getEbooks();
  }, []);

  const Send = async (id, value) => {
    const blocked = await axios.post(
      "https://camp-coding.tech/quest/platform/admin/notification/send_single_notification.php",
      { student_id: location?.state?.student?.student_id, title: book_title }
    );
    if (blocked.status == "success") {
      toast.success(blocked.message);
      getEbooks();
      setmodal(false);
    } else {
      toast.error(blocked.message);
    }
  };
  const getEbooks = async () => {
    try {
      const get = await axios.post(
        "https://camp-coding.tech/quest/platform/admin/notification/select_student_notification.php",
        { student_id: location?.state?.student?.student_id }
      );
      if (Array.isArray(get?.message)) setEbooks(get.message);
      else setEbooks([]);
    } catch (err) {
      setEbooks([]);
    }
  };

  const toggle = useCallback(() => {
    if (modal) {
      setmodal(false);
    } else {
      setmodal(true);
    }
  }, [modal]);

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
              Send Notification
            </button>
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
              <h4>No Notifications</h4>
            )}
          </div>
        </Container>

        <ToastContainer />
      </div>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle} tag="h4">
          Send New Notfication
        </ModalHeader>
        <ModalBody>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              Send(e);
              return false;
            }}
          >
            <Row>
              <Col md={12}>
                <div className="mb-3">
                  <Label className="form-label">Text</Label>
                  <textarea
                    style={{ width: "100%" }}
                    onChange={(e) => set_book_title(e.target.value)}
                  ></textarea>
                </div>
              </Col>
            </Row>
            <Row>
              <Col>
                <div className="text-end">
                  <button type="submit" className="btn btn-success save-user">
                    Send
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

export default Notifications;
