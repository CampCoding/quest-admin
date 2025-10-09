import React, { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  useTable,
  useGlobalFilter,
  useAsyncDebounce,
  useSortBy,
  useFilters,
  useExpanded,
  usePagination,
} from "react-table";
import { Table, Row, Col, Button, Input } from "reactstrap";
import { Filter, DefaultColumnFilter } from "./filters";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

// Define a default UI for filtering
function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
  changeValue,
}) {
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = React.useState(globalFilter);
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);

  return (
    <Col sm={4}>
      <div className="search-box me-2 mb-2 d-inline-block">
        <div className="position-relative">
          <label htmlFor="search-bar-0" className="search-label">
            <span id="search-bar-0-label" className="sr-only">
              Search this table
            </span>
            <input
              onChange={(e) => {
                setValue(e.target.value);
                onChange(e.target.value);
                return changeValue ? changeValue(e.target.value) : null;
              }}
              id="search-bar-0"
              type="text"
              className="form-control"
              placeholder={`${count} records...`}
              value={value || ""}
            />
          </label>
          <i className="bx bx-search-alt search-icon"></i>
        </div>
      </div>
    </Col>
  );
}

const TableContainer = ({
  columns,
  isHidePagination,
  data,
  isGlobalFilter,
  isAddOptions,
  isHideCustCols,
  isAddUserList,
  handleOrderClicks,
  handleUserClick,
  handleCustomerClick,
  isAddCustList,
  customPageSize,
  className,
  customPageSizeOptions,
  changeValue,
}) => {
  const paramsString = window.location.href?.split("?")[1];
  const searchParams = new URLSearchParams(paramsString);
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state,
    preGlobalFilteredRows,
    setGlobalFilter,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      defaultColumn: { Filter: DefaultColumnFilter },
      initialState: {
        pageIndex: parseInt(
          searchParams.get("state") ? searchParams.get("state") : 0
        ),
        pageSize: customPageSize,
        sortBy: [
          {
            asc: true,
          },
        ],
      },
    },
    useGlobalFilter,
    useFilters,
    useSortBy,
    useExpanded,
    usePagination
  );

  const generateSortingIndicator = (column) => {
    return column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : "";
  };

  const onChangeInSelect = (event) => {
    setPageSize(Number(event.target.value));
  };
  const navigate = useNavigate(); // Get the navigate function from React Router
  const location = useLocation();

  const [locationState, setLocationState] = useState(location?.state);
  const onChangeInInput = (event) => {
    const page = event.target.value ? Number(event.target.value) - 1 : 0;
    setStateParam(
      (prevState) => {
        prevState.set("state", parseInt(page));
        return prevState;
      },
      { replace: true, state: location?.state }
    );

    gotoPage(page);
  };
  // useEffect(() => alert(pageIndex), [pageIndex]);
  const [stateParam, setStateParam] = useSearchParams({ state: 0 });

  useEffect(() => {
    gotoPage(stateParam?.get("state"));
  }, [stateParam]);

  return (
    <Fragment>
      <Row className="mb-2">
        {!isHideCustCols ? (
          <Col md={customPageSizeOptions ? 2 : 1}>
            <select
              className="form-select"
              value={pageSize}
              onChange={onChangeInSelect}
            >
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
          </Col>
        ) : null}
        {isGlobalFilter && (
          <GlobalFilter
            preGlobalFilteredRows={preGlobalFilteredRows}
            globalFilter={state.globalFilter}
            setGlobalFilter={setGlobalFilter}
            changeValue={changeValue}
          />
        )}
        {isAddOptions && (
          <Col sm="7">
            <div className="text-sm-end">
              <Button
                type="button"
                color="success"
                className="btn-rounded  mb-2 me-2"
                onClick={handleOrderClicks}
              >
                <i className="mdi mdi-plus me-1" />
                Add New Order
              </Button>
            </div>
          </Col>
        )}
        {isAddUserList && (
          <Col sm="7">
            <div className="text-sm-end">
              <Button
                type="button"
                color="primary"
                className="btn mb-2 me-2"
                onClick={handleUserClick}
              >
                <i className="mdi mdi-plus-circle-outline me-1" />
                Create New User
              </Button>
            </div>
          </Col>
        )}
        {isAddCustList && (
          <Col sm="7">
            <div className="text-sm-end">
              <Button
                type="button"
                color="success"
                className="btn-rounded mb-2 me-2"
                onClick={handleCustomerClick}
              >
                <i className="mdi mdi-plus me-1" />
                New Customers
              </Button>
            </div>
          </Col>
        )}
      </Row>

      <div className="table-responsive react-table">
        <Table bordered hover {...getTableProps()} className={className}>
          <thead className="table-light table-nowrap">
            {headerGroups.map((headerGroup) => (
              <tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th key={column.id}>
                    <div className="mb-2" {...column.getSortByToggleProps()}>
                      {column.render("Header")}
                      {generateSortingIndicator(column)}
                    </div>
                    <Filter column={column} />
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row);
              return (
                <Fragment key={row.getRowProps().key}>
                  <tr>
                    {row.cells.map((cell) => {
                      return (
                        <td key={cell.id} {...cell.getCellProps()}>
                          {cell.render("Cell")}
                        </td>
                      );
                    })}
                  </tr>
                </Fragment>
              );
            })}
          </tbody>
        </Table>
      </div>

      {!isHidePagination ? (
        <Row className="justify-content-md-end justify-content-center align-items-center">
          <Col className="col-md-auto">
            <div className="d-flex gap-1">
              <Button
                color="primary"
                onClick={() => {
                  setStateParam(
                    (prevState) => {
                      prevState.set("state", parseInt(0));
                      return prevState;
                    },
                    { replace: true, state: location?.state }
                  );
                }}
                disabled={!canPreviousPage}
              >
                {"<<"}
              </Button>
              <Button
                color="primary"
                onClick={() => {
                  setStateParam(
                    (prevState) => {
                      prevState.set(
                        "state",
                        parseInt(prevState.get("state")) - 1
                      );
                      return prevState;
                    },
                    { replace: true, state: location?.state }
                  );
                }}
                disabled={!canPreviousPage}
              >
                {"<"}
              </Button>
            </div>
          </Col>
          <Col className="col-md-auto d-none d-md-block">
            Page{" "}
            <strong>
              {parseInt(pageIndex) + 1} of {pageOptions.length}
            </strong>
          </Col>
          <Col className="col-md-auto">
            <Input
              type="number"
              min={1}
              style={{ width: 70 }}
              max={pageOptions.length}
              defaultValue={
                parseInt(
                  stateParam.get("state") ? stateParam.get("state") : 0
                ) + 1
              }
              onChange={onChangeInInput}
            />
          </Col>

          <Col className="col-md-auto">
            <div className="d-flex gap-1">
              <Button
                color="primary"
                onClick={() => {
                  setStateParam(
                    (prevState) => {
                      prevState.set(
                        "state",
                        parseInt(
                          prevState.get("state") ? prevState.get("state") : 0
                        ) + 1
                      );
                      return prevState;
                    },
                    { replace: true, state: location?.state }
                  );
                }}
                disabled={!canNextPage}
              >
                {">"}
              </Button>
              <Button
                color="primary"
                onClick={() => {
                  setStateParam(
                    (prevState) => {
                      prevState.set("state", parseInt(pageCount) - 1);
                      return prevState;
                    },
                    { replace: true, state: location?.state }
                  );
                }}
                disabled={!canNextPage}
              >
                {">>"}
              </Button>
            </div>
          </Col>
        </Row>
      ) : null}
    </Fragment>
  );
};

TableContainer.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
  changeValue: PropTypes.func,
};

export default TableContainer;
