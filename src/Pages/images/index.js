import React, { useEffect, useRef, useState } from "react";
import {
  Card,
  CardBody,
  CloseButton,
  Col,
  Container,
  Input,
  Modal,
  Row,
} from "reactstrap";
import "./style.css";
import TableContainer from "../../components/Common/TableContainer";
import { Loader } from "rsuite";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { CopyAllOutlined, MpSharp } from "@mui/icons-material";
import CopyToClipboard from "react-copy-to-clipboard";
import {
  AiOutlineCheckCircle,
  AiOutlineCloseCircle,
  AiOutlineEye,
} from "react-icons/ai";
import { userData } from "../../store/getProfileData";

const Images = () => {
  const location = useLocation();

  const [images, setImages] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imagesURL, setImagesURL] = useState(false);
  const [imagesFiles, setImagesFiles] = useState(false);
  const [uploader, setUploader] = useState(false);
  const [imageModalData, setImageModalData] = useState(false);
  const [indexing, setIndex] = useState([]);
  const filesRef = useRef(null);
  const getImages = async () => {
    try {
      const images = await axios.post(
        "https://camp-coding.tech/quest/platform/admin/images_data/select_folder_images.php",
        {
          folder: location?.state?.folder_name,
        }
      );
      setImages([...images]);
    } catch (err) {
      toast.error(err?.message);
      setImages([]);
    }
  };
  const uploadImages = async (e) => {
    setUploader(true);
    if (imagesFiles && imagesFiles?.length && Array.isArray(imagesFiles)) {
      await imagesFiles?.map(async (imageFile, index) => {
        const formData = new FormData();
        formData.append("folder", location?.state?.folder_name);
        formData.append("image", imageFile);
        await axios
          .post(
            "https://camp-coding.tech/quest/platform/admin/images_data/image_uplouder.php",
            formData
          )
          .then((response) => {
            if (response == "image_added") {
              toast.success("تم رفع الصورة بنجاح");
              indexing.push(index);
              setIndex(indexing);
            } else {
              toast.error(response);
            }
          })
          .catch((err) => {
            toast.error(err);
          })
          .finally((err) => {
            setUploader(false);
            getImages();
          });
      });
    }
  };
  const getImagesURL = (files) => {
    setImagesFiles(Object.keys(files).map((file) => files[`${file}`]));
    if (files.length) {
      const img = Object.keys(files).map((file) => {
        return URL.createObjectURL(files[`${file}`]);
      });
      setImagesURL(img);
    }
  };
  useEffect(() => {
    getImages();
  }, []);
  const permissions = userData?.permissions;
  return (
    <div className="images">
      <div className="page-content">
        <Container fluid={true}>
          {/* breadcrumbItem={loation?.state?.coursedata?.course_name + " Unit List"} */}
          <Row>
            <Col lg={12}>
              {permissions?.includes("*11_1") ||
              permissions?.startsWith("11_1") ||
              permissions == "all" ? (
                <button
                  className="btn btn-success"
                  onClick={() => setIsModalOpen(true)}
                >
                  Upload Images
                </button>
              ) : null}
              <Card>
                <CardBody>
                  <div className="folders images">
                    {images?.length ? (
                      images?.map((item) => {
                        return (
                          <div className="folder image-body">
                            <div className="icon">
                              <img src={item?.url} alt="" />
                            </div>
                            <div className="name">
                              <CopyToClipboard
                                text={item?.name}
                                onCopy={() => toast.success("Copied")}
                              >
                                <div
                                  style={{
                                    width: "100%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexDirection: "column",
                                  }}
                                >
                                  <span>{item?.name}</span>
                                  <CopyAllOutlined />
                                </div>
                              </CopyToClipboard>
                              <span>
                                <AiOutlineEye
                                  style={{ fontSize: "34px" }}
                                  onClick={() => setImageModalData(item)}
                                />
                              </span>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <h4>No Images In This Folder</h4>
                    )}
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
      <Modal title="Add Images" isOpen={isModalOpen}>
        <form
          action="#"
          style={{
            padding: "15px",
            display: "flex",
            flexDirection: "column",
          }}
          onSubmit={(e) => {
            e.preventDefault();
            uploadImages(e);
          }}
        >
          <CloseButton
            onClick={() => {
              setIsModalOpen(false);
              setImagesFiles(false);
              setImagesURL(false);
              setIndex([]);
              getImages();
            }}
            style={{ marginLeft: "auto" }}
          />

          <div className="input_Field">
            <label forHtml="Images" style={{ width: "150px", margin: "auto" }}>
              {imagesURL?.length ? (
                <button
                  className="btn"
                  style={{ margin: "10px auto", cursor: "pointer" }}
                >
                  {" "}
                  {!uploader ? (
                    <>
                      <img
                        src="https://www.freeiconspng.com/thumbs/upload-icon/upload-icon-22.png"
                        alt=""
                        style={{ width: "150px", margin: "auto" }}
                      />
                      <span
                        style={{
                          width: "150px",
                          margin: "10px auto",
                          display: "block",
                        }}
                      >
                        Click To Upload
                      </span>
                    </>
                  ) : (
                    <Loader size={"lg"} />
                  )}{" "}
                </button>
              ) : null}
            </label>

            <Input
              //   style={{
              //     display: "none",
              //   }}
              type="file"
              multiple={true}
              ref={filesRef}
              name="Images"
              id="Images"
              placeholder="Images"
              required
              onChange={(e) => getImagesURL(e.target.files)}
            />
            <div className="imagesUpload">
              {imagesURL?.length
                ? imagesURL?.map((imageURL, index) => {
                    return (
                      <div className="imageUpload">
                        {indexing && indexing?.length ? (
                          indexing?.filter(
                            (imageURL, indeex) => imageURL == index
                          )?.length ? (
                            <AiOutlineCheckCircle style={{ color: "green" }} />
                          ) : (
                            <AiOutlineCloseCircle style={{ color: "red" }} />
                          )
                        ) : null}
                        <img src={imageURL} alt="" />
                        <span
                          className="removeImageUpload btn btn-danger"
                          onClick={() => {
                            setImagesFiles(
                              imagesFiles.filter(
                                (img, fi_index) => index != fi_index
                              )
                            );
                            setImagesURL(
                              imagesURL.filter(
                                (img, fi_index) => index != fi_index
                              )
                            );
                          }}
                        >
                          Delete
                        </span>
                      </div>
                    );
                  })
                : null}
            </div>
          </div>
        </form>
      </Modal>
      <Modal title={imageModalData?.name} isOpen={imageModalData}>
        <form
          action="#"
          style={{
            padding: "15px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <CloseButton
            onClick={() => {
              setImageModalData(false);
            }}
            style={{ marginLeft: "auto" }}
          />

          <div className="input_Field">
            <div className="imagesUpload">
              {imageModalData?.url ? (
                <img
                  src={imageModalData?.url}
                  style={{ width: "100%" }}
                  alt=""
                />
              ) : null}
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Images;
