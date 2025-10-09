import React, { useEffect, useState } from "react";
import { Card, CardBody, Col, Container, Row } from "reactstrap";
import TableContainer from "../../components/Common/TableContainer";
import { Table } from "antd";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const MarketOffers = () => {
  const { marketplace_id } = useParams();

  const getMarketOffers = async () => {
    const dataSend = {
      marketplace_id: marketplace_id,
    };
    await axios
      .post(
        "https://camp-coding.tech/quest/platform/admin/marketplace/select_marketplace_orders.php",
        JSON.stringify(dataSend)
      )
      .then((res) => {
        console.log(res);

        if (res?.status == "success") {
          setOffers(res?.message);
        } else {
          toast.error(res?.message);
        }
      })
      .catch((e) => console.log(e));
  };

  const handelActivte = (order_id, status) => {
    const dataSend = {
      order_id: order_id,
      status: status,
    };
    axios
      .post(
        `https://camp-coding.tech/quest/platform/admin/marketplace/change_status_order.php`,
        JSON.stringify(dataSend)
      )
      .then((res) => {
        console.log(res);

        if (res?.status == "success") {
          toast.success(res?.message);
          getMarketOffers();
        } else {
          toast.error(res?.message);
        }
      })
      .catch((e) => console.log(e));
  };

  const columns = [
    {
      title: "Order ID",
      dataIndex: "order_id",
      key: "order_id",
    },
    {
      title: "Student ID",
      dataIndex: "student_id",
      key: "student_id",
    },

    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Item Image",
      dataIndex: "item",
      key: "item",
      render: (item) => <img src={item} alt="item" style={{ width: 60 }} />,
    },
    {
      title: "Points",
      dataIndex: "points",
      key: "points",
    },
    {
      title: "Order Date",
      dataIndex: "order_date",
      key: "order_date",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Action",
      dataIndex: "x",
      key: "x",
      render: (_, row) => {
        return (
          <>
            {row?.status == "pending" ? (
              <>
                <button
                  className="btn btn-success"
                  style={{ marginInline: "10px" }}
                  onClick={() => handelActivte(row?.order_id, "approved")}
                >
                  approve
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handelActivte(row?.order_id, "rejected")}
                >
                  reject
                </button>
              </>
            ) : row?.status == "approved" ? (
              <>
                <button
                  className="btn btn-danger"
                  onClick={() => handelActivte(row?.order_id, "rejected")}
                >
                  reject
                </button>
              </>
            ) : (
              <button
                className="btn btn-success"
                onClick={() => handelActivte(row?.order_id, "approved")}
              >
                approve
              </button>
            )}
          </>
        );
      },
    },
  ];

  const [Offers, setOffers] = useState([]);

  useEffect(() => {
    getMarketOffers();
  }, []);
  console.log(Offers);

  return (
    <>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs
            title="Marked place"
            breadcrumbItem="Marked place List offers"
          />
          <Row>
            <Col lg={12}>
              <Card>
                <CardBody style={{ overflowX: "auto" }}>
                  <Table
                    style={{ minWidth: "800px" }}
                    columns={columns}
                    dataSource={Offers}
                  />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default MarketOffers;
