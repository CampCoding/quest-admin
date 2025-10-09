import React, { useEffect, useState } from "react";
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
import WelcomeLogo from "../../assets/images/logo-sm.png";

const CommunityContainer = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [EditRealModal, setEditRealModal] = useState(false);
  const [SelectedReel, setSelectedReel] = useState(null);
  const [Comments, setComments] = useState([]);
  const [SelectedDataStatus, setSelectedDataStatus] = useState({
    label: "published",
    value: "published",
  });
  const [DeleteModal, setDeleteModal] = useState(false);

  const communityPostsData = [
    {
      id: 1,
      category: "Mathematics",
      title: "Need Help with Calculus Derivatives",
      content:
        "I'm struggling with understanding the fundamental rules of derivatives. Can someone explain the chain rule with some visual examples? Any step-by-step resources would be greatly appreciated!",
      img: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=500&h=300&fit=crop",
      author: {
        name: "Sarah Chen",
        avatar: "SC",
        reputation: 245,
      },
      timestamp: "2 hours ago",
      upvotes: 89,
      downvotes: 3,
      comments: 12,
      tags: ["calculus", "derivatives", "help-wanted"],
      gradient: "linear-gradient(45deg, #667eea, #764ba2)",
      postType: "question",
      status: "published", // Question being actively answered
      commentsList: [
        {
          id: 1,
          author: "Prof. Johnson",
          avatar: "PJ",
          content:
            "The chain rule is basically: if you have f(g(x)), then the derivative is f'(g(x)) × g'(x). Think of it as peeling an onion - layer by layer!",
          timestamp: "1 hour ago",
          upvotes: 15,
          isHelpful: true,
        },
        {
          id: 2,
          author: "MathTutor_Alex",
          avatar: "MA",
          content:
            "I recommend Khan Academy's visual approach. They have great animations that show how the chain rule works step by step.",
          timestamp: "45 minutes ago",
          upvotes: 8,
        },
        {
          id: 3,
          author: "Sarah Chen",
          avatar: "SC",
          content:
            "Thanks everyone! The onion analogy really helps. Going to check out Khan Academy now.",
          timestamp: "30 minutes ago",
          upvotes: 3,
          isOP: true,
        },
      ],
    },
    {
      id: 2,
      category: "Science",
      title: "DNA Structure Simplified - Study Guide",
      content:
        "I created a visual guide explaining the double helix structure of DNA and how genetic information is stored. Hope this helps fellow biology students! Feedback welcome.",
      img: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500&h=300&fit=crop",
      author: {
        name: "Dr. Mike Rodriguez",
        avatar: "MR",
        reputation: 1.2,
      },
      timestamp: "5 hours ago",
      upvotes: 156,
      downvotes: 8,
      comments: 23,
      tags: ["biology", "DNA", "study-guide", "education"],
      gradient: "linear-gradient(45deg, #4ecdc4, #44a08d)",
      postType: "resource",
      status: "published", // Resource is complete and available
      commentsList: [
        {
          id: 1,
          author: "BiologyStudent123",
          avatar: "BS",
          content:
            "This is exactly what I needed for my upcoming exam! The diagrams are so clear. Thank you Dr. Rodriguez!",
          timestamp: "3 hours ago",
          upvotes: 12,
        },
        {
          id: 2,
          author: "Dr. Lisa Park",
          avatar: "LP",
          content:
            "Excellent work! I'll be sharing this with my students. The way you explained base pairing is particularly good.",
          timestamp: "2 hours ago",
          upvotes: 18,
          isVerified: true,
        },
        {
          id: 3,
          author: "StudyBuddy",
          avatar: "SB",
          content:
            "Could you make one about RNA next? This helped me understand the difference between DNA and RNA structure.",
          timestamp: "1 hour ago",
          upvotes: 7,
        },
      ],
    },
    {
      id: 3,
      category: "History",
      title: "Discussion: Fascinating Facts About Ancient Egypt",
      content:
        "Let's discuss some mind-blowing facts about pharaohs, pyramids, and ancient Egyptian civilization! I'll start: Did you know the Great Pyramid was the tallest building for over 3,800 years?",
      img: "https://images.unsplash.com/photo-1539650116574-75c0c6d73e0e?w=500&h=300&fit=crop",
      author: {
        name: "Emma Thompson",
        avatar: "ET",
        reputation: 567,
      },
      timestamp: "1 day ago",
      upvotes: 201,
      downvotes: 12,
      comments: 34,
      tags: ["ancient-egypt", "history", "discussion", "facts"],
      gradient: "linear-gradient(45deg, #ff6b6b, #ee5a52)",
      postType: "discussion",
      status: "published", // Active ongoing discussion
      commentsList: [
        {
          id: 1,
          author: "HistoryBuff2024",
          avatar: "HB",
          content:
            "Here's another mind-blowing fact: The Great Pyramid contains about 2.3 million stone blocks, each weighing 2-15 tons!",
          timestamp: "20 hours ago",
          upvotes: 25,
        },
        {
          id: 2,
          author: "Egyptology_Pro",
          avatar: "EP",
          content:
            "Fun fact: Cleopatra lived closer in time to the Moon landing than to the construction of the Great Pyramid!",
          timestamp: "18 hours ago",
          upvotes: 31,
          isVerified: true,
        },
        {
          id: 3,
          author: "AncientWonders",
          avatar: "AW",
          content:
            "The precision of the pyramids is incredible. The base is level to within just 2.1 cm. How did they achieve such accuracy?",
          timestamp: "15 hours ago",
          upvotes: 19,
        },
        {
          id: 4,
          author: "Emma Thompson",
          avatar: "ET",
          content:
            "These are all amazing facts! I love how this community always teaches me something new. Keep them coming!",
          timestamp: "12 hours ago",
          upvotes: 8,
          isOP: true,
        },
      ],
    },
    {
      id: 4,
      category: "Language",
      title: "Grammar Tip: Past vs Present Perfect Tense",
      content:
        "Quick tip for English learners! Here's how to master the difference between past simple and present perfect tense with clear examples. Save this post for reference!",
      img: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&h=300&fit=crop",
      author: {
        name: "James Wilson",
        avatar: "JW",
        reputation: 892,
      },
      timestamp: "3 days ago",
      upvotes: 92,
      downvotes: 5,
      comments: 18,
      tags: ["english", "grammar", "language-learning", "tips"],
      gradient: "linear-gradient(45deg, #ffa726, #ff7043)",
      postType: "tip",
      status: "published", // Tip is complete and helpful
      commentsList: [
        {
          id: 1,
          author: "ESL_Teacher_Maria",
          avatar: "EM",
          content:
            "Great explanation! I always tell my students: Present Perfect connects past to present, Past Simple is just completed past action.",
          timestamp: "2 days ago",
          upvotes: 14,
          isVerified: true,
        },
        {
          id: 2,
          author: "LanguageLearner99",
          avatar: "LL",
          content:
            "This finally clicked for me! I was always confused about when to use 'have been' vs 'was'. Thank you!",
          timestamp: "2 days ago",
          upvotes: 9,
        },
        {
          id: 3,
          author: "GrammarGuru",
          avatar: "GG",
          content:
            "Quick tip: If you can add 'ago' to the sentence, use past simple. If not, consider present perfect!",
          timestamp: "1 day ago",
          upvotes: 22,
        },
      ],
    },
    {
      id: 5,
      category: "Technology",
      title: "Beginner's Guide to Machine Learning",
      content:
        "I've compiled a comprehensive guide explaining machine learning algorithms and their real-world applications. Perfect for beginners who want to understand AI basics without getting overwhelmed.",
      author: {
        name: "Alex Kumar",
        avatar: "AK",
        reputation: 1.5,
      },
      timestamp: "1 week ago",
      upvotes: 287,
      downvotes: 15,
      comments: 45,
      tags: ["machine-learning", "AI", "beginner", "guide", "technology"],
      gradient: "linear-gradient(45deg, #ab47bc, #8e24aa)",
      postType: "guide",
      status: "pending", // Guide awaiting final review/approval
    },
    {
      id: 6,
      category: "Mathematics",
      title: "Geometry Question: Triangle Properties",
      content:
        "Can someone help me understand the relationship between different types of triangles? I'm particularly confused about the geometric properties and theorems. Any visual aids or mnemonics?",
      author: {
        name: "Lisa Park",
        avatar: "LP",
        reputation: 123,
      },
      timestamp: "2 weeks ago",
      upvotes: 78,
      downvotes: 2,
      comments: 9,
      tags: ["geometry", "triangles", "math-help", "properties"],
      gradient: "linear-gradient(45deg, #26c6da, #00acc1)",
      postType: "question",
      status: "pending", // Question waiting for quality answers
    },
    // Additional posts to demonstrate different status combinations
    {
      id: 7,
      category: "Science",
      title: "Chemistry Lab Report: Acid-Base Reactions",
      content:
        "Working on documenting my chemistry lab experiments with detailed observations and conclusions. Still collecting data and will update with final results soon.",
      author: {
        name: "Chemistry_Student",
        avatar: "CS",
        reputation: 89,
      },
      timestamp: "3 days ago",
      upvotes: 23,
      downvotes: 1,
      comments: 5,
      tags: ["chemistry", "lab-report", "acid-base", "experiments"],
      gradient: "linear-gradient(45deg, #66bb6a, #43a047)",
      postType: "resource",
      status: "published", // Lab report being actively worked on
    },
    {
      id: 8,
      category: "Art",
      title: "Digital Art Tutorial: Character Design Basics",
      content:
        "Planning to create a step-by-step tutorial on character design fundamentals. This post is a placeholder while I prepare the content and gather reference materials.",
      author: {
        name: "ArtistAnna",
        avatar: "AA",
        reputation: 456,
      },
      timestamp: "5 days ago",
      upvotes: 67,
      downvotes: 3,
      comments: 12,
      tags: ["digital-art", "tutorial", "character-design", "basics"],
      gradient: "linear-gradient(45deg, #ec407a, #e91e63)",
      postType: "guide",
      status: "pending",
    },
  ];

  const [Communities, setCommunities] = useState([]);

  const getCommunity = async () => {
    await axios
      .get(
        "https://camp-coding.tech/quest/platform/admin/community/select_posts.php"
      )
      .then((res) => {
        console.log(res);

        if (res?.status == "success") {
          setCommunities(res?.message);
        }
      });
  };

  useEffect(() => {
    getCommunity();
  }, []);

  const tabs = [
    { label: "published ", value: "published" },
    { label: "pending", value: "pending" },
  ];

  const [SelectedReelModal, setSelectedReelModal] = useState(false);

  const handleReelClick = (reel) => {
    setSelectedReel(reel);
    setComments(reel?.comments);
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

  console.log(SelectedReel?.commentsList);
  useEffect(() => {
    setComments(SelectedReel?.comments);
  }, [SelectedReel]);

  const communtyFiltred = Communities.filter(
    (commmunity) => commmunity?.status == SelectedDataStatus?.value
  );

  console.log(communtyFiltred);

  const handelDelete = () => {
    const dataSend = {
      post_id: SelectedReel?.post_id,
    };
    axios
      .post(
        "https://camp-coding.tech/quest/platform/admin/community/delete_post.php",
        JSON.stringify(dataSend)
      )

      .then((res) => {
        console.log(res);
        if (res?.status === "success") {
          toast.success(res?.message);
          getCommunity();
          setDeleteModal(false);
          setSelectedReel(null);
        } else {
          toast.error(res?.message || "Delete failed");
        }
      })
      .catch((e) => {
        console.error(e);
        toast.error("Something went wrong");
      });
  };

  return (
    <>
      <div style={styles.container}>
        {/* <div className="univs">
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
        </div> */}
        <div style={styles.reelsGrid}>
          {Communities?.length > 0
            ? Communities?.map((reel) => (
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
                  <div
                    style={{
                      ...styles.reelThumbnail,
                      background: reel.gradient,
                    }}
                    onClick={() => {
                      setSelectedReel(reel);
                      setComments(reel.comments);
                      setSelectedReelModal(true);
                    }}
                  >
                    <img src={reel?.images[0]?.image} alt="m,c sdm" />
                  </div>
                  <div style={styles.reelContent}>
                    <div style={styles.reelMeta}>
                      <div style={styles.reelCategory}>{reel.category}</div>
                    </div>
                    <h3 style={styles.reelTitle}>{reel.text}</h3>

                    <div style={styles.reelStats}>
                      {/* <div style={styles.stat}>👁 7000 views</div> */}
                      <div style={styles.stat}>👍 {reel?.like_count} likes</div>
                      <div style={styles.stat}>
                        💬 {reel.comment_count} comments
                      </div>
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
                            setEditRealModal(true);
                            setSelectedReel(reel);
                          }}
                        >
                          <button
                            className="btn btn-primary"
                            style={{ width: "100%" }}
                          >
                            Comments
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
                            className="btn btn-success"
                            style={{ width: "100%" }}
                          >
                            Delete
                          </button>
                        </span>
                      </DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </div>
              ))
            : "there is no communities yet"}
        </div>
      </div>

      <Drawer
        title="Comments"
        closable={{ "aria-label": "Close Button" }}
        onClose={() => setEditRealModal(false)}
        open={EditRealModal}
        footer={null}
      >
        <p style={{ fontSize: "22px" }}>Comments</p>
        <div>
          {Comments?.length > 0 ? (
            Comments?.map((comment) => (
              <div
                key={comment.post_comment_id}
                className="comment-item mb-4 p-3 border rounded"
              >
                <div
                  className=" flex items-center mb-2"
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <div
                    style={{ backgroundColor: "#003032", borderRadius: "8px" }}
                    className="avatar w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center mr-3"
                  >
                    <img
                      src={
                        comment.comment_owner.student_avater_url || WelcomeLogo
                      }
                      alt=""
                      style={{ width: "50px" }}
                    />
                  </div>
                  <div>
                    <p
                      style={{ padding: "0", margin: "0" }}
                      className="font-medium text-gray-800"
                    >
                      {comment.comment_owner.student_name}
                    </p>
                    <p
                      style={{ padding: "0", margin: "0" }}
                      className="text-sm text-gray-500"
                    >
                      {comment.date_created}
                    </p>
                  </div>
                </div>
                <div className="" style={{ padding: "5px" }}>
                  <p className="text-gray-700">{comment.comment}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 italic">There are no comments yet</p>
          )}
        </div>
      </Drawer>

      <Modal isOpen={DeleteModal} toggle={() => setDeleteModal(!DeleteModal)}>
        <ModalHeader toggle={() => setDeleteModal(!DeleteModal)}>
          Delete Post
        </ModalHeader>
        <ModalBody>are you sure that you want to delete this Post?</ModalBody>
        <ModalFooter>
          <button onClick={() => handelDelete()} className="btn btn-success">
            yes,i'm
          </button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default CommunityContainer;
