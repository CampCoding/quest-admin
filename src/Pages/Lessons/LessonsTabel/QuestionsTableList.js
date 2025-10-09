import React from 'react';
import { useNavigate } from 'react-router-dom';
import TableContainer from '../../../components/Common/TableContainer';

const QuestionsTableList = ({
  size,
  columns,
  data,
  isHideCustCols,
  isHidePagination,
}) => {
  const navigate = useNavigate();
  // const columns =
  //     [
  //         {
  //             Header: 'Course ID',
  //             accessor: 'id',
  //             Filter: false,
  //         },
  //         {
  //             Header: 'Type',
  //             accessor: 'type',
  //             Filter: false,
  //         },

  //         {
  //             Header: 'Date',
  //             accessor: 'date',
  //             Filter: false,
  //         },
  //         {
  //             Header: 'lesson Name',
  //             accessor: 'lesson_name',
  //         },
  //         {
  //             Header: 'Duration',
  //             accessor: 'duration',
  //             Filter: false,
  //         },
  //         {
  //             Header: 'Action',
  //             Cell: (cell) => {
  //                 return (
  //                     <>
  //                         <UncontrolledDropdown>
  //                             <DropdownToggle className="btn btn-light btn-sm" tag="button" data-bs-toggle="dropdown" direction="start">
  //                                 <i className="bx bx-dots-horizontal-rounded"></i>
  //                             </DropdownToggle>
  //                             <DropdownMenu className="dropdown-menu-end">
  //                                 <DropdownItem>Edit</DropdownItem>
  //                                 <DropdownItem
  //                                   // onClick={()=>{
  //                                   //
  //                                   //   navigate("/units",{state:{coursedata:cell.cell.row.original}})
  //                                   // }}
  //                                 >Show</DropdownItem>
  //                                 <DropdownItem>Delete</DropdownItem>
  //                             </DropdownMenu>
  //                         </UncontrolledDropdown>
  //                     </>
  //                 )
  //             }
  //         },
  //     ]
  return (
    <React.Fragment>
      <TableContainer
        isHidePagination={isHidePagination}
        columns={columns}
        data={data}
        isHideCustCols={isHideCustCols ? true : false}
        isGlobalFilter={true}
        customPageSize={size ? size : 10}
        className="Invoice table"
      />
    </React.Fragment>
  );
};

export default QuestionsTableList;
