import React from 'react';
import { useNavigate } from 'react-router-dom';
import TableContainer from '../../../components/Common/TableContainer';

const EbooksTableList = ({ columns, data }) => {
  return (
    <React.Fragment>
      <TableContainer
        columns={columns}
        data={data}
        // isGlobalFilter={true}
        customPageSize={10}
        className="Invoice table"
      />
    </React.Fragment>
  );
};

export default EbooksTableList;
