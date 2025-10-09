import React, { useEffect, useState } from "react";
import DefaultLayout from "../../layouts/defaultLayout";
import BurdCrumbs from "../../components/burdCrumbs";
import TableLayout from "../../components/table";
import Modal from "../../components/modal";
import { useLocation, useNavigate } from "react-router-dom";
import { BASE_URL } from "../../constants";
import axios from "axios";
import { toast } from "react-toastify";
import { Loader } from "rsuite";
import { Input } from "../../components/form-elements";
import { addition } from "../../assets/svgIcons";
import { userData } from "../../data/fake_login_data";
import { perms } from "../../data/side_nav_data";
import { exportToCSV } from "../../functions";
const Posts = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchHeaderKet, setSearchHeaderKey] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [hiddenId, setHiddenId] = useState(false);
  const [postName, setPostName] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(false);
  const [deleteId, setDeleteId] = useState(false);
  const [editId, setEditId] = useState(false);
  const [opened, setOpened] = useState(null);
  const headers = [
    {
      label: "ID",
      dataIndex: "post_id",
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
                setOpened(opened == row?.post_id ? null : row?.post_id)
              }
            >
              <img
                src="https://res.cloudinary.com/duovxefh6/image/upload/v1701489400/menu_hrpzcb.png"
                alt=""
                style={{ width: "20px", height: "20px" }}
              />
            </div>
            {row?.post_id == opened ? (
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
      label: "post_content",
      dataIndex: "post_content",
      search: true,
      sort: true,
      type: "children",
      children: ({ row }) => {
        return (
          <div style={{ whiteSpace: "pre-wrap", width: "130px" }}>
            {row?.post_content}
          </div>
        );
      },
    },
    {
      label: "Date",
      dataIndex: "post_date",
      // search: true,
      sort: true,
    },
    {
      label: "Current status",
      type: "children",
      children: ({ row }) => {
        if (row?.hidden == "false") {
          return <span className="text-success textCurrent">Show</span>;
        } else {
          return <span className="text-danger textCurrent">Hide</span>;
        }
      },
    },
    {
      label: "Change status",
      type: "children",
      children: ({ row }) => {
        if (row.hidden !== "false") {
          return (
            <span
              className="btn btn-success"
              style={{ color: "black" }}
              onClick={() =>
                setHiddenId({
                  post_id: row?.post_id,
                  status: row?.hidden == "false" ? "true" : "false",
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
                  post_id: row?.post_id,
                  post_name: row?.post_title,
                  status: "true",
                })
              }
            >
              Hide
            </span>
          );
        }
      },
    },
    // setHiddenId
  ];
  window.addEventListener("click", (e) => {
    if (
      opened &&
      !e.target?.classList?.contains("actions-views") &&
      !e.target?.parentNode?.classList?.contains("open_close")
    ) {
      setOpened(null);
    }
  });
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.post(BASE_URL + "posts/select_posts1.php", {
        university_id: location?.state?.university_id,
        admin_id: userData?.user_id,
        access_token: userData?.access_token,
      });
      setData(response?.data?.message);
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
          formData.append('image', file);
          const imageUploadResponse = await axios.post(
            BASE_URL + "item_img_uploader.php",
            formData
          );
          images.push(imageUploadResponse?.data?.message);
        })
      );

      // if (images && images.length) {
      const imageLinks = images;
      const response = await axios.post(BASE_URL + "posts/insert_post.php", {
        university_id: location?.state?.university_id,
        post_content: e?.target?.post_title?.value,
        images: images && images.length ? imageLinks?.join('**camp**') : null,
        admin_id: userData?.user_id,
        access_token: userData?.access_token, // Separate links with '***'
      });

      if (response.data?.status === "success") {
        toast.success(response.data?.message);
        fetchData();
        setShowAdd(false);
        form.reset();
      } else {
        toast.error(response.data?.message);
      }
      // }
    } catch (err) {
      toast.error(err?.message);
    } finally {
      setLoading(false);
    }
  };
  const handleDeletePost = () => {
    const data_send = {
      post_id: deleteId?.post_id,
      admin_id: userData?.user_id,
      access_token: userData?.access_token,
    };
    axios
      .post(BASE_URL + "posts/delete_post.php", JSON.stringify(data_send))
      .then((res) => {
        if (res.data.status == 'success') {
          toast.success(res.data.message);
          setDeleteId(false);
          fetchData();
        } else if (res.data.status == 'error') {
          toast.error(res.data.message);
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
        BASE_URL + "item_img_uploader.php",
        formData
      );
      if (
        imageUpload?.data?.status == "success" ||
        !e.target?.image?.files?.length
      ) {
        const response = await axios.post(BASE_URL + "posts/update_post.php", {
          university_id: location?.state?.university_id,
          post_id: editId?.post_id,
          post_title: form?.post_title?.value,
          image_url:
            imageUpload?.data?.status == "success" && form?.image?.files?.length
              ? imageUpload?.data?.message
              : editId?.post_photo,
          admin_id: userData?.user_id,
          access_token: userData?.access_token,
        });
        if (response.data?.status == "success") {
          toast.success(response.data?.message);
          fetchData();
          setEditId(false);
          form.reset();
          setLoading(false);
        } else {
          setLoading(false);
          toast.error(response.data?.message);
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

    try {
      const response = await axios.post(
        BASE_URL + "posts/show_hide_posts.php",
        {
          post_id: hiddenId?.post_id,
          hidden: hiddenId?.status,
          admin_id: userData?.user_id,
          access_token: userData?.access_token,
        }
      );
      if (response.data?.status == "success") {
        toast.success(response.data?.message);
        fetchData();
        setHiddenId(false);
        setLoading(false);
      } else {
        setLoading(false);
        toast.error(response.data?.message);
      }

      // setShowAdd(false);
    } catch (err) {
      toast.error(err?.message);
      setLoading(false);
    }
  };
  
  return (
    <div id="home">
      <DefaultLayout
        setSearchHeaderKey={setSearchHeaderKey}
        children={
          <div className="childs">
            <h4 className="customBreadCrumbs">
              <span>Posts</span>
              <button
                className="btn btn-primary"
                onClick={() => setShowAdd(true)}
              >
                <span>{addition}</span>
                <span>Add Post</span>
              </button>
            </h4>
            {(perms?.includes("*17_8") || perms?.startsWith("17_8")) &&
            data?.length ? (
              <button
                className="btn btn-primary exportBtn"
                onClick={() => {
                  exportToCSV(data, "Posts Data");
                }}
              >
                Export
              </button>
            ) : null}
            <TableLayout
              searchHeaderKet={searchHeaderKet}
              headers={headers}
              data={data}
            />
          </div>
        }
      />
      <Modal
        headerTitle={"Add Post"}
        open={showAdd}
        toggle={setShowAdd}
        children={
          <form
            action="#"
            onSubmit={!loading ? addPost : (e) => e.preventDefault()}
          >
            <div className="inputField">
              <label htmlFor="post_title">Post Title</label>
              <Input
                type={"text"}
                id={"post_title"}
                name={"post_title"}
                onChange={() => null}
              />
            </div>
            <div className="inputField">
              <label htmlFor="images">Image URL</label>
              <Input
                type={"file"}
                id={"images"}
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
              {hiddenId?.status == "true" ? "Hide - " : "Show - "}
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
              {"Are You Sure To Delete Post - " + deleteId?.post_title + " ?"}
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
            onSubmit={!loading ? handleEditPost : (e) => e.preventDefault()}
          >
            <div className="inputField">
              <label htmlFor="post_name">Post Name</label>
              <Input
                type={"text"}
                id={"post_name"}
                name={"post_title"}
                defaultValue={editId?.post_title}
                onChange={(e) => null}
              />
            </div>
            <div className="inputField">
              <label htmlFor="image">Image URL</label>
              <Input
                type={"file"}
                id={"image"}
                name={"image"}
                showImage={true}
                onChange={() => null}
              />
            </div>
            <div className="links_images"></div>
            <button className="btn btn-success">
              {!loading ? "Save" : <Loader />}
            </button>
          </form>
        }
      />
    </div>
  );
};

export default Posts;
