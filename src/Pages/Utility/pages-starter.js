import React from "react";

import { Container } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";

const StarterPage = () => {
  document.title = "Starter Page | Quest ";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs title="Utility" breadcrumbItem="Starter Page" />
        </Container>
      </div>
    </React.Fragment>
  );
};

export default StarterPage;
