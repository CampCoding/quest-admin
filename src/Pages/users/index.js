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
  ModalFooter,
} from "reactstrap";
import "./style.css";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import TableContainer from "../../components/Common/TableContainer";
import { Loader } from "rsuite";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";
import { ContentCopyOutlined, UnarchiveSharp } from "@mui/icons-material";
import SpinnerIcon from "@rsuite/icons/legacy/Spinner";
import {
  numberedObject,
  permissions,
  transformedPermissions,
  userData,
} from "../../store/getProfileData";
import TagPicker from "./tagPicker";

const Users = () => {
  const navigate = useNavigate();
  document.title = "Users | Quest ";
  const [modal, setmodal] = useState(false);
  const [deleteId, setDeleteId] = useState(false);
  const [user_name, set_user_name] = useState("");
  const [matary_users, setMataryUsers] = useState(false);
  const [matary_permisions, setMataryPermissions] = useState(false);
  const [user_role, set_user_role] = useState("");
  const [email, set_email] = useState("");
  const [password, set_password] = useState("");
  const [edit, setEdit] = useState(null);
  const [userId, setUserId] = useState(null);
  const [univs, setUnivs] = useState(false);
  const [selectedUnivs, setSelectedUnivs] = useState(false);
  const [edit_perm, set_edit_perm] = useState(false);
  const [selectedTags, setSelectedTags] = useState(false);
  const columns = [
    {
      Header: "user_id",
      accessor: "user_id",
    },
    {
      Header: "User Name ",
      accessor: "user_name",
    },
    {
      Header: "Email",
      accessor: "email",
    },
    {
      Header: "Password",
      accessor: "pass",
    },
    // {
    //   Header: 'Role',
    //   Cell: (cell) => {
    //     return <span>{cell.cell.row?.original?.user_role}</span>;
    //   },
    // },
    {
      Header: "Disabled",
      Cell: (cell) => {
        return (
          <span>
            {cell.cell.row?.original?.disable == "yes" ? (
              <button
                className="btn btn-success"
                onClick={() => {
                  setUserId(cell.cell.row?.original);
                }}
              >
                Enable
              </button>
            ) : (
              <button
                className="btn btn-danger"
                onClick={() => {
                  setUserId(cell.cell.row?.original);
                }}
              >
                Disable
              </button>
            )}
          </span>
        );
      },
    },
    {
      Header: "Permissions",
      Cell: (cell) => {
        return (
          <button
            className="btn btn-primary"
            onClick={() => setEdit(cell?.cell?.row?.original)}
          >
            Edit
          </button>
        );
      },
    },
  ];
  const handleTagSelect = (selectedTags) => {
    try {
      const combine = Object.keys(selectedTags).map((tag) =>
        selectedTags[tag]
          ?.map((t) => tag?.toString() + "_" + t?.toString())
          .join("**")
      );
      setSelectedTags(combine.join("**"));
    } catch (error) {
      console.log(error);
    }
    // You can perform further actions with the selected tags
  };
  const toggle = useCallback(() => {
    if (modal) {
      setmodal(false);
    } else {
      setmodal(true);
    }
  }, [modal]);
  const handleaddnewuni = () => {
    const data_send = {
      email: email,
      pass: password,
      user_name: user_name,
      permissions: selectedTags,
      university_id: selectedUnivs,
    };

    axios
      .post(
        "https://camp-coding.tech/quest/platform/admin/dashboard_users/add_user.php",
        JSON.stringify(data_send)
      )
      .then((res) => {
        if (res.status == "success") {
          getUsers();
          set_user_name(false);
          set_email(false);
          set_password(false);
          setSelectedTags(false);
          setmodal(false);
          toast.success(res.message);
        } else if (res.status == "error") {
          toast.error(res.message);
        } else {
          toast.error("Something Went Error");
        }
      })
      .catch((err) => console.log(err));
  };

  const handleeditnewuni = () => {
    const data_send = {
      user_id: edit?.user_id,
      email: email ? email : edit?.email,
      pass: password ? password : edit?.pass,
      user_name: user_name ? user_name : edit?.user_name,
      permissions: selectedTags ? selectedTags : edit?.permissions,
      university_id: selectedUnivs ? selectedUnivs : edit?.university_id,
      disable: edit?.disable,
    };

    axios
      .post(
        "https://camp-coding.tech/quest/platform/admin/dashboard_users/edit_user.php",
        JSON.stringify(data_send)
      )
      .then((res) => {
        if (res.status == "success") {
          getUsers();
          set_user_name(false);
          set_email(false);
          set_password(false);
          setSelectedTags(false);
          setEdit(false);
          toast.success(res.message);
        } else if (res.status == "error") {
          toast.error(res.message);
        } else {
          toast.error("Something Went Error");
        }
      })
      .catch((err) => console.log(err));
  };
  const getUsers = async () => {
    try {
      const get = await axios.post(
        "https://camp-coding.tech/quest/platform/admin/dashboard_users/select_users.php",
        { user_id: userData?.user_id }
      );
      console.log(get);
      // if (Array.isArray(get?.message)) setMataryUsers(get.message);
      if (Array.isArray(get?.message))
        setMataryUsers(get?.message?.reverse()); // Test
      else setMataryUsers([]);
    } catch (err) {
      setMataryUsers([]);
    }
  };

  const enableUser = () => {
    const data_send = {
      user_id: userId?.user_id,
      email: email ? email : userId?.email,
      pass: password ? password : userId?.pass,
      user_name: user_name ? user_name : userId?.user_name,
      permissions: selectedTags ? selectedTags : userId?.permissions,
      university_id: selectedUnivs ? selectedUnivs : userId?.university_id,
      disable: userId?.disable == "yes" ? "no" : "yes",
    };

    axios
      .post(
        "https://camp-coding.tech/quest/platform/admin/dashboard_users/edit_user.php",
        JSON.stringify(data_send)
      )
      .then((res) => {
        if (res.status == "success") {
          getUsers();
          set_user_name(false);
          set_email(false);
          set_password(false);
          setSelectedTags(false);
          setEdit(false);
          setUserId(false);
          toast.success(res.message);
        } else if (res.status == "error") {
          toast.error(res.message);
        } else {
          toast.error("Something Went Error");
        }
      })
      .catch((err) => console.log(err));
  };

  const getUnivs = async () => {
    const selct_univs = await axios.get(
      "https://camp-coding.tech/quest/platform/admin/universities/select_universities_grade.php"
    );
    setUnivs(selct_univs.message);
  };

  useEffect(() => {
    getUnivs();
  }, []);
  useEffect(() => {
    getUsers();
  }, []);

  useEffect(() => {
    console.log(numberedObject(edit?.permissions));
  }, [edit]);

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
              Add New User
            </button>
          </div>
          <div id="table-invoices-list">
            {!matary_users ? (
              <Loader />
            ) : matary_users?.length ? (
              <TableContainer
                columns={columns}
                data={matary_users}
                isGlobalFilter={true}
                customPageSize={10}
                className="Invoice table"
              />
            ) : (
              <h4>No Users</h4>
            )}
          </div>
        </Container>

        <ToastContainer />
      </div>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle} tag="h4">
          Add New User
        </ModalHeader>
        <ModalBody>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              handleaddnewuni();
              return false;
            }}
          >
            <Row>
              <Col md={12}>
                <div className="mb-3">
                  <Label className="form-label">Permissions</Label>
                  {/* permissions */}
                  <TagPicker options={permissions} onSelect={handleTagSelect} />
                </div>
                <div className="mb-3">
                  <Label className="form-label">User Name</Label>
                  <Input
                    name="book_title"
                    type="text"
                    value={user_name}
                    onChange={(e) => set_user_name(e.target.value)}
                  />
                </div>
                {/* <div className="mb-3">
                  <Label className="form-label">User Role</Label>
                  <Input
                    name="book_title"
                    type="text"
                    value={user_role}
                    onChange={(e) => set_user_role(e.target.value)}
                  />
                </div> */}
                <div className="mb-3">
                  <Label className="form-label">Email</Label>
                  <Input
                    name="book_title"
                    type="text"
                    value={email}
                    onChange={(e) => set_email(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <Label className="form-label">Password</Label>
                  <Input
                    name="book_title"
                    type="text"
                    value={password}
                    onChange={(e) => set_password(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <Label className="form-label">University</Label>
                  <select
                    name="university"
                    id=""
                    onChange={(e) => setSelectedUnivs(e.target.value)}
                  >
                    <option value={0}>{"All Universities"}</option>;
                    {univs && univs.length
                      ? univs?.map((item) => {
                          return (
                            <option value={item?.university_id}>
                              {item?.university_name}
                            </option>
                          );
                        })
                      : null}
                  </select>
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
      <Modal isOpen={edit_perm} toggle={() => set_edit_perm(false)}>
        <ModalHeader toggle={() => set_edit_perm(false)} tag="h4">
          Edit User Permissions
        </ModalHeader>
        <ModalBody>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              return false;
            }}
          >
            <Row>
              <Col md={12}>
                <div className="mb-3">
                  <Label className="form-label">Permissions</Label>
                  {/* permissions */}
                  <TagPicker
                    options={permissions}
                    onSelect={handleTagSelect}
                    numberedObject={
                      edit_perm == "all"
                        ? transformedPermissions
                        : numberedObject(edit_perm)
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
      </Modal>
      <Modal isOpen={edit} toggle={() => setEdit(false)}>
        <ModalHeader toggle={() => setEdit(false)} tag="h4">
          Edit User
        </ModalHeader>
        <ModalBody>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              handleeditnewuni(e);
              return false;
            }}
          >
            <Row>
              <Col md={12}>
                <Row>
                  <Col md={12}>
                    <div className="mb-3">
                      <Label className="form-label">Permissions</Label>
                      {/* permissions */}
                      <TagPicker
                        options={permissions}
                        onSelect={handleTagSelect}
                        numberedObject={
                          edit?.permissions == "all"
                            ? transformedPermissions
                            : numberedObject(edit?.permissions)
                        }
                      />
                    </div>
                  </Col>
                </Row>
                <div className="mb-3">
                  <Label className="form-label">User Name</Label>
                  <Input
                    name="book_title"
                    type="text"
                    defaultValue={edit?.user_name}
                    onChange={(e) => set_user_name(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <Label className="form-label">Email</Label>
                  <Input
                    name="book_title"
                    type="text"
                    defaultValue={edit?.email}
                    onChange={(e) => set_email(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <Label className="form-label">Password</Label>
                  <Input
                    name="book_title"
                    type="text"
                    onChange={(e) => set_password(e.target.value)}
                    defaultValue={edit?.pass}
                  />
                </div>
                <div className="mb-3">
                  <Label className="form-label">University</Label>
                  <select
                    name="university"
                    id=""
                    defaultValue={edit?.university_id}
                    onChange={(e) => setSelectedUnivs(e.target.value)}
                  >
                    <option value={0}>{"All Universities"}</option>;
                    {univs && univs.length
                      ? univs?.map((item) => {
                          return (
                            <option value={item?.university_id}>
                              {item?.university_name}
                            </option>
                          );
                        })
                      : null}
                  </select>
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
      <Modal isOpen={userId} toggle={() => setUserId(null)}>
        <ModalHeader toggle={() => setUserId(null)} tag="h4">
          Disable / Enable User
        </ModalHeader>
        <ModalBody>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              enableUser(e);
              return false;
            }}
          >
            <Row>
              <Col md={12}>
                <h2>Are You Sure ?</h2>
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

export default Users;
