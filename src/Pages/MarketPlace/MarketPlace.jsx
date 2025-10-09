import React, { useState, useEffect } from "react";
import { Card, CardBody, Col, Container, Row } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import axios from "axios";
import MarkedPlaceContainer from "./MarkedPlaceContainer";
import { Drawer } from "antd";
import { toast } from "react-toastify";

const MarketPlace = () => {
  const [univs, setUnivs] = useState([]);
  const [selectedUnivs, setSelectedUnivs] = useState(false);
  const [AddNewOffer, setAddNewOffer] = useState(false);
  const [EditMarketPlaceData, setEditMarketPlaceData] = useState(null);
  const [EditMarketPlaceModal, setEditMarketPlaceModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [NewMarketPlaceData, setNewMarketPlaceData] = useState({
    title: null,
    item: null, // image from uploader
    points: null,
  });

  const getUnivs = async () => {
    const selct_univs = await axios.get(
      "https://camp-coding.tech/quest/platform/admin/universities/select_universities_grade.php"
    );
    setUnivs(selct_univs.message);
  };

  useEffect(() => {
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
    if (selectedUnivs) {
      getFilterGrades();
    } else {
      setFilterGrades(false);
    }
  }, [selectedUnivs]);

  console.log(filterGrades);
  const [base64Image, setBase64Image] = useState("");

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

  console.log(base64Image);

  const [MarketPlaces, setMarketPlaces] = useState([]);
  const getMarketPlaces = () => {
    axios
      .get(
        `https://camp-coding.tech/quest/platform/admin/marketplace/select_marketplace.php`
      )
      .then((res) => {
        console.log(res);

        if (res?.status == "success") {
          setMarketPlaces(res?.message);
        } else {
          toast.error(res?.message);
        }
      })
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    getMarketPlaces();
  }, []);

  console.log(MarketPlaces);

  const handelAddMarketPlace = async () => {
    setLoading(true);
    let imgUrl;
    if (!NewMarketPlaceData?.item) {
      return toast.error("you must chosse an image");
    } else {
      const formData = new FormData();
      formData.append("image", NewMarketPlaceData?.item);
      await axios
        .post(
          `https://camp-coding.tech/quest/platform/admin/image_uplouder.php`,
          formData
        )
        .then((res) => {
          imgUrl = res;
        });
    }

    const dataSend = {
      item: imgUrl,
      title: NewMarketPlaceData?.title,
      points: NewMarketPlaceData?.points,
    };

    console.log(dataSend);

    axios
      .post(
        `https://camp-coding.tech/quest/platform/admin/marketplace/add_marketplace.php`,
        JSON.stringify(dataSend)
      )
      .then((res) => {
        console.log(res);

        if (res?.status == "success") {
          toast.success(res?.message);
          getMarketPlaces();
          setAddNewOffer(false);
        } else {
          toast.error(res?.message);
        }
      })
      .catch((e) => console.log(e));
    setLoading(false);
  };

  return (
    <>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs
            title="Marked place"
            breadcrumbItem="Marked place List"
          />
          {/* <div className="univs">
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
          </div> */}

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

          <div className="action_btns">
            <button
              className="btn btn-success"
              onClick={() => setAddNewOffer(true)}
            >
              Add
            </button>
          </div>
          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <MarkedPlaceContainer
                    data={MarketPlaces}
                    getData={getMarketPlaces}
                    // openEditModal={EditMarketPlaceModal}
                    // setopenEditModal={setEditMarketPlaceModal}
                  />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      <Drawer
        title="Add new Offer"
        closable={{ "aria-label": "Close Button" }}
        onClose={() => setAddNewOffer(false)}
        open={AddNewOffer}
        footer={
          <>
            <button
              className="btn btn-success w-100"
              onClick={handelAddMarketPlace}
            >
              {loading ? "loading..." : "Add"}
            </button>
          </>
        }
      >
        <p style={{ fontSize: "22px" }}>Add new Offer</p>
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
              setNewMarketPlaceData({
                ...NewMarketPlaceData,
                item: e.target.files[0],
              });
            }}
          />
        </div>
        <img src={base64Image} style={{ width: "100%" }} alt="" />
        <div className="mb-3">
          <label className="form-label" htmlFor="price">
            Offer points
          </label>
          <input
            type="number"
            className="form-control"
            placeholder="Enter percentage"
            style={{ border: ".1px solid #49505794" }}
            value={NewMarketPlaceData?.points}
            onChange={(e) => {
              setNewMarketPlaceData({
                ...NewMarketPlaceData,
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
            placeholder="Enter percentage"
            value={NewMarketPlaceData?.title}
            style={{ border: ".1px solid #49505794" }}
            onChange={(e) => {
              setNewMarketPlaceData({
                ...NewMarketPlaceData,
                title: e.target.value,
              });
            }}
          />
        </div>
      </Drawer>
    </>
  );
};

export default MarketPlace;
