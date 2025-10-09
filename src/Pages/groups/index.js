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
import Confirm from "../../components/ConfComp/Confirm";
// import CourseListTable from "../CourseTable/courseListTable";

const Groups = () => {
  const navigate = useNavigate();
  document.title = "E-Book Store | Quest ";
  const [modal, setmodal] = useState(false);
  const [numberOfPages, setNumberOfPages] = useState(false);
  const [group, setBook] = useState(false);
  const [group_url, setBookUrl] = useState(false);
  const [loading, setLoading] = useState(false);
  const [groups, setGroups] = useState(false);
  const [group_title, set_group_title] = useState("");
  const [edit, setEdit] = useState(null);

  const columns = [
    {
      Header: "Group Number",
      accessor: "group_id",
    },
    {
      Header: "Group title",
      accessor: "group_name",
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
                  setrowdata(cell.cell.row.original);
                  setshowconf(true);
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
                  setrowdata(cell.cell.row.original);
                  setshowconf(true);
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
                <DropdownItem
                  onClick={() => {
                    navigate("/GroupsVideos", {
                      state: { group: cell.cell.row.original },
                    });
                  }}
                >
                  Videos
                </DropdownItem>
                <DropdownItem
                  onClick={() => {
                    setEdit(cell.cell.row.original);
                  }}
                >
                  Edit
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </>
        );
      },
    },
  ];
  const [rowdata, setrowdata] = useState({});
  const [showconf, setshowconf] = useState(false);
  const handleupdateshow = (data_send) => {
    axios
      .post(
        "https://camp-coding.tech/quest/platform/admin/videos/videos_groups/update_group_status.php",
        JSON.stringify(data_send)
      )
      .then((res) => {
        if (res.status == "success") {
          getGroups();
          setshowconf(false);
          setrowdata({});
          toast.success(res.message);
        } else if (res.status == "error") {
          toast.error(res.message);
        } else {
          toast.error("Something Went Error");
        }
      })
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    if (edit) {
      setBookUrl(edit?.group_url);
      setNumberOfPages(edit?.pages_count);
      set_group_title(edit?.group_title);
    }
  }, [edit]);
  useEffect(() => {
    getGroups();
  }, []);

  const getGroups = async () => {
    try {
      const get = await axios.get(
        "https://camp-coding.tech/quest/platform/admin/videos/videos_groups/select_all_groups.php"
      );
      if (Array.isArray(get)) setGroups(get);
      else setGroups([]);
    } catch (err) {
      setGroups([]);
    }
  };

  const addBook = async (e) => {
    const data_send = {
      group_title:
        e.currentTarget.group_title.value &&
        e.currentTarget.group_title.value?.length
          ? e.currentTarget.group_title.value
          : group_title,
    };

    const add = await axios.post(
      "https://camp-coding.tech/quest/platform/admin/videos/videos_groups/insert_group.php",
      data_send
    );
    if (add.status == "success") {
      toast.success("Added");
      setBook(false);
      getGroups();
      set_group_title("");
    } else {
      toast.error(add.message);
    }
  };

  const editBook = async (e) => {
    if (group && !group_url && !group_url?.length) {
      return toast.error("Upload Book First");
    }
    const data_send = {
      group_title:
        e.currentTarget.group_title.value &&
        e.currentTarget.group_title.value?.length
          ? e.currentTarget.group_title.value
          : group_title,
      group_id: edit?.group_id,
    };

    // https://camp-coding.tech/quest/platform/admin/groups/insert_groups.php
    const add = await axios.post(
      "https://camp-coding.tech/quest/platform/admin/videos/videos_groups/edit_group_name.php",
      data_send
    );
    if (add.status == "success") {
      toast.success("Updated");
      setBook(false);
      getGroups();
      setEdit({});
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
              Add New Group
            </button>
          </div>
          <div id="table-invoices-list">
            {!groups ? (
              <Loader />
            ) : groups?.length ? (
              <TableContainer
                columns={columns}
                data={groups}
                isGlobalFilter={true}
                customPageSize={10}
                className="Invoice table"
              />
            ) : (
              <h4>No Groups</h4>
            )}
          </div>
        </Container>

        <ToastContainer />
      </div>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle} tag="h4">
          Add New Group
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
                  <Label className="form-label">Group Title</Label>
                  <Input
                    name="group_title"
                    type="text"
                    defaultValue={group_title}
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
      <Modal isOpen={edit?.group_id} toggle={() => setEdit(false)}>
        <ModalHeader toggle={() => setEdit(false)} tag="h4">
          Edit Group
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
                  <Label className="form-label">Group Title</Label>
                  <Input
                    name="group_title"
                    type="text"
                    defaultValue={edit?.group_name}
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
      {showconf ? (
        <Confirm
          id={rowdata?.group_id}
          cancleoper={() => {
            setshowconf(false);
          }}
          confirmoper={() => {
            const send_data = {
              status: rowdata.hidden == "no" ? "yes" : "no",
              group_id: rowdata.group_id,
            };
            handleupdateshow(send_data);
          }}
          status={rowdata.hidden == "no" ? "hide" : "show"}
          comp={"Group"}
        />
      ) : null}
    </React.Fragment>
  );
};

export default Groups;
