import React, { useState } from "react";
import {
  DropdownItem,
  Button,
  DropdownMenu,
  DropdownToggle,
  ModalBody,
  ModalFooter,
  ModalHeader,
  UncontrolledDropdown,
  Modal,
} from "reactstrap";
import { MdOutlineClose } from "react-icons/md";
import { Drawer } from "antd";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const MarkedPlaceContainer = ({
  data,
  getData,
  openEditModal,
  setopenEditModal,
}) => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [SelectedReel, setSelectedReel] = useState(null);
  const [EditMarketPlaceModal, setEditMarketPlaceModal] = useState(false);
  const [EditImage, setEditImage] = useState(null);
  const [DeleteModal, setDeleteModal] = useState(false);

  const [SelectedReelModal, setSelectedReelModal] = useState(false);

  const handleReelClick = (reel) => {
    setSelectedReel(reel);
    setSelectedReelModal(true);
  };

  const styles = {
    container: {
      padding: "20px",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    header: {
      textAlign: "center",
      marginBottom: "40px",
    },
    headerTitle: {
      fontSize: "2.5rem",
      fontWeight: "700",
      color: "#333",
      marginBottom: "10px",
    },
    headerSubtitle: {
      fontSize: "1.1rem",
      color: "#666",
    },
    filterTabs: {
      display: "flex",
      justifyContent: "center",
      gap: "15px",
      marginBottom: "30px",
      flexWrap: "wrap",
    },
    filterTab: {
      background: "rgba(102, 126, 234, 0.1)",
      color: "#667eea",
      border: "2px solid #667eea",
      padding: "10px 20px",
      borderRadius: "25px",
      cursor: "pointer",
      transition: "all 0.3s ease",
      fontWeight: "500",
      fontSize: "0.9rem",
    },
    filterTabActive: {
      background: "#667eea",
      color: "white",
      transform: "translateY(-2px)",
      boxShadow: "0 5px 15px rgba(102, 126, 234, 0.3)",
    },
    reelsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
      gap: "25px",
    },
    reelCard: {
      background: "white",
      borderRadius: "16px",
      overflow: "hidden",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
      transition: "all 0.3s ease",
      cursor: "pointer",
      border: "1px solid #f0f0f0",
      position: "relative",
      maxWidth: "350px",
    },
    reelCardUnactive: {
      background: "#f0f0f0",
      borderRadius: "16px",
      overflow: "hidden",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
      transition: "all 0.3s ease",
      cursor: "pointer",
      border: "1px solid #f0f0f0",
      position: "relative",
      maxWidth: "350px",
    },
    reelCardHover: {
      transform: "translateY(-8px)",
      boxShadow: "0 12px 40px rgba(0, 0, 0, 0.15)",
    },
    reelThumbnail: {
      width: "100%",
      height: "180px",
      position: "relative",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
    },
    playIcon: {
      width: "50px",
      height: "50px",
      background: "rgba(255, 255, 255, 0.9)",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "18px",
      color: "#333",
      transition: "all 0.3s ease",
      backdropFilter: "blur(10px)",
    },
    reelContent: {
      padding: "20px",
    },
    reelMeta: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "15px",
    },
    reelCategory: {
      background: "linear-gradient(45deg, #667eea, #764ba2)",
      color: "white",
      padding: "4px 12px",
      borderRadius: "15px",
      fontSize: "0.75rem",
      fontWeight: "500",
    },
    reelDuration: {
      color: "#888",
      fontSize: "0.85rem",
      display: "flex",
      alignItems: "center",
      gap: "5px",
    },
    reelTitle: {
      fontSize: "1.2rem",
      fontWeight: "600",
      color: "#333",
      marginBottom: "10px",
      lineHeight: "1.4",
      textAlign: "center",
    },
    reelDescription: {
      color: "#666",
      fontSize: "0.9rem",
      lineHeight: "1.5",
      marginBottom: "15px",
    },
    reelStats: {
      display: "flex",
      gap: "15px",
      paddingTop: "15px",
      borderTop: "1px solid #eee",
    },
    stat: {
      display: "flex",
      alignItems: "center",
      gap: "5px",
      color: "#666",
      fontSize: "0.85rem",
    },
    addReelBtn: {
      position: "fixed",
      bottom: "30px",
      right: "30px",
      width: "60px",
      height: "60px",
      background: "linear-gradient(45deg, #ff6b6b, #ee5a52)",
      border: "none",
      borderRadius: "50%",
      color: "white",
      fontSize: "24px",
      cursor: "pointer",
      boxShadow: "0 10px 30px rgba(255, 107, 107, 0.4)",
      transition: "all 0.3s ease",
      zIndex: 100,
    },
  };

  const [base64Image, setBase64Image] = useState(null);

  const getBase46 = (e) => {
    const chosenFile = e?.target?.files[0];

    if (chosenFile) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const result = e.target.result;
        setBase64Image(result);
        console.log(result);
        console.log("skxkskxk");
      };

      reader.readAsDataURL(chosenFile);
    }
  };

  const handelEditMarketPlace = async () => {
    setLoading(true);
    if (EditImage) {
      let imgUrl;

      const formData = new FormData();
      formData.append("image", EditImage);
      await axios
        .post(
          `https://camp-coding.tech/quest/platform/admin/image_uplouder.php`,
          formData
        )
        .then((res) => {
          imgUrl = res;
        });

      const dataSend = {
        item: imgUrl,
        title: SelectedReel?.title,
        marketplace_id: SelectedReel?.marketplace_id,

        points: SelectedReel?.points,
      };

      console.log(dataSend);

      axios
        .post(
          `https://camp-coding.tech/quest/platform/admin/marketplace/edit_marketplace.php`,
          JSON.stringify(dataSend)
        )
        .then((res) => {
          console.log(res);

          if (res?.status == "success") {
            toast.success(res?.message);
            getData();
            setEditMarketPlaceModal(false);
            setSelectedReel(null);
            setEditImage(null);
          } else {
            toast.error(res?.message);
          }
        })
        .catch((e) => console.log(e));
    } else {
      const dataSend = {
        item: SelectedReel?.item,
        title: SelectedReel?.title,
        points: SelectedReel?.points,
        marketplace_id: SelectedReel?.marketplace_id,
      };

      console.log(dataSend);

      axios
        .post(
          `https://camp-coding.tech/quest/platform/admin/marketplace/edit_marketplace.php`,
          JSON.stringify(dataSend)
        )
        .then((res) => {
          console.log(res);

          if (res?.status == "success") {
            toast.success(res?.message);
            getData();
            setEditMarketPlaceModal(false);
            setSelectedReel(null);
          } else {
            toast.error(res?.message);
          }
        })
        .catch((e) => console.log(e));
    }

    setLoading(false);
  };

  const handelDelete = () => {
    const dataSend = {
      marketplace_id: SelectedReel?.marketplace_id,
    };
    axios
      .post(
        `https://camp-coding.tech/quest/platform/admin/marketplace/delete_marketplace.php`,
        JSON.stringify(dataSend)
      )
      .then((res) => {
        console.log(res);

        if (res?.status == "success") {
          toast.success(res?.message);
          getData();
          setDeleteModal(false);
          setSelectedReel(null);
        } else {
          toast.error(res?.message);
        }
      })
      .catch((e) => console.log(e));
  };

  const handelActivte = (marketplace_id) => {
    const dataSend = {
      marketplace_id: marketplace_id,
    };
    axios
      .post(
        `https://camp-coding.tech/quest/platform/admin/marketplace/toggle_marketplace_active.php`,
        JSON.stringify(dataSend)
      )
      .then((res) => {
        console.log(res);

        if (res?.status == "success") {
          toast.success(res?.message);
          getData();
        } else {
          toast.error(res?.message);
        }
      })
      .catch((e) => console.log(e));
  };
  return (
    <>
      <div style={styles.container}>
        <div style={styles.reelsGrid}>
          {data.map((reel) => (
            <div
              key={reel.id}
              style={
                reel?.active == 1 ? styles.reelCard : styles.reelCardUnactive
              }
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-8px)";
                e.currentTarget.style.boxShadow =
                  "0 12px 40px rgba(0, 0, 0, 0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 4px 20px rgba(0, 0, 0, 0.1)";
              }}
            >
              <div
                style={{
                  ...styles.reelThumbnail,
                  background: reel.gradient,
                }}
                onClick={() => handleReelClick(reel)}
              >
                <div style={styles.playIcon}>
                  <img src={reel?.item} alt="" />
                </div>
              </div>
              <div style={styles.reelContent}>
                <div style={styles.reelMeta}>
                  <div style={styles.reelCategory}>{reel.points} points</div>
                </div>
                <h3 style={styles.reelTitle}>{reel.title}</h3>
                <h3 style={styles.reelTitle}>{reel.title}</h3>
                <div style={styles.reelStats}>
                  <div style={styles.stat}>👁 7000 student</div>
                </div>
              </div>
              <UncontrolledDropdown className="DropVidUn">
                <DropdownToggle
                  className="btn btn-light btn-sm"
                  tag="button"
                  data-bs-toggle="dropdown"
                  direction="start"
                  style={{ margin: "10px" }}
                >
                  <i
                    className="bx bx-dots-horizontal-rounded"
                    style={{ color: "black" }}
                  ></i>
                </DropdownToggle>
                <DropdownMenu className="dropdown-menu-end">
                  <DropdownItem>
                    <span
                      onClick={() => {
                        navigate(
                          `/market-place/${reel?.marketplace_id}/offers`
                        );
                      }}
                    >
                      <button
                        className="btn btn-primary"
                        style={{ width: "100%" }}
                      >
                        Offers
                      </button>
                    </span>
                  </DropdownItem>
                  <DropdownItem>
                    <span
                      onClick={() => {
                        setEditMarketPlaceModal(true);
                        setSelectedReel(reel);
                      }}
                    >
                      <button
                        className="btn btn-primary"
                        style={{ width: "100%" }}
                        onClick={() => setopenEditModal(reel)}
                      >
                        Edit
                      </button>
                    </span>
                  </DropdownItem>
                  <DropdownItem>
                    <span
                      style={{
                        width: "25px",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        setDeleteModal(true);
                        setSelectedReel(reel);
                      }}
                    >
                      <button
                        className="btn btn-danger"
                        style={{ width: "100%" }}
                      >
                        Delete
                      </button>
                    </span>
                  </DropdownItem>

                  <DropdownItem>
                    <span
                      style={{
                        width: "25px",
                        cursor: "pointer",
                      }}
                    >
                      <button
                        className="btn btn-success"
                        style={{ width: "100%" }}
                        onClick={() => handelActivte(reel?.marketplace_id)}
                      >
                        {reel?.active == 1 ? "unactive" : "active"}
                      </button>
                    </span>
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </div>
          ))}
        </div>
      </div>

      <Drawer
        title="Add new Offer"
        closable={{ "aria-label": "Close Button" }}
        onClose={() => setEditMarketPlaceModal(false)}
        open={EditMarketPlaceModal}
        footer={
          <>
            <button
              className="btn btn-success w-100"
              onClick={handelEditMarketPlace}
            >
              {loading ? "loading..." : "Edit"}
            </button>
          </>
        }
      >
        <p style={{ fontSize: "22px" }}>Edit Offer</p>
        <div className="mb-3">
          <label className="form-label" htmlFor="price">
            Offer image
          </label>
          <input
            type="file"
            className="form-control"
            placeholder="Enter percentage"
            style={{ border: ".1px solid #49505794" }}
            onChange={(e) => {
              getBase46(e);
              setEditImage(e.target.files[0]);
            }}
          />
        </div>
        <img
          src={base64Image == null ? SelectedReel?.item : base64Image}
          style={{ width: "100%" }}
          alt=""
        />
        <div className="mb-3">
          <label className="form-label" htmlFor="price">
            Offer points
          </label>
          <input
            type="number"
            className="form-control"
            placeholder="Enter percepointsntage"
            style={{ border: ".1px solid #49505794" }}
            value={SelectedReel?.points || ""}
            onChange={(e) => {
              setSelectedReel({
                ...SelectedReel,
                points: e.target.value,
              });
            }}
          />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="price">
            Offer title
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter title"
            value={SelectedReel?.title}
            style={{ border: ".1px solid #49505794" }}
            onChange={(e) => {
              setSelectedReel({
                ...SelectedReel,
                title: e.target.value,
              });
            }}
          />
        </div>
      </Drawer>

      <Modal isOpen={DeleteModal} toggle={() => setDeleteModal(!DeleteModal)}>
        <ModalHeader toggle={() => setDeleteModal(!DeleteModal)}>
          Delete Market place
        </ModalHeader>
        <ModalBody>
          are you sure that you want to delete this mrket place?
        </ModalBody>
        <ModalFooter>
          <button onClick={() => handelDelete()} className="btn btn-success">
            yes,i'm
          </button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default MarkedPlaceContainer;
