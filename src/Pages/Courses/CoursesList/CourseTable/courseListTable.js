import React, { Fragment, useEffect, useState } from "react";
import {
  CloseButton,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  ModalBody,
  ModalHeader,
  UncontrolledDropdown,
  Modal,
  ModalFooter,
} from "reactstrap";

import TableContainer from "./../../../../components/Common/TableContainer";
import { CourseData } from "../../../../CommonData/Data/Course";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "./courselist.css";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { BiEdit } from "react-icons/bi";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { userData } from "../../../../store/getProfileData";
import { Button, Drawer, Input } from "antd";
import FontAwesomeIcons from "../../../Icons/FontAwesome";

const CourseListTable = ({ Courses, showHideCourse, getCourses }) => {
  const navigate = useNavigate();
  const [showcourseedit, setshowcourseedit] = useState(false);
  const [OpenEdit, setOpenEdit] = useState(false);
  const [deleteId, setDeleteId] = useState(false);
  const [rowdata, setrowdata] = useState({});
  const [image, setimage] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState(false);
  const [selectedUniv, setSelectedUniv] = useState(false);
  const [assignStudentsData, setAssignStudentsData] = useState({});
  const [modalType, setModalType] = useState("");
  const [coursesModals, setCoursesModals] = useState();
  // coursesModals
  // const navigate=useNavigate();
  const [category, setCategory] = useState(false);
  const permissions = userData?.permissions;

  const getCategories = async () => {
    const getcategories = await axios.get(
      "https://camp-coding.tech/quest/platform/admin/courses/select_category.php"
    );
    // console.log(getcategories);
    setCategory(getcategories);
  };
  const [selectedCategory, setSelectedCategory] = useState(false);

  useEffect(() => {
    getCategories();
  }, []);

  const ChangeStatus = async (status, module_id) => {
    axios
      .post(
        "https://camp-coding.tech/quest/platform/admin/modules/show_hide_module.php",
        status
      )
      .then((res) => {
        if (res.status == "success") {
          toast.success(res.message);
          getCourses();
        } else if (res.status == "error") {
          toast.error(res.message);
        } else {
          toast.error("Something Went Error");
        }
      })
      .catch((err) => toast.error(err));
  };

  const handelDeleteModule = async () => {
    axios
      .post(
        "https://camp-coding.tech/quest/platform/admin/modules/delete_module.php",
        { module_id: rowdata?.module_id }
      )
      .then((res) => {
        if (res.status == "success") {
          toast.success(res.message);
          getCourses();
        } else if (res.status == "error") {
          toast.error(res.message);
        } else {
          toast.error("Something Went Error");
        }
      })
      .catch((err) => toast.error(err));
  };

  const [Image, setImage] = useState(null);

  const uploadImage = async (image) => {
    const formData = new FormData();
    formData.append("image", image);
    const url = await axios.post(
      "https://camp-coding.tech/quest/platform/admin/image_uplouder.php",
      formData
    );
    console.log(url);
    toast.success("Image Uploaded Successfully");
    setrowdata({
      ...rowdata,
      module_photo_url: url,
    });
  };

  const handleupdatecourse = async () => {
    if (Image) {
      await uploadImage(Image);
    }

    await axios
      .post(
        "https://camp-coding.tech/quest/platform/admin/modules/edit_module.php",
        {
          module_name: rowdata.module_name,
          module_price: rowdata.module_price,
          module_content: rowdata.module_content,
          module_photo_url: rowdata.module_photo_url,
          module_id: rowdata.module_id,
        }
      )
      .then((res) => {
        if (res.status == "success") {
          setOpenEdit(false);
          toast.success(res.message);
          setrowdata(false);
          getCourses();
        } else if (res.status == "error") {
          toast.error(res.message);
        } else {
          toast.error("Something Went Error");
        }
      })
      .catch((err) => toast.error(err));
  };
  const [item, setItem] = useState(false);
  const [copyCourse, setCopyCourse] = useState(false);
  useEffect(() => {
    setSelectedGrade(rowdata.grade_id);
    setSelectedUniv(rowdata.university_id);
    setSelectedCategory(rowdata.category_id);
  }, [rowdata]);
  const columns = [
    {
      accessor: "course_name",
      Cell: (cell) => {
        return (
          <>
            <div>
              <div
                onClick={() => {
                  navigate(
                    `/Modules-list/${cell.cell.row.original?.module_id}/ModuleCourses`
                  );
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  cursor: "pointer",
                  justifyContent: "center",
                }}
              >
                <span id="id" style={{ display: "none" }}>
                  {JSON.stringify(cell.cell.row.original)}
                </span>
                {cell.cell.row.original.module_photo_url ? (
                  <img
                    style={{ height: "150px" }}
                    src={cell.cell.row.original.module_photo_url}
                    alt=""
                  />
                ) : (
                  <img
                    style={{ height: "150px" }}
                    src={require("../../../../assets/images/noimage.png")}
                    alt=""
                  />
                )}
              </div>
              <div
                onClick={() => {
                  navigate(
                    `/Modules-list/${cell.cell.row.original?.module_id}/ModuleCourses`
                  );
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderBottom: "1px solid #ccc",
                  flexDirection: "column",
                  cursor: "pointer",
                  padding: "10px 0px",
                  gap: "4px",
                }}
                className="course_name"
              >
                <span
                  style={{
                    fontSize: "20px",
                    fontWeight: "700",
                  }}
                >
                  {cell.cell.row.original.module_name || "No Name"}
                </span>
                <span
                  style={{
                    fontSize: "16px",
                    fontWeight: "500",
                    display: "block",
                  }}
                >
                  {cell.cell.row.original?.university_name || "No University"}/
                  {cell.cell.row.original?.grade_name || "No Grade"}
                </span>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-around",
                margin: "20px 0",
              }}
            >
              <button
                onClick={() => {
                  navigate("/units", {
                    state: {
                      coursedata: cell.cell.row.original,
                      course_id: cell.cell.row.original?.course_id,
                    },
                  });
                }}
                className="btn btn-primary"
              >
                View
              </button>

              {cell.cell.row.original.hidden == "no" ? (
                <AiFillEyeInvisible
                  style={{ cursor: "pointer" }}
                  size={25}
                  color="red"
                  title="Hide Course"
                  onClick={() => {
                    const item = cell.cell.row.original;
                    //
                    const send_data = {
                      status: "yes",
                      module_id: item.module_id,
                    };
                    ChangeStatus(send_data);
                  }}
                />
              ) : (
                <AiFillEye
                  style={{ cursor: "pointer" }}
                  size={25}
                  color="green"
                  title="Show Course"
                  onClick={() => {
                    const item = cell.cell.row.original;
                    //
                    const send_data = {
                      status: "no",
                      module_id: item.module_id,
                    };
                    ChangeStatus(send_data);
                  }}
                />
              )}

              <UncontrolledDropdown className="DropVidUn">
                <DropdownToggle
                  className="btn btn-light btn-sm"
                  tag="button"
                  data-bs-toggle="dropdown"
                  direction="start"
                >
                  <i className="bx bx-dots-horizontal-rounded"></i>
                </DropdownToggle>
                <DropdownMenu className="dropdown-menu-end">
                  <DropdownItem>
                    <span
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                      }}
                    >
                      <button
                        onClick={() => {
                          setOpenEdit(true);
                          setrowdata(cell.cell.row.original);
                        }}
                        className="btn btn-primary"
                        style={{ width: "100%" }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          setDeleteId(true);
                          setrowdata(cell.cell.row.original);
                        }}
                        className="btn btn-danger"
                        style={{ width: "100%" }}
                      >
                        Delete
                      </button>
                    </span>
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>

              {/* <UncontrolledDropdown className="DropVidUn">
                <DropdownToggle
                  className="btn btn-light btn-sm"
                  tag="button"
                  data-bs-toggle="dropdown"
                  direction="start"
                >
                  <i className="bx bx-dots-horizontal-rounded"></i>
                </DropdownToggle>
                <DropdownMenu className="dropdown-menu-end">
                  <DropdownItem>
                    <span
                      onClick={() => {
                        navigate("/exam", {
                          state: { course_data: cell.cell.row.original },
                        });
                        // setshowcourseedit(true);
                        // setrowdata(cell.cell.row.original);
                        //
                      }}
                    >
                      <button
                        className="btn btn-primary"
                        style={{ width: "100%" }}
                      >
                        Exams
                      </button>
                    </span>
                  </DropdownItem>
                  {permissions?.includes("*1_10") ||
                  permissions?.startsWith("1_10") ||
                  permissions == "all" ? (
                    <DropdownItem>
                      <button
                        onClick={() => {
                          setModalType({
                            type: "assignStudents",
                            data: cell.cell.row.original,
                          });
                        }}
                        className="btn btn-primary"
                      >
                        Assign Students
                      </button>
                    </DropdownItem>
                  ) : null}
                  <DropdownItem>
                    <button
                      class="btn btn-primary"
                      onClick={() => {
                        navigate("/coursewrquestask", {
                          state: {
                            course_data: cell.cell.row.original,
                          },
                        });
                      }}
                    >
                      Write Questions Task
                    </button>
                  </DropdownItem>
                  <DropdownItem>
                    <button
                      class="btn btn-success"
                      onClick={() => {
                        navigate("/coursecasesquestask", {
                          state: {
                            course_data: cell.cell.row.original,
                          },
                        });
                      }}
                    >
                      Case Questions Task
                    </button>
                  </DropdownItem>
                  {permissions?.includes("*1_2") ||
                  permissions?.startsWith("1_2") ||
                  permissions == "all" ? (
                    <DropdownItem>
                      <span
                        onClick={() => {
                          setshowcourseedit(true);
                          setrowdata(cell.cell.row.original);
                        }}
                      >
                        <button
                          className="btn btn-primary"
                          style={{ width: "100%" }}
                        >
                          Edit
                        </button>
                      </span>
                    </DropdownItem>
                  ) : null} */}
              {/* <DropdownItem>
                    <span
                      style={{
                        width: '25px',
                        cursor: 'pointer',
                      }}
                      onClick={() => {
                        const item = cell.cell.row.original;
                        
                        const send_data = {
                          status: "yes",
                          course_id: item.course_id,
                        };
                        showHideCourse(send_data);
                      }}
                    >
                      <button
                        onClick={() => {
                          navigate('/studentsquestions', {
                            state: { course_data: cell.cell.row.original },
                          });
                        }}
                        className="btn btn-warning"
                      >
                        Students Questions
                      </button>
                    </span>
                  </DropdownItem>
                  {permissions?.includes("*1_4") ||
                  permissions?.startsWith("1_4") ||
                  permissions == "all" ? (
                    <DropdownItem>
                      {cell.cell.row.original.hidden == "no" ? (
                        <span
                          style={{
                            width: "25px",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            const item = cell.cell.row.original;
                            //
                            const send_data = {
                              status: "yes",
                              course_id: item.course_id,
                            };
                            showHideCourse(send_data);
                          }}
                        >
                          <button
                            className="btn btn-danger"
                            style={{ width: "100%" }}
                          >
                            Hide
                          </button>
                        </span>
                      ) : (
                        <span
                          style={{
                            width: "25px",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            const item = cell.cell.row.original;
                            //
                            const send_data = {
                              status: "no",
                              course_id: item.course_id,
                            };
                            showHideCourse(send_data);
                          }}
                        >
                          <button
                            className="btn btn-success"
                            style={{ width: "100%" }}
                          >
                            Show
                          </button>
                        </span>
                      )}
                    </DropdownItem>
                  ) : null}
                  <DropdownItem>
                    <span
                      onClick={() => {
                        setshowcourseedit(true);
                        setrowdata(cell.cell.row.original);
                      }}
                    >
                      {/* <button className='btn btn-success' style={{ width: "100%" }}>Copy</button> */}
              {/* </span> */}
              {/* </DropdownItem> */}
              {/* </DropdownMenu> */}
              {/* </UncontrolledDropdown>  */}
            </div>
          </>
        );
      },
    },
  ];
  const [universities, setuniversities] = useState([]);
  const [grades, setgrades] = useState([]);

  const getuniversities = () => {
    axios
      .get(
        "https://camp-coding.tech/quest/platform/admin/universities/select_universities_grade.php"
      )
      .then((res) => {
        setuniversities(res.message);
        if (modalType?.type == "assignStudents") {
          setAssignStudentsData({ ...assignStudentsData, univ: res.message });
        }
      })
      .catch((err) => console.log(err));
  };

  const getgrades = () => {
    if (selectedUniv)
      setgrades(
        universities.filter((item) => item.university_id == selectedUniv)[0]
          ?.grades
      );
    if (assignStudentsData?.selectedUniv)
      setAssignStudentsData({
        ...assignStudentsData,
        grades: universities.filter(
          (item) => item.university_id == assignStudentsData?.selectedUniv
        )[0]?.grades,
      });
  };

  useEffect(() => {
    if (assignStudentsData?.selectedUniv) getgrades();
  }, [assignStudentsData]);

  useEffect(() => {
    getuniversities();
  }, [modalType]);

  useEffect(() => {
    getgrades();
    // console.log("res", selectedUniv);
  }, [selectedUniv]);

  useEffect(() => {
    if (grades && grades.length && !assignStudentsData?.selectedUniv) {
      setSelectedGrade(grades[0]?.grade_id);
    }
  }, [grades]);

  useEffect(() => {
    if (assignStudentsData?.selectedGrade) {
      setCoursesModals(
        Courses.filter(
          (item) => item?.grade_id == assignStudentsData?.selectedGrade
        )
      );
    }
  }, [assignStudentsData]);

  const duplicateCourse = (e) => {
    const data_send = {
      course_id: rowdata.course_id,
      grade_id: selectedGrade,
      university_id: selectedUniv,
    };

    axios
      .post(
        "https://camp-coding.tech/quest/platform/admin/courses/make_copy_from_course.php",
        JSON.stringify(data_send)
      )
      .then((res) => {
        if (res.status == "success") {
          setshowcourseedit(false);
          toast.success(res.message);
          setrowdata(false);
          getCourses();
          setSelectedGrade(false);
          setSelectedUniv(false);
        } else if (res.status == "error") {
          toast.error(res.message);
        } else {
          toast.error("Something Went Error");
        }
      })
      .catch((err) => console.log(err));
  };

  const AssignCourseStudents = (e) => {
    const data_send = {
      old_course_id: modalType?.data?.course_id,
      new_course_id: assignStudentsData?.selectedCourse,
    };

    axios
      .post(
        "https://camp-coding.tech/quest/platform/admin/courses/assign_course_to_students.php",
        JSON.stringify(data_send)
      )
      .then((res) => {
        if (res.status == "success") {
          setCoursesModals(false);
          toast.success(res.message);
          setAssignStudentsData({});
          getCourses();
          setModalType(false);
        } else if (res.status == "error") {
          toast.error(res.message);
        } else {
          toast.error("Something Went Error");
        }
      })
      .catch((err) => console.log(err));
  };

  const changeValue = (value) => {
    console.log(value);
  };

  return (
    <React.Fragment>
      {Courses ? (
        <TableContainer
          changeValue={changeValue}
          columns={columns}
          data={Courses}
          isGlobalFilter={true}
          customPageSize={10}
          className="Invoice table course_table"
        />
      ) : (
        <Fragment />
      )}
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
            <h4>Update Course Data</h4>
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
            style={{
              padding: "15px",
              display: "flex",
              flexDirection: "column",
            }}
            onSubmit={(e) => {
              e.preventDefault();
              // AssignVideo(e)
              handleupdatecourse();
            }}
          >
            <div className="input_Field">
              <label htmlFor="">Title</label>
              <Input
                style={{
                  width: "100%",
                  borderRadius: "4px",
                  margin: "10px 0",
                }}
                onChange={(e) => {
                  setrowdata({ ...rowdata, course_name: e.target.value });
                }}
                value={rowdata.course_name}
                type="text"
                name="new_title"
                id="new_title"
                placeholder="Enter Course Title"
              />
            </div>

            <div className="input_Field">
              <label htmlFor="">Course Price</label>
              <Input
                style={{
                  width: "100%",
                  borderRadius: "4px",
                  margin: "10px 0",
                }}
                onChange={(e) => {
                  setrowdata({ ...rowdata, course_price: e.target.value });
                }}
                value={rowdata.course_price}
                type="text"
                name="new_title"
                id="new_title"
                placeholder="Enter Course Price"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="category_id" className="form-label">
                Category
              </label>
              {category && category.length ? (
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                  }}
                  className="form-control"
                  data-trigger
                  name="choices-single-category"
                  id="choices-single-category"
                >
                  {category.map((item, index) => {
                    return (
                      <option value={item.category_id}>
                        {item.category_label}
                      </option>
                    );
                  })}
                </select>
              ) : null}
            </div>
            <div className="input_Field">
              <label htmlFor="">Course Image</label>
              <Input
                style={{
                  width: "100%",
                  borderRadius: "4px",
                  margin: "10px 0",
                }}
                onChange={(e) => {
                  setimage(e.target.files[0]);
                  // setrowdata({...rowdata,course_photo_url:e.target.files[0]})
                }}
                type="file"
                name="new_title"
                id="new_title"
                placeholder="Enter new_title"
              />
            </div>

            <div className="input_Field">
              <label htmlFor="">University</label>
              <select
                onChange={(e) => {
                  setrowdata({ ...rowdata, university_id: e.target.value });
                }}
                className="form-control"
                data-trigger
                name="choices-single-category"
                id=""
              >
                {universities.map((item, index) => {
                  return (
                    <option value={item.university_id}>
                      {item.university_name}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="input_Field">
              <label htmlFor="">Grade</label>
              <select
                onChange={(e) => {
                  setrowdata({ ...rowdata, grade_id: e.target.value });
                }}
                className="form-control"
                data-trigger
                name="choices-single-category"
                id=""
              >
                {grades && grades.length
                  ? grades.map((item, index) => {
                      return (
                        <option value={item.grade_id}>{item.grade_name}</option>
                      );
                    })
                  : null}
              </select>
            </div>

            <div className="input_Field">
              <label htmlFor="">Course Content</label>
              <textarea
                style={{
                  width: "100%",
                  borderRadius: "4px",
                  margin: "10px 0",
                }}
                onChange={(e) => {
                  setrowdata({ ...rowdata, course_content: e.target.value });
                }}
                value={rowdata.course_content}
                type="text"
                name="new_title"
                id="new_title"
                placeholder="Enter Course Content"
              />
            </div>

            <button
              className="btn btn-success"
              style={{ margin: "10px 0 0 auto" }}
            >
              {" "}
              Update{" "}
            </button>
          </form>
        </ModalBody>
      </Modal>

      <Modal isOpen={copyCourse}>
        <ModalHeader tag="h4">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              alignItems: "center",
            }}
          >
            <h4>Duplicate</h4>
            <CloseButton
              onClick={() => {
                setCopyCourse(false);
              }}
              style={{ marginLeft: "auto" }}
            />
          </div>
        </ModalHeader>
        <ModalBody>
          <form
            style={{
              padding: "15px",
              display: "flex",
              flexDirection: "column",
            }}
            onSubmit={(e) => {
              e.preventDefault();
              // AssignVideo(e)
              duplicateCourse(e);
            }}
          >
            <div className="input_Field">
              <label htmlFor="">University</label>
              <select
                onChange={(e) => {
                  // setrowdata({ ...rowdata, university_id: e.target.value })
                  setSelectedUniv(e.target.value);
                }}
                className="form-control"
                data-trigger
                name="choices-single-category"
                id=""
              >
                {universities.map((item, index) => {
                  return (
                    <option value={item.university_id}>
                      {item.university_name}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="input_Field">
              <label htmlFor="">Grade</label>
              <select
                onChange={(e) => {
                  // setrowdata({ ...rowdata, grade_id: e.target.value })
                  setSelectedGrade(e.target.value);
                }}
                className="form-control"
                data-trigger
                name="choices-single-category"
                id=""
              >
                {grades && grades.length
                  ? grades.map((item, index) => {
                      return (
                        <option value={item.grade_id}>{item.grade_name}</option>
                      );
                    })
                  : null}
              </select>
            </div>

            <button
              className="btn btn-success"
              style={{ margin: "10px 0 0 auto" }}
            >
              {" "}
              Duplicate{" "}
            </button>
          </form>
        </ModalBody>
      </Modal>
      <Modal
        title="Assign Students"
        isOpen={modalType?.type == "assignStudents"}
      >
        <form
          action="#"
          style={{
            padding: "15px",
            display: "flex",
            flexDirection: "column",
            gap: "13px",
          }}
          onSubmit={(e) => {
            e.preventDefault();
            AssignCourseStudents(e);
          }}
        >
          <CloseButton
            onClick={() => {
              setModalType("");
              setAssignStudentsData({});
            }}
            style={{ marginLeft: "auto" }}
          />
          <div className="input_Field">
            <label htmlFor="">University</label>
            <select
              onChange={(e) => {
                setAssignStudentsData({
                  ...assignStudentsData,
                  selectedUniv: e.target.value,
                });
              }}
              className="form-control"
              data-trigger
              name="choices-single-category"
              id=""
            >
              <option value={""}>{""}</option>
              {assignStudentsData?.univ?.map((item, index) => {
                return (
                  <option value={item.university_id}>
                    {item.university_name}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="input_Field">
            <label htmlFor="">Grade</label>
            <select
              onChange={(e) => {
                // setrowdata({ ...rowdata, grade_id: e.target.value })
                setAssignStudentsData({
                  ...assignStudentsData,
                  selectedGrade: e.target.value,
                });
              }}
              className="form-control"
              data-trigger
              name="choices-single-category"
              id=""
            >
              <option value={""}>{""}</option>
              {assignStudentsData?.grades && assignStudentsData?.grades?.length
                ? assignStudentsData?.grades?.map((item, index) => {
                    return (
                      <option value={item.grade_id}>{item.grade_name}</option>
                    );
                  })
                : null}
            </select>
          </div>
          <div className="input_Field">
            <label htmlFor="">Course</label>
            {/* {alert(JSON.stringify(coursesModals))} */}
            <select
              onChange={(e) => {
                // setrowdata({ ...rowdata, grade_id: e.target.value })
                setAssignStudentsData({
                  ...assignStudentsData,
                  selectedCourse: e.target.value,
                });
              }}
              className="form-control"
              data-trigger
              name="choices-single-category"
              id=""
            >
              <option value={""}>{""}</option>
              {coursesModals && coursesModals?.length
                ? coursesModals?.map((item, index) => {
                    return (
                      <option value={item.course_id}>{item.course_name}</option>
                    );
                  })
                : null}
            </select>
          </div>
          <button
            onClick={() => {}}
            className="btn btn-success"
            style={{ margin: "10px 0 0 auto" }}
          >
            {" "}
            Assign Students{" "}
          </button>
        </form>
      </Modal>
      <Drawer
        title="Update Course Data"
        width={500}
        onClose={() => setOpenEdit(false)}
        open={OpenEdit}
        bodyStyle={{ paddingBottom: 80 }}
        extra={
          <Button type="primary" onClick={handleupdatecourse}>
            Update
          </Button>
        }
      >
        <form
          style={{ display: "flex", flexDirection: "column", gap: "15px" }}
          onSubmit={(e) => {
            e.preventDefault();
            handleupdatecourse();
          }}
        >
          {/* Title */}
          <div className="input_Field">
            <label>Title</label>
            <Input
              value={rowdata.module_name}
              onChange={(e) =>
                setrowdata({ ...rowdata, module_name: e.target.value })
              }
              placeholder="Enter module Title"
            />
          </div>

          {/* Price */}
          <div className="input_Field">
            <label>module Price</label>
            <Input
              value={rowdata.module_price}
              onChange={(e) =>
                setrowdata({ ...rowdata, module_price: e.target.value })
              }
              placeholder="Enter module Price"
            />
          </div>

          {/* Image Upload */}
          <div className="input_Field">
            <label>module Image</label>
            <Input type="file" onChange={(e) => setImage(e.target.files[0])} />
          </div>

          {/* Content */}
          <div className="input_Field">
            <label>module Content</label>
            <Input.TextArea
              rows={4}
              value={rowdata.module_content}
              onChange={(e) =>
                setrowdata({ ...rowdata, module_content: e.target.value })
              }
              placeholder="Enter module Content"
            />
          </div>
          <Button type="primary" htmlType="submit">
            Update
          </Button>
        </form>
      </Drawer>

      <Modal isOpen={!!deleteId} toggle={() => setDeleteId(false)} centered>
        <ModalHeader toggle={() => setDeleteId(false)}>Delete Post</ModalHeader>
        <ModalBody>
          <h5>Are You Sure To Delete Module - {rowdata?.module_name} ?</h5>
        </ModalBody>
        <ModalFooter>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <button
              className="btn btn-danger "
              style={{ margin: "0 #important" }}
              onClick={handelDeleteModule}
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

export default CourseListTable;
