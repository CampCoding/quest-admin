import React, { useState } from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import { useNavigate } from "react-router-dom";
import { AiOutlineLoading } from "react-icons/ai";
import axios from "axios";
import { toast } from "react-toastify";
import { userData } from "../../../store/getProfileData";

const ImageFolderTableList = ({ exams }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [rowData, setRowData] = useState({});
  const [showHideViewModal, setshowHideViewModal] = useState(false);
  const [changeLoading, setChangeLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const navigate = useNavigate();
  const handleChangeStatus = () => {
    setChangeLoading(true);
    const data_send = {
      ...rowData,
    };
    axios
      .post("", JSON.stringify(data_send))
      .then((res) => {
        if (res.status == 'success') {
          toast.success(res.message);
        } else if (res.status == 'error') {
          toast.error(res.message);
        } else {
          toast.error("Somthing Went Wrong");
        }
      })
      .finally(() => {
        setChangeLoading(false);
      })
      .catch((err) => console.log(err));
  };
  const handleChangeFolderDetails = () => {
    setEditLoading(true);
    const data_send = {
      ...rowData,
    };
    axios
      .post("", JSON.stringify(data_send))
      .then((res) => {
        if (res.status == 'success') {
          toast.success(res.message);
        } else if (res.status == 'error') {
          toast.error(res.message);
        } else {
          toast.error("Something Wen Wrong");
        }
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setEditLoading(false);
      });
  };
  const permissions = userData?.permissions;
  return (
    <div className="folders">
      {exams?.length ? (
        exams?.map((item) => {
          return (
            <div
              className="folder"
              onClick={() =>
                permissions?.includes("*11_3") ||
                permissions?.startsWith("11_3") ||
                permissions == "all"
                  ? navigate("/images", {
                      state: {
                        folder_name: item,
                      },
                    })
                  : null
              }
            >
              <div className="icon">
                <img
                  src="https://static.vecteezy.com/system/resources/thumbnails/009/385/449/small/folder-icon-clipart-design-illustration-free-png.png"
                  alt=""
                />
              </div>
              <div className="name">{item}</div>
            </div>
          );
        })
      ) : (
        <h4>No Folders</h4>
      )}
      <Modal title="Change Folder Status" isOpen={showHideViewModal}>
        <ModalHeader
          toggle={() => {
            setshowHideViewModal(false);
          }}
        >
          <h4>Change Folder Status</h4>
        </ModalHeader>
        <ModalBody style={{ height: 'fit-content' }}>
          <h4>
            Are You Sure That You Want To{" "}
            {rowData.hidden == 'yes' ? 'view' : 'hide'} this folder ?
          </h4>
          <div
            style={{
              display: 'flex',
              marginTop: '80px',
              alignItems: 'center',
              gap: '10px',
              justifyContent: 'end',
            }}
          >
            <button
              className="btn btn-primary"
              onClick={() => {
                handleChangeStatus();
              }}
            >
              {changeLoading ? <AiOutlineLoading /> : 'Yes'}
            </button>
            <button
              style={{
                width: 'fit-content',
                backgroundColor: '#fa6374',
                color: 'white',
                padding: '10px',
                borderRadius: '6px',
              }}
              onClick={() => {
                setshowHideViewModal(false);
              }}
            >
              Cancel
            </button>
          </div>
        </ModalBody>
      </Modal>
      <Modal title="Edit Folder Details" isOpen={showEditModal}>
        <ModalHeader
          toggle={() => {
            setShowEditModal(false);
          }}
        >
          <h4>Change Folder Details</h4>
        </ModalHeader>
        <ModalBody style={{ height: 'fit-content' }}>
          <form>
            <label htmlFor="">Folder Name</label>
            <input
              style={{
                outline: 'none',
                width: '100%',
                marginBottom: '10px',
                padding: '10px',
                borderRadius: '4px',
                border: '1px solid #ccc',
              }}
              onChange={(e) => {
                setRowData({ ...rowData, folder_name: e.target.value });
              }}
              type="text"
              value={rowData.folder_name}
            />
          </form>
          <div
            style={{
              display: 'flex',
              marginTop: '80px',
              alignItems: 'center',
              gap: '10px',
              justifyContent: 'end',
            }}
          >
            <button
              className="btn btn-primary"
              onClick={() => {
                // handleChangeStatus()
                handleChangeFolderDetails();
              }}
            >
              {changeLoading ? <editLoading /> : 'Yes'}
            </button>
            <button
              style={{
                width: 'fit-content',
                backgroundColor: '#fa6374',
                color: 'white',
                padding: '10px',
                borderRadius: '6px',
              }}
              onClick={() => {
                setShowEditModal(false);
              }}
            >
              Cancel
            </button>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default ImageFolderTableList;
