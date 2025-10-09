import React from 'react';
import { useNavigate } from 'react-router-dom';
import TableContainer from '../../../components/Common/TableContainer';

const FlashCardsTableList = ({ columns, data }) => {
  const navigate = useNavigate();

  return (
    <React.Fragment>
      {/*  */}
      <TableContainer
        columns={columns}
        data={data}
        isGlobalFilter={true}
        customPageSize={10}

        className="Invoice table"
      />
    </React.Fragment>
  );
};

export default FlashCardsTableList;
