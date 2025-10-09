import axios from "axios";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import { Loader, Row, Toggle } from "rsuite";
import { addition } from "../../../assets/svgIcons";
import { Input } from "../../../components/form-elements";
import TextArea from "../../../components/form-elements/textarea";
import ImagesInput from "../../../components/imageInput/ImageInputMulti";
import Modal from "../../../components/modal";
import TableLayout from "../../../components/table";
import "./mainboadCast.css";
import { Container } from "reactstrap";
import ReactSelect from "react-select";
const BoadCasts = () => {
  const [grades_ids, setgrades_ids] = useState([]);
  const [unies, setUnies] = useState([]);
  // setUnies
  const [selectedBoadCastId, setSelectedBoadCastId] = useState("");
  const [boadCastContent, setBoadCastContent] = useState([]);
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
  const [voiceId, setVoiceId] = useState(null);
  const [editId, setEditId] = useState(false);
  const [opened, setOpened] = useState(null);
  const [images, setImages] = useState([]);
  const [editGradesLoading, setEditGradesLoading] = useState(false);
  const headers = [
    {
      label: "ID",
      dataIndex: "podcast_id",
      search: true,
      sort: true,
    },
    {
      label: "Actions",
      type: "children",
      children: ({ headers, row, index, lastIndex }) => {
        return (
          <div className="menu_Open_close">
            <div
              className="open_close"
              style={{ cursor: "pointer", color: "black" }}
              onClick={() =>
                setOpened(opened == row?.podcast_id ? null : row?.podcast_id)
              }
            >
              <img
                src="https://res.cloudinary.com/duovxefh6/image/upload/v1701489400/menu_hrpzcb.png"
                alt=""
                style={{ width: "20px", height: "20px" }}
              />
            </div>
            {row?.podcast_id == opened ? (
              <div
                className={
                  index == lastIndex - 1 ||
                  index == lastIndex - 2 ||
                  index == lastIndex - 3
                    ? "actions-views row-actions-view"
                    : "actions-views column-actions-view"
                }
              >
                {/* <button
                  className="btn btn-danger"
                  style={{ marginRight: "10px" }}
                  onClick={() => {
                    setDeleteId(row);
                  }}
                >
                  Delete
                </button> */}
                <button
                  className="btn btn-primary"
                  style={{ marginRight: "10px" }}
                  onClick={() => {
                    setEditId(row);
                  }}
                >
                  Edit
                </button>
                {/* setEditId */}
              </div>
            ) : null}
          </div>
        );
      },
    },

    {
      label: "title",
      dataIndex: "title",
      search: true,
      sort: true,
      type: "children",
      children: ({ row }) => {
        return (
          <div style={{ whiteSpace: "pre-wrap", width: "130px" }}>
            {row?.title?.length > 50
              ? row?.title?.substring(0, 50) + "..."
              : row?.title}
          </div>
        );
      },
    },
    {
      label: "End Date",
      dataIndex: "end_date",
      // search: true,
      sort: true,
    },
    {
      Header: "Voice",
      Cell: (cell) => {
        return (
          <>
            <audio
              style={{ width: "100px", height: "40px" }}
              className="audio"
              src={cell?.cell?.row?.original?.voice_link}
              controls
            ></audio>
          </>
        );
      },
    },
    // {
    //   label: "Current status",
    //   type: "children",
    //   children: ({ row }) => {
    //     if (row?.hidden == "false") {
    //       return <span className="text-success textCurrent">Show</span>;
    //     } else {
    //       return <span className="text-danger textCurrent">Hide</span>;
    //     }
    //   },
    // },
    {
      label: "Change status",
      type: "children",
      children: ({ row }) => {
        if (row.hidden !== "no") {
          return (
            <span
              className="btn btn-success"
              style={{ color: "black" }}
              onClick={() =>
                setHiddenId({
                  boadCast_id: row?.podcast_id,
                  status: "yes",
                })
              }
            >
              Show
            </span>
          );
        } else {
          return (
            <span
              className="btn btn-danger"
              style={{ color: "black" }}
              onClick={() =>
                setHiddenId({
                  boadCast_id: row?.podcast_id,
                  boadCast_name: row?.title,
                  status: "no",
                })
              }
            >
              Hide
            </span>
          );
        }
      },
    },
    {
      label: "BoadCast Grades",
      dataIndex: "show",
      type: "children",
      children: ({ row, headers }) => {
        return (
          <button
            onClick={() => {
              setRowData(row);
              setSelectedBoadCastId(row.podcast_id);
              setSubType(row?.subscriptions);
              getUniversities(row.grade_ids?.split("**"));
              setShowToGradesModal(row);
            }}
            className="btn btn-primary"
          >
            Edit Grades
          </button>
        );
      },
    },
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
        "https://camp-coding.tech/quest/platform/admin/podcast/select_podcast.php"
      );
      setData(response?.message);
    } catch (err) {
      setData([]);
      toast.error(err?.message);
    }
  };
  const addBoadCast = async (e) => {
    e.preventDefault();
    setLoading(true);
    const form = e.target;

    try {
      const formData = new FormData();

      const response = await axios.post(
        "https://camp-coding.tech/quest/platform/admin/podcast/insert_podcast.php",
        {
          title: e?.target?.boadCast_title?.value,
          voice_id: voiceId,
          end_date: e?.target?.end_date?.value,
          // Separate links with '***'
        }
      );

      if (response?.status === "success") {
        toast.success(response?.message);
        fetchData();
        setVoiceId(null);
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
  const handleDeleteBoadCast = () => {
    const data_send = {
      boadCast_id: deleteId?.boadCast_id,
    };
    axios
      .boadCast(
        "https://camp-coding.tech/quest/platform/admin/" +
          "boadCasts/delete_boadCast.php",
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
  const handleEditBoadCast = async (e) => {
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
          boadCast_id: editId?.boadCast_id,
          boadCast_title: form?.boadCast_title?.value,
          image_url:
            imageUpload && form?.image?.files?.length
              ? imageUpload
              : editId?.boadCast_photo,
        };
        // console.log(data_send)
        const response = await axios.post(
          "https://camp-coding.tech/quest/platform/admin/podcast/edit_podcast_data.php",
          {
            podcast_id: editId?.podcast_id,
            title: form?.boadCast_title?.value,
            voice_id: "2",
            end_date: form?.end_date?.value, // send same formate
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
        "https://camp-coding.tech/quest/platform/admin/podcast/show_hide_podcast.php",
        {
          podcast_id: hiddenId?.boadCast_id,
          status: hiddenId?.status == "no" ? "yes" : "no",
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
      "https://camp-coding.tech/quest/platform/admin/podcast/update_show.php",
      {
        podcast_id: showToGradesModal?.podcast_id,
        grade_ids: newGradesIds,
        subscriptions: subType,
      }
    );
    toast.info(response?.message);
    await fetchData();
  };
  const fetchBoadCastImages = async () => {
    const images = await axios.post(
      "https://camp-coding.tech/quest/platform/admin/" +
        "boadCasts/select_img_by_boadCast_id.php",
      {
        boadCast_id: editId?.boadCast_id,
      }
    );
    setImages(images?.message);
  };
  const updateBoadCastText = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const deletition = await axios.post(
        "https://camp-coding.tech/quest/platform/admin/podcast/edit_podcast_data.php",
        {
          podcast_id: editId?.podcast_id,
          title: e?.target?.boadCast_title?.value
            ? e?.target?.boadCast_title?.value
            : editId?.title,
          voice_id: voiceId ? voiceId : editId?.voice_id,
          end_date: e?.target?.end_date?.value
            ? e?.target?.end_date?.value
            : editId?.end_date, // send same formate
        }
      );
      if (deletition?.status == "success") await fetchData();
      toast.info(deletition?.message);
      setVoiceId(null);
      setLoading(false);
    } catch (e) {
      toast.error(e.message);
      setLoading(false);
    }
  };
  const deleteImage = async (boadCast_image_id, boadCast_id) => {
    setLoading(true);
    try {
      const deletition = await axios.post(
        "https://camp-coding.tech/quest/platform/admin/" +
          "boadCasts/delete_img.php",
        {
          boadCast_id: boadCast_id,
          boadCast_image_id: boadCast_image_id,
        }
      );
      if (deletition?.status == "success") fetchBoadCastImages();
      toast.info(deletition?.message);
      setLoading(false);
    } catch (e) {
      toast.error(e.message);
      setLoading(false);
    }
  };
  const AddBoadCastImage = async (item, index) => {
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
            "boadCasts/insert_img.php",
          {
            boadCast_id: editId?.boadCast_id,
            image_url: imageUploadResponse,
          }
        );
        if (deletition?.status == "success") {
          fetchBoadCastImages();
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
    if (editId) fetchBoadCastImages();
  }, [editId]);
  const [allVoices, setAllVoices] = useState([]);
  const getAllVoices = async () => {
    try {
      const get = await axios.get(
        "https://camp-coding.tech/quest/platform/admin/voices/select_voices.php"
      );
      if (Array.isArray(get?.message)) setAllVoices(get.message);
      else setAllVoices([]);
    } catch (err) {
      setAllVoices([]);
    }
  };
  useEffect(() => {
    getAllVoices();
  }, []);
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
              <span>BoadCasts</span>

              <button
                className="btn btn-primary"
                onClick={() => setShowAdd(true)}
              >
                <span>{addition}</span>
                <span>Add BoadCast</span>
              </button>
            </h4>

            <TableLayout
              searchHeaderKet={searchHeaderKet}
              headers={headers}
              data={data}
            />
          </div>

          <Modal
            headerTitle={"Add BoadCast"}
            open={showAdd}
            toggle={setShowAdd}
            children={
              <form
                action="#"
                onSubmit={!loading ? addBoadCast : (e) => e.preventDefault()}
              >
                <div className="">
                  <label htmlFor="boadCast_title">BoadCast Title</label>
                  <TextArea
                    type={"text"}
                    id={"boadCast_title"}
                    name={"boadCast_title"}
                    onChange={() => null}
                  />
                </div>
                <div className="">
                  <label htmlFor="end_date">BoadCast End Date</label>
                  <input type="datetime-local" name="end_date" id="end_date" />
                </div>
                <Row className={"my-5"}>
                  <label htmlFor="voices">Select Voice</label>
                  <ReactSelect
                    onChange={(e) => setVoiceId(e?.value)}
                    options={allVoices?.map((item) => ({
                      label: item?.title,
                      value: item?.voice_id,
                    }))}
                  />
                </Row>
                <button className="btn btn-success">
                  {!loading ? "Save" : <Loader />}
                </button>
              </form>
            }
          />
          <Modal
            open={hiddenId}
            toggle={setHiddenId}
            headerTitle={"Show / Hide BoadCast"}
            children={
              <>
                <h5>
                  Are You Sure To{" "}
                  {hiddenId?.status == "true" ? "Hide - " : "Show - "}
                  BoadCast ?
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
            headerTitle={"Delete BoadCast"}
            children={
              <>
                <h5>
                  {"Are You Sure To Delete BoadCast - " +
                    deleteId?.boadCast_title +
                    " ?"}
                </h5>
                <div className="flex-box">
                  <button
                    className="btn btn-danger"
                    onClick={() => {
                      handleDeleteBoadCast();
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
            headerTitle={"Edit BoadCast"}
            open={editId}
            toggle={setEditId}
            children={
              <form
                action="#"
                onSubmit={
                  !loading ? updateBoadCastText : (e) => e.preventDefault()
                }
              >
                <div className="" style={{ marginBottom: "12px" }}>
                  <label htmlFor="boadCast_name">BoadCast Name</label>
                  <TextArea
                    type={"text"}
                    id={"boadCast_name"}
                    name={"boadCast_title"}
                    defaultValue={editId?.title}
                  />
                </div>
                <div className="">
                  <label htmlFor="end_date">BoadCast End Date</label>
                  <input
                    type="datetime-local"
                    name="end_date"
                    defaultValue={editId?.end_date}
                    id="end_date"
                  />
                </div>
                <Row className={"my-5"}>
                  <label htmlFor="voices">Select Voice</label>
                  <ReactSelect
                    onChange={(e) => setVoiceId(e?.value)}
                    options={allVoices?.map((item) => ({
                      label: item?.title,
                      value: item?.voice_id,
                    }))}
                  />
                </Row>
                <button className="btn btn-success">
                  {!loading ? "Save" : <Loader />}
                </button>
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

export default BoadCasts;
