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
} from "reactstrap";
import { MdOutlineClose } from "react-icons/md";
import { Drawer, Modal } from "antd";
import axios from "axios";
import { toast } from "react-toastify";

const RealseContainer = ({ data, getData }) => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [EditRealModal, setEditRealModal] = useState(false);
  const [SelectedReel, setSelectedReel] = useState(null);
  const [SelectedDataStatus, setSelectedDataStatus] = useState({
    label: "published",
    value: "active",
  });

  // const reelsData = [
  //   {
  //     id: 1,
  //     category: "Mathematics",
  //     title: "Quick Guide to Calculus Derivatives",
  //     description:
  //       "Learn the fundamental rules of derivatives with visual examples and step-by-step explanations.",
  //     duration: "2:30",
  //     views: "1.2K",
  //     likes: "89",
  //     comments: "12",
  //     gradient: "linear-gradient(45deg, #667eea, #764ba2)",
  //     status: "published", // Live and available to viewers
  //   },
  //   {
  //     id: 2,
  //     category: "Science",
  //     title: "DNA Structure Explained Simply",
  //     description:
  //       "Discover the double helix structure of DNA and understand how genetic information is stored.",
  //     duration: "3:15",
  //     views: "2.8K",
  //     likes: "156",
  //     comments: "23",
  //     gradient: "linear-gradient(45deg, #4ecdc4, #44a08d)",
  //     status: "published", // Successfully published with good engagement
  //   },
  //   {
  //     id: 3,
  //     category: "History",
  //     title: "Ancient Egypt in 5 Minutes",
  //     description:
  //       "Journey through the fascinating world of pharaohs, pyramids, and ancient Egyptian civilization.",
  //     duration: "4:20",
  //     views: "3.5K",
  //     likes: "201",
  //     comments: "34",
  //     gradient: "linear-gradient(45deg, #ff6b6b, #ee5a52)",
  //     status: "published", // Popular published content
  //   },
  //   {
  //     id: 4,
  //     category: "Language",
  //     title: "English Grammar: Past vs Present Perfect",
  //     description:
  //       "Master the difference between past simple and present perfect tense with clear examples.",
  //     duration: "1:45",
  //     views: "1.8K",
  //     likes: "92",
  //     comments: "18",
  //     gradient: "linear-gradient(45deg, #ffa726, #ff7043)",
  //     status: "published", // Educational content live for viewers
  //   },
  //   {
  //     id: 5,
  //     category: "Technology",
  //     title: "How Machine Learning Works",
  //     description:
  //       "Understand the basics of machine learning algorithms and their real-world applications.",
  //     duration: "3:50",
  //     views: "4.1K",
  //     likes: "287",
  //     comments: "45",
  //     gradient: "linear-gradient(45deg, #ab47bc, #8e24aa)",
  //     status: "published", // High-engagement published reel
  //   },
  //   {
  //     id: 6,
  //     category: "Mathematics",
  //     title: "Geometry: Understanding Triangles",
  //     description:
  //       "Explore different types of triangles and learn essential geometric properties and theorems.",
  //     duration: "2:15",
  //     views: "1.6K",
  //     likes: "78",
  //     comments: "9",
  //     gradient: "linear-gradient(45deg, #26c6da, #00acc1)",
  //     status: "published", // Educational geometry content available
  //   },
  //   // Additional reels to show pending status examples
  //   {
  //     id: 7,
  //     category: "Chemistry",
  //     title: "Chemical Reactions Basics",
  //     description:
  //       "Understanding how atoms interact and form compounds through chemical reactions.",
  //     duration: "2:45",
  //     views: "0", // No views yet as it's pending
  //     likes: "0",
  //     comments: "0",
  //     gradient: "linear-gradient(45deg, #66bb6a, #43a047)",
  //     status: "pending", // Awaiting review or final editing
  //   },
  //   {
  //     id: 8,
  //     category: "Physics",
  //     title: "Newton's Laws of Motion",
  //     description:
  //       "Discover the three fundamental laws that govern motion in our universe.",
  //     duration: "3:30",
  //     views: "0", // No engagement yet
  //     likes: "0",
  //     comments: "0",
  //     gradient: "linear-gradient(45deg, #5c6bc0, #3f51b5)",
  //     status: "pending", // Under review before publication
  //   },
  //   {
  //     id: 9,
  //     category: "Art",
  //     title: "Color Theory for Beginners",
  //     description:
  //       "Learn the basics of color theory and how to create harmonious color palettes.",
  //     duration: "4:00",
  //     views: "0",
  //     likes: "0",
  //     comments: "0",
  //     gradient: "linear-gradient(45deg, #ec407a, #e91e63)",
  //     status: "pending", // Content creation completed, awaiting approval
  //   },
  //   {
  //     id: 10,
  //     category: "Literature",
  //     title: "Shakespeare's Writing Techniques",
  //     description:
  //       "Explore the literary devices and techniques that made Shakespeare's works timeless.",
  //     duration: "3:10",
  //     views: "0",
  //     likes: "0",
  //     comments: "0",
  //     gradient: "linear-gradient(45deg, #8d6e63, #6d4c41)",
  //     status: "pending", // Final quality check before going live
  //   },
  // ];

  // Status constants for reels

  const handleFilterClick = (category) => {
    setActiveFilter(category);
  };

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

  const tabs = [
    { label: "published ", value: "active" },
    { label: "pending", value: "pending_approved" },
    { label: "hidden", value: "deleted" },
  ];

  const FiltredReellsWithStatus = data?.filter(
    (reel) => reel?.status == SelectedDataStatus?.value
  );

  console.log(FiltredReellsWithStatus);

  const handelChangeStatus = (reel_id, status) => {
    const dataSend = {
      reel_id: reel_id,
      status: status, //active - deleted
    };

    console.log(dataSend);

    axios
      .post(
        `https://camp-coding.tech/quest/platform/admin/reels/change_status_reel.php`,
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
        <div className="univs">
          {tabs.map((tab) => {
            return (
              <>
                <span
                  className={
                    SelectedDataStatus?.value == tab?.value ? "active" : ""
                  }
                  onClick={() => setSelectedDataStatus(tab)}
                >
                  {tab?.label}
                </span>
              </>
            );
          })}
        </div>
        <div style={styles.reelsGrid}>
          {FiltredReellsWithStatus?.length > 0
            ? FiltredReellsWithStatus.map((reel) => (
                <div
                  key={reel.id}
                  style={styles.reelCard}
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
                  {/* <div
                    style={{
                      ...styles.reelThumbnail,
                      backgroundImage: `url(${reel.video_url})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                    onClick={() => handleReelClick(reel)}
                  >
                    <div style={styles.playIcon}>▶</div>
                  </div> */}
                  <video
                    style={{
                      ...styles.reelThumbnail,
                    }}
                    onClick={() => handleReelClick(reel)}
                    src={reel.video_url}
                    controls
                  ></video>
                  <div style={styles.reelContent}>
                    <div style={styles.reelMeta}>
                      <div style={styles.reelCategory}>{reel.category}</div>
                      <div style={styles.reelDuration}>⏱ {reel.duration}</div>
                    </div>
                    <h3 style={styles.reelTitle}>{reel.title}</h3>
                    <p style={styles.reelDescription}>{reel.description}</p>
                    <div style={styles.reelStats}>
                      <div style={styles.stat}>👁 {reel.view_count} views</div>
                      <div style={styles.stat}>👍 {reel.like_count} likes</div>
                      <div style={styles.stat}>💬 {reel.comments} comments</div>
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
                        style={{ color: "black", fontSize: "25px" }}
                      ></i>
                    </DropdownToggle>
                    <DropdownMenu className="dropdown-menu-end">
                      <DropdownItem>
                        <span
                          style={{
                            width: "25px",
                            cursor: "pointer",
                          }}
                        >
                          <button
                            className="btn btn-danger"
                            style={{ width: "100%" }}
                            onClick={() =>
                              handelChangeStatus(reel?.reel_id, "deleted")
                            }
                          >
                            Hide
                          </button>
                        </span>
                      </DropdownItem>

                      <DropdownItem>
                        <span
                          style={{
                            width: "25px",
                            cursor: "pointer",
                          }}
                          onClick={() =>
                            handelChangeStatus(reel?.reel_id, "active")
                          }
                        >
                          <button
                            className="btn btn-success"
                            style={{ width: "100%" }}
                          >
                            Show
                          </button>
                        </span>
                      </DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </div>
              ))
            : "there is no reels yet"}
        </div>
      </div>

      <Modal
        open={SelectedReelModal}
        onCancel={() => setSelectedReelModal(false)}
        footer={null}
        style={{
          padding: "0px",
        }}
      >
        <iframe
          src={SelectedReel?.video_url}
          style={{
            width: "100%",
            padding: "0",
            height: "70vh",
          }}
          className="video"
          controls
          autoPlay
        ></iframe>
      </Modal>
    </>
  );
};

export default RealseContainer;
