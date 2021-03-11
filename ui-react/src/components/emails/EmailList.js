import React from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Checkbox from "@material-ui/core/Checkbox";
import Paper from "@material-ui/core/Paper";
import { useQuery, gql } from "@apollo/client";
import "../../UserList.css";
import { withStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import TablePagination from "@material-ui/core/TablePagination";
import { TableSortLabel, Typography, TextField } from "@material-ui/core";
import { useMutation } from "@apollo/client";

import DeleteEmailDialog from "../dialogs/delete-email-dialog";

const styles = (theme) => ({
  root: {
    maxWidth: "100%",
    marginTop: theme.spacing(3),
    overflowX: "auto",
    margin: "auto",
  },
  table: {
    minWidth: 700,
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    minWidth: 300,
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },
});

const GET_EMAILS = gql`
  query emailsPaginateQuery(
    $first: Int
    $offset: Int
    $orderByMe: String
    $filter: String
  ) {
    email(
      first: $first
      offset: $offset
      orderByMe: $orderByMe
      filter: $filter
    ) {
      id
      subject
      content
      sent_by_user {
        to {
          first_name
          last_name
        }
      }
      sent_to_contact {
        to {
          first_name
          last_name
        }
      }
    }
  }
`;

const GET_EMAILS_COUNT = gql`
  query emailsCountQuery {
    getEmailCount
  }
`;

const UPDATE_COMPANY = gql`
  mutation updateEmail($field: String, $value: String, $emailId: String) {
    updateEmail(field: $field, value: $value, emailId: $emailId) {
      id
    }
  }
`;

const headCells = [
  {
    id: "node.name",
    numeric: false,
    disablePadding: false,
    label: "Name",
  },
  {
    id: "node.created_at",
    numeric: false,
    disablePadding: false,
    label: "Create Date",
  },
  {
    id: "owner.first_name",
    numeric: false,
    disablePadding: false,
    label: "Email Owner",
  },
];

function EmailList(props) {
  const { classes, numSelected, rowCount, onRequestSort } = props;
  const [selected, setSelected] = React.useState([]);
  const [order, setOrder] = React.useState("asc");
  const [orderByMe, setOrderByMe] = React.useState("node.name");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [filterState, setFilterState] = React.useState({ emailFilter: "" });
  const [field, setField] = React.useState(false);
  const [fieldValue, setFieldValue] = React.useState(false);
  const [engaged, setEngaged] = React.useState(false);
  const [isEditMode, setIsEditMode] = React.useState({});
  const [emailId, setEmailId] = React.useState(false);

  const [
    openDeleteDialogComponent,
    setOpenDeleteDialogComponent,
  ] = React.useState(false);

  const handleCloseDeleteDialogComponent = () => {
    setOpenDeleteDialogComponent(false);
  };

  const callDeleteDialog = (id) => {
    setOpenDeleteDialogComponent(true);
    setEmailId(id);
  };

  const getFilter = () => {
    return filterState.emailFilter.length > 0
      ? "*" + filterState.emailFilter + "*"
      : "*";
  };

  const handleChange = (event) => {
    event.preventDefault();
    setField(event.target.id);
    setFieldValue(event.target.value);
  };

  let variables = {
    first: rowsPerPage,
    offset: rowsPerPage * page,
    orderByMe: `${orderByMe} ${order}`,
    filter: getFilter(),
  };

  let { loading, data, error, refetch } = useQuery(GET_EMAILS, {
    variables: variables,
  });

  const createSortHandler = (property) => (event) => {
    handleRequestSort(event, property);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderByMe === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderByMe(property);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleFilterChange = (filterName) => (event) => {
    const val = event.target.value;
    setFilterState((oldFilterState) => ({
      ...oldFilterState,
      [filterName]: val,
    }));
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const {
    loading: emailsCountQueryLoading,
    data: emailsCount,
    error: emailsCountQueryError,
  } = useQuery(GET_EMAILS_COUNT);

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const handleCancel = (event) => {
    event.preventDefault();
    setEngaged(false);
    setIsEditMode({});
  };

  const emailUpdate = (id, index) => {
    if (!!field && fieldValue !== data.email[index][field]) {
      updateEmail({
        variables: {
          field: "email." + field,
          value: fieldValue,
          emailId: id,
        },
      });
    }
    setIsEditMode({});
    setEngaged(false);
  };

  const [
    updateEmail,
    { loading: cndMutationLoading, error: cndQMutationError },
  ] = useMutation(UPDATE_COMPANY, {
    update: () => refetch(),
  });

  return (
    <Paper className={classes.root}>
      <Typography variant="h2" gutterBottom>
        Email List
      </Typography>
      <TextField
        id="search"
        label="Email Name Contains"
        className={classes.textField}
        value={filterState.emailFilter}
        onChange={handleFilterChange("emailFilter")}
        margin="normal"
        variant="outlined"
        type="text"
        InputProps={{
          className: classes.input,
        }}
      />
      <Link variant="body2" color="primary" to="/email/create">
        <Button color="primary" type="button">
          New Email
        </Button>
      </Link>
      {loading && !error && <p>Loading...</p>}
      {error && !loading && <p>Error</p>}

      {data && !loading && !error && (
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={numSelected > 0 && numSelected < rowCount}
                  checked={rowCount > 0 && numSelected === rowCount}
                  // onChange={handleSelectAllClick}
                  inputProps={{
                    "aria-label": "select all emails",
                  }}
                />
              </TableCell>
              {headCells.map((headCell) => (
                <TableCell
                  key={headCell.id}
                  align={headCell.numeric ? "right" : "left"}
                  padding={headCell.disablePadding ? "none" : "default"}
                  sortDirection={orderByMe === headCell.id ? order : false}
                >
                  <TableSortLabel
                    active={orderByMe === headCell.id}
                    direction={orderByMe === headCell.id ? order : "asc"}
                    onClick={createSortHandler(headCell.id, false)}
                  >
                    {headCell.label}
                    {orderByMe === headCell.id ? (
                      <span className={classes.visuallyHidden}>
                        {order === "desc"
                          ? "sorted descending"
                          : "sorted ascending"}
                      </span>
                    ) : null}
                  </TableSortLabel>
                </TableCell>
              ))}
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.email.map(
              (
                {
                  __typename,
                  id,
                  name,
                  employees_num,
                  property_type,
                  phone,
                  created_at,
                  owner,
                },
                index
              ) => {
                const isItemSelected = isSelected(id);
                const labelId = `enhanced-table-checkbox-${id}`;
                return (
                  <TableRow
                    key={__typename + "-" + id}
                    hover
                    onClick={(event) => handleClick(event, id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    selected={isItemSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isItemSelected}
                        inputProps={{ "aria-labelledby": labelId }}
                      />
                    </TableCell>
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                    >
                      {__typename.toString() === "Email" ? (
                        <Link className="edit-link" to={"/emails/" + id}>
                          {name}-{__typename.toString()}
                        </Link>
                      ) : (
                        <Link className="edit-link" to={"/emails/" + id}>
                          {name}-{__typename.toString()}
                        </Link>
                      )}
                    </TableCell>
                    <TableCell>
                      {employees_num ? employees_num : "no employees_num yet"}
                    </TableCell>
                    <TableCell align="left" className={classes.tableCell}>
                      {isEditMode["lead_status"] &&
                      isEditMode["lead_status"]["id"] === id ? (
                        <>
                          <TextField
                            label="lead status"
                            onChange={handleChange}
                            id="lead_status"
                            defaultValue={property_type}
                          />
                          <br />
                          <Button
                            color="primary"
                            onClick={() => emailUpdate(id, index)}
                          >
                            Update
                          </Button>
                          <Button color="secondary" onClick={handleCancel}>
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <span
                          id={index}
                          onDoubleClick={(event) => {
                            event.preventDefault();
                            if (!engaged) {
                              setIsEditMode({ property_type: { id: id } });
                              setEngaged(true);
                            } else return;
                          }}
                        >
                          {property_type ? property_type : "no lead status yet"}
                        </span>
                      )}
                    </TableCell>
                    <TableCell align="left" className={classes.tableCell}>
                      {isEditMode["phone"] &&
                      isEditMode["phone"]["id"] === id ? (
                        <>
                          <TextField
                            label="phone"
                            onChange={handleChange}
                            id="phone"
                            defaultValue={phone}
                          />
                          <br />
                          <Button
                            color="primary"
                            onClick={() => emailUpdate(id, index)}
                          >
                            Update
                          </Button>
                          <Button color="secondary" onClick={handleCancel}>
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <span
                          id={index}
                          onDoubleClick={(event) => {
                            event.preventDefault();
                            if (!engaged) {
                              setIsEditMode({ phone: { id: id } });
                              setEngaged(true);
                            } else return;
                          }}
                        >
                          {phone ? phone : "no phone"}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {created_at ? created_at.formatted : "no date yet"}
                    </TableCell>

                    <TableCell>
                      {owner
                        ? `${owner.first_name} ${owner.last_name}`
                        : "no owner yet"}
                    </TableCell>
                    <TableCell>
                      <Button onClick={() => callDeleteDialog(id)}>
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              }
            )}
          </TableBody>
        </Table>
      )}
      {emailsCountQueryLoading && !emailsCountQueryError && <p>Loading...</p>}
      {emailsCountQueryError && !emailsCountQueryLoading && <p>Error</p>}

      {emailsCount && !emailsCountQueryLoading && !emailsCountQueryError && (
        <TablePagination
          component="div"
          count={emailsCount.getEmailCount}
          page={page}
          onChangePage={handleChangePage}
          rowsPerPage={rowsPerPage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      )}

      <DeleteEmailDialog
        key={"DeleteEmail"}
        isOpen={openDeleteDialogComponent}
        handleClose={handleCloseDeleteDialogComponent}
        emailId={emailId}
        title="Email"
        refetch={refetch}
      ></DeleteEmailDialog>
    </Paper>
  );
}

export default withStyles(styles)(EmailList);
