import axios from "axios";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import { Loader, Toggle } from "rsuite";
import { addition } from "../../../assets/svgIcons";
import { Input } from "../../../components/form-elements";
import TextArea from "../../../components/form-elements/textarea";
import ImagesInput from "../../../components/imageInput/ImageInputMulti";
import Modal from "../../../components/modal";
import TableLayout from "../../../components/table";
import "./mainpost.css";
import { Container } from "reactstrap";
const Mainpost = () => {
  const [grades_ids, setgrades_ids] = useState([]);
  const [unies, setUnies] = useState([]);
  // setUnies
  const [selectedPostId, setSelectedPostId] = useState("");
  const [postContent, setPostContent] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [subType, setSubType] = useState(false);
  const [selectedUni, setSelectedUni] = useState("");
  const [showToGradesModal, setShowToGradesModal] = useState(false);
  const [rowData, setRowData] = useState({});
  const [universities, setUniversities] = useState([]);
  const [searchHeaderKet, setSearchHeaderKey] = useState("");
  const [gradesIds, setGradesIds] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [hiddenId, setHiddenId] = useState(false);
  const [selectedGrade, setselectedgrade] = useState(false);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(false);
  const [deleteId, setDeleteId] = useState(false);
  const [editId, setEditId] = useState(false);
  const [opened, setOpened] = useState(null);
  const [images, setImages] = useState([]);
  const [editGradesLoading, setEditGradesLoading] = useState(false);
  const headers = [
    {
      label: "ID",
      dataIndex: "post_id",
      search: true,
      sort: true,
    },
    // {
    //   label: "Actions",
    //   type: "children",
    //   children: ({ headers, row, index, lastIndex }) => {
    //     return (
    //       <div className="menu_Open_close">
    //         <div
    //           className="open_close"
    //           style={{ cursor: "pointer", color: "black" }}
    //           onClick={() =>
    //             setOpened(opened == row?.post_id ? null : row?.post_id)
    //           }
    //         >
    //           <img
    //             src="https://res.cloudinary.com/duovxefh6/image/upload/v1701489400/menu_hrpzcb.png"
    //             alt=""
    //             style={{ width: "20px", height: "20px" }}
    //           />
    //         </div>
    //         {row?.post_id == opened ? (
    //           <div
    //             className={
    //               index == lastIndex - 1 ||
    //               index == lastIndex - 2 ||
    //               index == lastIndex - 3
    //                 ? "actions-views row-actions-view"
    //                 : "actions-views column-actions-view"
    //             }
    //           >
    //             {/* <button
    //               className="btn btn-danger"
    //               style={{ marginRight: "10px" }}
    //               onClick={() => {
    //                 setDeleteId(row);
    //               }}
    //             >
    //               Delete
    //             </button> */}
    //             <button
    //               className="btn btn-primary"
    //               style={{ marginRight: "10px" }}
    //               onClick={() => {
    //                 setEditId(row);
    //               }}
    //             >
    //               Edit
    //             </button>
    //             {/* setEditId */}
    //           </div>
    //         ) : null}
    //       </div>
    //     );
    //   },
    // },

    {
      label: "post image_url",
      dataIndex: "image_url",
      search: true,
      sort: true,
      type: "children",
      children: ({ row }) => {
        return (
          <img
            src={row?.image_url}
            style={{ width: "80px", height: "80px" }}
            alt=""
          />
        );
      },
    },
    {
      label: "post content",
      dataIndex: "text",
      search: true,
      sort: true,
      type: "children",
      children: ({ row }) => {
        return (
          <div style={{ whiteSpace: "pre-wrap", width: "130px" }}>
            {row?.text?.length > 50
              ? row?.text?.substring(0, 50) + "..."
              : row?.text}
          </div>
        );
      },
    },
    {
      label: "Date",
      dataIndex: "date_created",
      // search: true,
      sort: true,
    },
    {
      label: "Current status",
      type: "children",
      children: ({ row }) => {
        return row.hidden == 1 ? (
          <p className=" " style={{ color: "red" }}>
            Hidden
          </p>
        ) : (
          <p className=" " style={{ color: "green" }}>
            Visible
          </p>
        );
      },
    },

    {
      label: "Change status",
      type: "children",
      children: ({ row }) => {
        if (row.hidden !== "0") {
          return (
            <span
              className="btn btn-success"
              style={{ color: "black" }}
              onClick={() => setHiddenId(row)}
            >
              Show
            </span>
          );
        } else {
          return (
            <span
              className="btn btn-danger"
              style={{ color: "black" }}
              onClick={() => setHiddenId(row)}
            >
              Hide
            </span>
          );
        }
      },
    },
    // {
    //   label: "Post Grades",
    //   dataIndex: "show",
    //   type: "children",
    //   children: ({ row, headers }) => {
    //     return (
    //       <button
    //         onClick={() => {
    //           setRowData(row);
    //           setSelectedPostId(row.post_id);
    //           setSubType(row?.subscriptions);
    //           getUniversities(row.grades_ids?.split("**"));
    //           setShowToGradesModal(row);
    //         }}
    //         className="btn btn-primary"
    //       >
    //         Edit Grades
    //       </button>
    //     );
    //   },
    // },
    // setHiddenId
  ];
  useEffect(() => {
    fetchDataUnis();
  }, []);
  window.addEventListener("click", (e) => {
    if (
      opened &&
      !e.target?.classList?.contains("actions-views") &&
      !e.target?.parentNode?.classList?.contains("open_close")
    ) {
      setOpened(null);
    }
  });

  const fetchDataUnis = async () => {
    try {
      const response = await axios.post(
        "https://camp-coding.tech/quest/platform/admin/" +
          "universities/select_universitiesR.php"
      );
      setUniversities(response?.message);

      // let AllUnis=[...response?.message];
      // for(let u=0;u<AllUnis.length;u++){
      //   console.log(AllUnis[u])
      // }
      setSelectedUni(response?.message[0].university_id);
    } catch (err) {
      setUniversities([]);
      toast.error(err?.message);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://camp-coding.tech/quest/platform/admin/posts/select_posts.php"
      );
      setData(response?.message);
    } catch (err) {
      setData([]);
      toast.error(err?.message);
    }
  };
  const addPost = async (e) => {
    e.preventDefault();
    setLoading(true);
    const form = e.target;

    try {
      const formData = new FormData();

      // Assuming your file input has the attribute 'multiple'
      const images = [];

      // Use Promise.all to wait for all image uploads to complete
      await Promise.all(
        Array.from(form.image.files).map(async (file) => {
          formData.append("image", file);
          const imageUploadResponse = await axios.post(
            "https://camp-coding.tech/quest/platform/admin/" +
              "image_uplouder.php",
            formData
          );
          images.push(imageUploadResponse);
        })
      );
      const imageLinks = images;
      const response = await axios.post(
        "https://camp-coding.tech/quest/platform/admin/" +
          "posts/insert_post.php",
        {
          post_content: e?.target?.post_title?.value,
          images: imageLinks.join("**camp**"),
          // Separate links with '***'
        }
      );

      if (response?.status === "success") {
        toast.success(response?.message);
        fetchData();
        setShowAdd(false);
        form.reset();
      } else {
        toast.error(response?.message);
      }
    } catch (err) {
      toast.error(err?.message);
    } finally {
      setLoading(false);
    }
  };
  const handleDeletePost = () => {
    const data_send = {
      post_id: deleteId?.post_id,
    };
    axios
      .post(
        "https://camp-coding.tech/quest/platform/admin/" +
          "posts/delete_post.php",
        JSON.stringify(data_send)
      )
      .then((res) => {
        if (res?.status == "success") {
          toast.success(res?.message);
          setDeleteId(false);
          fetchData();
        } else if (res?.status == "error") {
          toast.error(res?.message);
        } else {
          toast.error("Something Went Error");
        }
      });
  };
  const handleEditPost = async (e) => {
    e.preventDefault();
    setLoading(true);
    const form = e.target;

    try {
      e.preventDefault();
      setLoading(true);
      const formData = new FormData(form);
      const imageUpload = await axios.post(
        "https://camp-coding.tech/quest/platform/admin/" + "image_uplouder.php",
        formData
      );
      if (imageUpload || !e.target?.image?.files?.length) {
        const data_send = {
          post_id: editId?.post_id,
          post_title: form?.post_title?.value,
          image_url:
            imageUpload && form?.image?.files?.length
              ? imageUpload
              : editId?.post_photo,
        };
        // console.log(data_send)
        const response = await axios.post(
          "https://camp-coding.tech/quest/platform/admin/" +
            "posts/update_post.php",
          {
            university_id: "2",
            post_id: editId?.post_id,
            post_title: form?.post_title?.value,
            image_url:
              imageUpload?.status == "success" && form?.image?.files?.length
                ? imageUpload?.message
                : editId?.post_photo,
          }
        );

        if (response?.status == "success") {
          toast.success(response?.message);
          fetchData();
          setEditId(false);
          form.reset();
          setLoading(false);
        } else {
          setLoading(false);
          toast.error(response?.message);
        }
      }

      // setShowAdd(false);
    } catch (err) {
      toast.error(err?.message);
      setLoading(false);
    }
  };
  const hideUniv = async () => {
    setLoading(true);

    console.log(hiddenId);

    try {
      const response = await axios.post(
        "https://camp-coding.tech/quest/platform/admin/" +
          "posts/show_hide_posts.php",
        {
          post_id: hiddenId?.post_id,
          status: hiddenId?.hidden == "1" ? 0 : 1,
        }
      );
      if (response?.status == "success") {
        toast.success(response?.message);
        fetchData();
        setHiddenId(false);
        setLoading(false);
      } else {
        setLoading(false);
        toast.error(response?.message);
      }

      // setShowAdd(false);
    } catch (err) {
      toast.error(err?.message);
      setLoading(false);
    }
  };
  const getUniversities = async (arr) => {
    await axios
      .get(
        "https://camp-coding.tech/quest/platform/admin/universities/select_universities_grade.php"
      )
      .then((res) => {
        //
        setUniversities(res?.message);
        let allData = res?.message;

        console.log(
          res?.message
            ?.map((item) => item?.grades?.map((item) => item))
            .flatMap((item) => item)
        );
        setGrades(
          res?.message
            ?.map((item) => item?.grades?.map((item) => item))
            ?.flatMap((item) => item)
        );
        setSelectedUni(res?.message[0]?.university_id);
        setselectedgrade(res?.message[0]?.grades[0]?.grade_id);
        let pushedArr = [];
        for (let u = 0; u < allData.length; u++) {
          let uniGrades = [...allData[u].grades];
          for (let g = 0; g < uniGrades.length; g++) {
            let obj = {
              ...uniGrades[g],
            };
            if (
              arr &&
              arr?.length &&
              arr?.filter((item) => item == uniGrades[g].grade_id)?.length
            ) {
              obj["selected"] = true;
            } else {
              obj["selected"] = false;
            }
            uniGrades[g] = obj;
          }
          allData[u].grades = uniGrades;
          // AllUnis[u].grades=
          pushedArr.push(allData[u]);
        }
        setUnies(pushedArr);
      });
  };
  useEffect(() => {
    getUniversities();
  }, []);

  const handleGetGrades = (gradeId) => {
    if (gradesIds?.filter((item) => item == gradeId)?.length) {
      setGradesIds(gradesIds?.filter((item) => item != gradeId));
    } else {
      setGradesIds([...gradesIds, gradeId]);
    }
  };

  const handleChangeChecked = (item, it, index, ind) => {
    let list = [...universities];
    list[index]["grades"][ind].selected = !list[index]["grades"][ind].selected;
    setUniversities(list);
  };
  const handleEditShowGrades = async () => {
    setEditGradesLoading(true);
    let newGradesArr = [];
    let unisList = [...universities];
    for (let g = 0; g < unisList.length; g++) {
      let allUnisGrades = [...unisList[g]?.grades];
      for (let g = 0; g < allUnisGrades.length; g++) {
        if (allUnisGrades[g].selected) {
          newGradesArr.push(allUnisGrades[g].grade_id);
        }
      }
    }
    let newGradesIds = newGradesArr.join("**");
    const response = await axios.post(
      "https://camp-coding.tech/quest/platform/admin/" +
        "posts/update_show.php",
      {
        post_id: showToGradesModal?.post_id,
        grades_ids: newGradesIds,
        subscriptions: subType,
      }
    );
    toast.info(response?.message);
    await fetchData();
  };
  const fetchPostImages = async () => {
    const images = await axios.post(
      "https://camp-coding.tech/quest/platform/admin/" +
        "posts/select_img_by_post_id.php",
      {
        post_id: editId?.post_id,
      }
    );
    setImages(images?.message);
  };
  const updatePostText = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const deletition = await axios.post(
        "https://camp-coding.tech/quest/platform/admin/" +
          "posts/update_post_text.php",
        {
          post_id: editId?.post_id,
          post_content: postContent,
        }
      );
      if (deletition?.status == "success") await fetchData();
      toast.info(deletition?.message);
      setLoading(false);
    } catch (e) {
      toast.error(e.message);
      setLoading(false);
    }
  };
  const deleteImage = async (post_image_id, post_id) => {
    setLoading(true);
    try {
      const deletition = await axios.post(
        "https://camp-coding.tech/quest/platform/admin/" +
          "posts/delete_img.php",
        {
          post_id: post_id,
          post_image_id: post_image_id,
        }
      );
      if (deletition?.status == "success") fetchPostImages();
      toast.info(deletition?.message);
      setLoading(false);
    } catch (e) {
      toast.error(e.message);
      setLoading(false);
    }
  };
  const AddPostImage = async (item, index) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("image", item);
    const imageUploadResponse = await axios.post(
      "https://camp-coding.tech/quest/platform/admin/" + "image_uplouder.php",
      formData
    );
    if (imageUploadResponse)
      try {
        const deletition = await axios.post(
          "https://camp-coding.tech/quest/platform/admin/" +
            "posts/insert_img.php",
          {
            post_id: editId?.post_id,
            image_url: imageUploadResponse,
          }
        );
        if (deletition?.status == "success") {
          fetchPostImages();
          setNewImages(
            newImages?.map((item, n_index) => {
              if (n_index == index) {
                item.added = true;
              }
              return item;
            })
          );
        }
        toast.info(deletition?.message);
        setLoading(false);
      } catch (e) {
        setLoading(false);
        toast.error(e.message);
      }
    else {
      toast?.error("حدث خطأ أثناء رفع الصورة ");
      setLoading(false);
    }
  };
  useEffect(() => {
    if (editId) fetchPostImages();
  }, [editId]);

  return (
    <div className="page-content">
      <Container fluid={true}>
        <div id="home">
          <div className="childs">
            <h4
              className="customBreadCrumbs"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItem: "center",
              }}
            >
              <span>Posts</span>

              <button
                className="btn btn-primary"
                onClick={() => setShowAdd(true)}
              >
                <span>{addition}</span>
                <span>Add Post</span>
              </button>
            </h4>

            <TableLayout
              searchHeaderKet={searchHeaderKet}
              headers={headers}
              data={data}
            />
          </div>

          <Modal
            headerTitle={"Add Post"}
            open={showAdd}
            toggle={setShowAdd}
            children={
              <form
                action="#"
                onSubmit={!loading ? addPost : (e) => e.preventDefault()}
              >
                <div className="">
                  <label htmlFor="post_title">Post Title</label>
                  <TextArea
                    type={"text"}
                    id={"post_title"}
                    name={"post_title"}
                    onChange={() => null}
                  />
                </div>
                <div className="">
                  <label htmlFor="image">Image URL</label>
                  <Input
                    type={"file"}
                    id={"image"}
                    name={"image"}
                    showImage={true}
                    onChange={() => null}
                  />
                </div>
                <button className="btn btn-success">
                  {!loading ? "Save" : <Loader />}
                </button>
              </form>
            }
          />
          <Modal
            open={hiddenId}
            toggle={setHiddenId}
            headerTitle={"Show / Hide Post"}
            children={
              <>
                <h5>
                  Are You Sure To{" "}
                  {hiddenId?.hidden == "0" ? "Hide - " : "Show - "}
                  Post ?
                </h5>
                <div className="flex-box">
                  <button
                    className="btn btn-danger"
                    onClick={() => {
                      return !loading ? hideUniv() : null;
                    }}
                  >
                    {!loading ? "Yes" : <Loader />}
                  </button>

                  <button
                    className="btn btn-primary"
                    width={"fit-content"}
                    onClick={() => {
                      setHiddenId(false);
                    }}
                  >
                    No
                  </button>
                </div>
              </>
            }
          />
          <Modal
            open={deleteId}
            toggle={setDeleteId}
            headerTitle={"Delete Post"}
            children={
              <>
                <h5>
                  {"Are You Sure To Delete Post - " +
                    deleteId?.post_title +
                    " ?"}
                </h5>
                <div className="flex-box">
                  <button
                    className="btn btn-danger"
                    onClick={() => {
                      handleDeletePost();
                    }}
                  >
                    Yes
                  </button>

                  <button
                    className="btn btn-primary"
                    width={"fit-content"}
                    onClick={() => {
                      setDeleteId(false);
                    }}
                  >
                    No
                  </button>
                </div>
              </>
            }
          />

          <Modal
            headerTitle={"Edit Post"}
            open={editId}
            toggle={setEditId}
            children={
              <form
                action="#"
                onSubmit={!loading ? updatePostText : (e) => e.preventDefault()}
              >
                <div className="" style={{ marginBottom: "12px" }}>
                  <label htmlFor="post_name">Post Name</label>
                  <TextArea
                    type={"text"}
                    id={"post_name"}
                    name={"post_title"}
                    defaultValue={editId?.post_content}
                    onChange={(e) => setPostContent(e?.value)}
                  />
                  <button className="btn btn-success">
                    {!loading ? "Save" : <Loader />}
                  </button>
                </div>
                <div className="links_images">
                  {images?.map((item) => {
                    return (
                      <div className="postImage">
                        <img src={item?.image_url} alt="" />
                        <div
                          className="btn btn-danger"
                          onClick={() =>
                            loading
                              ? null
                              : deleteImage(item?.post_image_id, item?.post_id)
                          }
                        >
                          {loading ? <Loader /> : "Delete"}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <h3>Add New Images</h3>
                <div className="links_new_images">
                  <ImagesInput
                    getImages={setNewImages}
                    values={newImages}
                    id={"newPostImages"}
                    name={"newPostImages"}
                    children={({ item, index }) =>
                      !item?.added ? (
                        <div
                          className="btn btn-success"
                          onClick={() => {
                            return !loading ? AddPostImage(item, index) : null;
                          }}
                        >
                          {!loading ? "Add Image" : <Loader />}
                        </div>
                      ) : (
                        "Addedd"
                      )
                    }
                  />
                </div>{" "}
              </form>
            }
          />
          <Modal
            headerTitle={"Change Show To Grades"}
            open={showToGradesModal}
            toggle={setShowToGradesModal}
            children={
              <form
                action="#"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleEditShowGrades();
                }}
              >
                <ul className="all_postuni">
                  {unies.map((item, index) => {
                    return (
                      <>
                        <li>{item?.university_name}</li>
                        <ul className="post_uni">
                          {item?.grades?.map((it, ind) => {
                            return (
                              <li
                                onClick={() => {
                                  handleChangeChecked(item, it, index, ind);
                                }}
                                className={it.selected ? "active" : ""}
                              >
                                {it.grade_name}
                              </li>
                            );
                          })}
                        </ul>
                      </>
                    );
                  })}
                </ul>
                {/* For Subscriptions only: &nbsp;&nbsp;
                <Toggle checked={subType} onChange={(e) => setSubType(e)} /> */}
                <br />
                <button className="btn btn-success">Edit</button>
              </form>
            }
          />
        </div>
      </Container>
    </div>
  );
};

export default Mainpost;
