import React from "react";

import { Container } from "reactstrap";

import { userData } from "../../store/getProfileData";

const Dashboard = () => {
  document.title = "Dashboard | Quest";
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true} className="home-page-content">
          {/* <img
            src="https://res.cloudinary.com/duovxefh6/image/upload/v1705311791/Logo_set-04_1_kqlnem.svg"
            alt=""
          /> */}
          <p style={{ fontSize: "250px", color: "#04eb71" }}>Q</p>
          <div className="welocme">
            {" "}
            <span style={{ color: "#04eb71" }}>Welcome Dr.</span>
            <p style={{ margin: 0 }}>{userData?.user_name}..!</p>
          </div>
          <div style={{ color: "#04eb71" }} className="server-type ">
            - Server 1 -
          </div>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Dashboard;
