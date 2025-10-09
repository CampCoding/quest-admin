import React from 'react';
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import TableContainer from '../../../components/Common/TableContainer';
import { CourseData } from '../../../CommonData/Data/Course';
import { LessonsData } from '../../../CommonData/Data/Lesson';

const TweetsTableList = ({
  columns,
  data,
  isHideCustCols,
  isHidePagination,
}) => {
  const navigate = useNavigate();

  return (
    <React.Fragment>
      <TableContainer
        columns={columns}
        data={data}
        isGlobalFilter={true}
        isHidePagination={isHidePagination}
        customPageSize={10}
        className="Invoice table"
        isHideCustCols={isHideCustCols ? true : false}
      />
    </React.Fragment>
  );
};

export default TweetsTableList;
