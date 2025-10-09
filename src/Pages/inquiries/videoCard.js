import React from "react";
import { AiOutlinePlayCircle } from "react-icons/ai";
import "./style.css";
import { ContentCopyOutlined } from "@mui/icons-material";
import CopyToClipboard from "react-copy-to-clipboard";
import { toast } from "react-toastify";
const VideoCard = ({ video }) => {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "16px",
        maxWidth: "400px",
        margin: "20px auto",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        backgroundColor: "#fff",
      }}
    >
      <h3 style={{ marginBottom: "10px", textTransform: "capitalize" }}>
        {video.video_title}
      </h3>
      <CopyToClipboard
        style={{
          padding: "0 14px",
          cursor: "pointer",
          width: "100%",
          display: "flex",
          gap: "10px",
          alignItems: "center",
        }}
        text={video?.video_id}
        onCopy={() => toast.success("Copied")}
      >
        <span
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <b
            style={{
              fontSize: "22px",
              fontWeight: "700",
              color: "green",
            }}
          >
           Video Id: {video?.video_id}
          </b>
          <em>
            <ContentCopyOutlined />
          </em>
        </span>
      </CopyToClipboard>
      <h3 style={{ marginBottom: "10px" }}>
        Cipher Data:{" "}
        <span style={{ fontSize: "10px" }}>{video.cipher_data}</span>
      </h3>
      <h3 style={{ marginBottom: "10px", textTransform: "capitalize" }}>
        Publitio Data:{" "}
        <span style={{ fontSize: "10px" }}>{video.publitio_data}</span>
      </h3>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "10px",
        }}
      >
        <span style={{ fontSize: "14px", color: "#555" }}>
          Duration: {video.video_duration}
        </span>
        {/* <a
          href={video.publitio_data}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "flex",
            alignItems: "center",
            textDecoration: "none",
            color: "#007bff",
            fontSize: "14px",
          }}
        >
          <AiOutlinePlayCircle style={{ marginRight: "5px" }} />
          Watch Video
        </a> */}
      </div>
      {/* <p style={{ fontSize: "12px", color: "#888" }}>
        Group ID: {video.group_id || "N/A"}
      </p> */}
    </div>
  );
};

export default VideoCard;
