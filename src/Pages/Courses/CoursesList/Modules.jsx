import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardBody, Col, Container, Row } from "reactstrap";

import "./style.css";
// Import Flatepicker
import "flatpickr/dist/themes/material_blue.css";

// Breadcrumb
import axios from "axios";
import { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Loader } from "rsuite";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { userData } from "../../../store/getProfileData";
import CourseListTable from "./CourseTable/courseListTable";
import { Drawer, Input, Select } from "antd";

const Modules = () => {
  document.title = "Modules | Quest ";
  const navigate = useNavigate();

  const [Courses, setCourses] = useState(false);
  const [loading, setLoading] = useState(false);
  const [univs, setUnivs] = useState(false);
  const [OpenAddModal, setOpenAddModal] = useState(false);
  const [filteredCourses, setFilteredCourses] = useState();
  const [Image, setImage] = useState(null);
  const getCourses = async () => {
    setLoading(true);
    const courses = await axios.get(
      "https://camp-coding.tech/quest/platform/admin/modules/select_module.php"
    );
    //
    setCourses([...courses?.filter((item) => item?.comming_soon == "no")]);
    setFilteredCourses([
      ...courses?.filter((item) => item?.comming_soon == "no"),
    ]);
    setLoading(false);
  };

  const showHideCourse = async (send_data) => {
    //
    const courses = await axios.post(
      "https://camp-coding.tech/quest/platform/admin/modules/show_hide_module.php",
      JSON.stringify(send_data)
    );
    //
    if (courses.status == "success") {
      toast.success(courses.message);
      getCourses();
      // console.log("getCourses");
    } else if (courses.status == "error") {
      toast.error(courses.message);
    } else {
      toast.error("Something Went Error");
    }
  };

  const getUnivs = async () => {
    const selct_univs = await axios.get(
      "https://camp-coding.tech/quest/platform/admin/universities/select_universities_grade.php"
    );
    setUnivs(selct_univs.message);
  };

  const [selectedUnivs, setSelectedUnivs] = useState(false);

  useEffect(() => {
    getCourses();
    getUnivs();
  }, []);
  const [filterGrades, setFilterGrades] = useState(false);
  const [selectGrades, setSelectGrades] = useState(false);
  const getFilterGrades = () => {
    setFilterGrades(
      univs?.filter((item) => item.university_id == selectedUnivs)[0]?.grades
    );
  };
  useEffect(() => {
    let arr = [];
    if (filteredCourses && filteredCourses.length)
      arr = filteredCourses.filter(
        (item) => item?.university_id == selectedUnivs
      );
    setCourses([...arr]);
    if (selectedUnivs) {
      getFilterGrades();
    } else {
      setFilterGrades(false);
      setCourses(filteredCourses);
    }
  }, [selectedUnivs]);

  useEffect(() => {
    let arr = [];
    if (filteredCourses && filteredCourses.length) {
      if (selectGrades) {
        arr = filteredCourses.filter((item) => item?.grade_id == selectGrades);
        setCourses([...arr]);
      } else {
        arr = filteredCourses.filter(
          (item) => item?.university_id == selectedUnivs
        );
        setCourses([...arr]);
      }
    }
  }, [selectGrades]);
  const permissions = userData?.permissions;

  const [form, setForm] = useState({
    module_name: "",
    module_price: "",
    module_photo_url: "",
    module_content: "",
    category_id: "",
    university_id: "",
    grade_id: "",
    comming_soon: "no",
  });

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const uploadImage = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const url = await axios.post(
      "https://camp-coding.tech/quest/platform/admin/image_uplouder.php",
      formData
    );
    // console.log(url);
    toast.success("Image Uploaded Successfully");
    setForm({
      ...form,
      module_photo_url: url,
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await axios
        .post(
          "https://camp-coding.tech/quest/platform/admin/modules/add_module.php",
          form
        )
        .then((res) => {
          console.log(res);

          if (res.status == "success") {
            toast.success(res.message);
            setOpenAddModal(false);
            toast.success("Module added successfully");
            getCourses();
          } else {
            toast.error(res.message || "Something went wrong ❌");
          }
        });
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const [category, setCategory] = useState(false);

  const getCategories = async () => {
    const getcategories = await axios.get(
      "https://camp-coding.tech/quest/platform/admin/courses/select_category.php"
    );
    // console.log(getcategories)
    setCategory(getcategories);
  };

  useEffect(() => {
    getCategories();
  }, []);

  const categoryOptions = category
    ? category.map((cat) => ({
        value: cat.category_id,
        label: cat.category_label,
      }))
    : [];

  const univsOptions = univs
    ? univs.map((uni) => ({
        value: uni.university_id,
        label: uni.university_name,
      }))
    : [];

  const gradeOptions = form.university_id
    ? univs
        .find((uni) => uni.university_id == form.university_id)
        ?.grades.map((uni) => ({
          value: uni.grade_id,
          label: uni.grade_name,
        }))
    : [];

  console.log(categoryOptions);
  console.log(univs);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs title="Modules" breadcrumbItem="Modules List" />
          <div className="univs">
            {univs && univs.length
              ? univs.map((item, index) => {
                  return (
                    <span
                      className={
                        selectedUnivs &&
                        selectedUnivs.length &&
                        selectedUnivs == item?.university_id
                          ? "active"
                          : ""
                      }
                      onClick={() =>
                        selectedUnivs == item?.university_id
                          ? setSelectedUnivs(false)
                          : setSelectedUnivs(item?.university_id)
                      }
                    >
                      {item?.university_name}
                    </span>
                  );
                })
              : null}
          </div>

          <div className="univs">
            {filterGrades && filterGrades.length
              ? filterGrades.map((item, index) => {
                  return (
                    <span
                      className={
                        selectGrades &&
                        selectGrades.length &&
                        selectGrades == item?.grade_id
                          ? "active"
                          : ""
                      }
                      onClick={() =>
                        selectGrades == item?.grade_id
                          ? setSelectGrades(false)
                          : setSelectGrades(item?.grade_id)
                      }
                    >
                      {item?.grade_name}
                    </span>
                  );
                })
              : null}
          </div>
          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <div className="position-relative">
                    <div className="modal-button mt-2">
                      <Row className="align-items-start">
                        <Col className="col-sm">
                          <div>
                            {permissions?.includes("*1_1") ||
                            permissions?.startsWith("1_1") ||
                            permissions == "all" ? (
                              <button
                                type="button"
                                className="btn btn-success mb-4"
                                data-bs-toggle="modal"
                                data-bs-target="#addCourseModal"
                                onClick={() => {
                                  setOpenAddModal(true);
                                }}
                              >
                                <i className="mdi mdi-plus me-1"></i>
                                Add module
                              </button>
                            ) : null}
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </div>

                  <div id="table-invoices-list">
                    {loading ? (
                      <Loader />
                    ) : (
                      <>
                        <CourseListTable
                          Courses={Courses}
                          showHideCourse={showHideCourse}
                          getCourses={getCourses}
                        />
                      </>
                    )}
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
        <ToastContainer />
      </div>

      <Drawer
        title="Add Course"
        width={500}
        onClose={() => setOpenAddModal(false)}
        open={OpenAddModal}
        bodyStyle={{ paddingBottom: 80 }}
        extra={
          <div>
            <button
              onClick={() => {
                navigate(-1);
              }}
              className="btn btn-primary m-1"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="btn btn-success m-1"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        }
      >
        {/* Upload Image */}
        <form
          onSubmit={(e) => {
            uploadImage(e);
          }}
          action="#"
          style={{
            display: "flex",
            // flexDirection: "column",
            alignItems: "center",
            gap: "10px",
            marginBottom: "20px",
            justifyContent: "space-between",
          }}
        >
          <div>
            <label htmlFor="image">Upload Module Image</label>
            <input
              type="file"
              name="image"
              id="image"
              onChange={(e) => {
                setImage(e.target.files[0]);
              }}
            />
          </div>

          <button className="btn btn-success mt-2">Upload</button>
        </form>
        {Image && (
          <img
            src={URL.createObjectURL(Image)}
            style={{ width: "100px" }}
            alt="preview"
          />
        )}

        {/* Drawer Body */}
        <div className="space-y-3">
          <div>
            <label>Module Name</label>
            <Input
              placeholder="Enter module name"
              value={form.module_name}
              onChange={(e) => handleChange("module_name", e.target.value)}
            />
          </div>

          <div>
            <label>Price</label>
            <Input
              placeholder="Enter price"
              value={form.module_price}
              onChange={(e) => handleChange("module_price", e.target.value)}
            />
          </div>

          {/* <div>
            <label>Photo URL</label>
            <Input
              placeholder="Enter photo URL"
              value={form.module_photo_url}
              onChange={(e) => handleChange("module_photo_url", e.target.value)}
            />
          </div> */}

          <div>
            <label>Content</label>
            <Input.TextArea
              placeholder="Enter content"
              rows={4}
              value={form.module_content}
              onChange={(e) => handleChange("module_content", e.target.value)}
            />
          </div>

          <div>
            <label>Category ID</label>
            <Select
              style={{ width: "100%" }}
              options={categoryOptions}
              placeholder="Enter category ID"
              value={form.category_id}
              onChange={(e) => handleChange("category_id", e)}
            />
          </div>

          <div>
            <label>University ID</label>
            <Select
              style={{ width: "100%" }}
              placeholder="Enter university ID"
              value={form.university_id}
              onChange={(e) => handleChange("university_id", e)}
              options={univsOptions}
            />
          </div>

          <div>
            <label>Grade ID</label>
            <Select
              style={{ width: "100%" }}
              options={gradeOptions}
              placeholder="Enter grade ID"
              value={form.grade_id}
              onChange={(e) => handleChange("grade_id", e)}
            />
          </div>

          <div>
            <label>Coming Soon</label>
            <Select
              value={form.comming_soon}
              style={{ width: "100%" }}
              onChange={(val) => handleChange("comming_soon", val)}
              options={[
                { value: "no", label: "No" },
                { value: "yes", label: "Yes" },
              ]}
            />
          </div>
        </div>
        <button
          className="btn btn-success"
          style={{ marginTop: "10px", width: "100%" }}
          onClick={handleSubmit}
        >
          Add
        </button>
      </Drawer>
    </React.Fragment>
  );
};

export default Modules;
