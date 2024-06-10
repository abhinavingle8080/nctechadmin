import moment from 'moment';
import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';

// @mui
import { useTheme } from '@mui/material/styles';
import {
  Card,
  Stack,
  Table,
  Button,
  Select,
  MenuItem,
  Container,
  TableBody,
  InputLabel,
  Typography,
  FormControl,
  TableContainer,
  TablePagination,
} from '@mui/material';

import Swal from 'sweetalert2';

// apis
import { getLeavesApi, deleteLeaveApi } from 'src/apis/admin/leave/LeaveApis';

// Components
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import TableNoData from '../../../../sections/leave/table-no-data';
import LeaveTableRow from '../../../../sections/leave/leave-table-row';
import LeaveTableHead from '../../../../sections/leave/leave-table-head';
import TableEmptyRows from '../../../../sections/leave/table-empty-rows';
import HeaderBreadcrumbs from '../../../../components/HeaderBreadcrumbs';
import LeaveTableToolbar from '../../../../sections/leave/leave-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../../../../sections/leave/utils';
// ----------------------------------------------------------------------

export default function Leaves() {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [count, setCount] = useState(0);
  const [leaves, setLeaves] = useState([]);
  const [payload, setPayload] = useState({
    page: 1,
    limit: 5,
    search: '',
    status: '', // Adding status to payload
  });

  useEffect(() => {
    getLeaves(payload);
  }, [payload]);

  const getLeaves = async (data) => {
    getLeavesApi(data)
      .then((res) => {
        setLeaves(res.data.data.rows);
        setCount(res.data.data.count);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleStatusFilterChange = (event) => {
    setPayload({
      ...payload,
      page: 1,
      status: event.target.value, // Update status in payload
    });
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = leaves.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
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

  const handleChangePage = (event, newPage) => {
    setPayload({
      ...payload,
      page: newPage + 1,
    });
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
    setPayload({
      ...payload,
      limit: parseInt(event.target.value, 10),
    });
  };

  const handleFilterByName = (event) => {
    setPayload({
      ...payload,
      page: 1,
      search: event.target.value,
    });
  };

  const dataFiltered = applyFilter({
    inputData: leaves,
    comparator: getComparator(order, orderBy),
    filterName: payload.search,
  });

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this Leave!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
      cancelButtonColor: theme.palette.error.main,
      confirmButtonColor: theme.palette.success.main,
    }).then((result) => {
      if (result.isConfirmed) {
        deleteLeaveApi({ leave_id: id })
          .then((res) => {
            if (res?.data?.success) {
              Swal.fire('Deleted!', res?.data?.message, 'success');
              getLeaves(payload);
            } else {
              Swal.fire('Error!', res?.data?.message, 'error');
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'Your Leave is safe :)', 'error');
      }
    });
  };

  const notFound = !dataFiltered.length && !payload.search;

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <HeaderBreadcrumbs
          heading="Leave"
          links={[
            { name: 'Dashboard', href: '/admin/dashboard' },
            { name: 'Leave', href: '/admin/leaves' },
            { name: 'Leave List' },
          ]}
        />
        <Button
          variant="contained"
          to="/admin/leaves/add"
          component={RouterLink}
          color="inherit"
          startIcon={<Iconify icon="eva:plus-fill" />}
        >
          New Leave
        </Button>
      </Stack>

      <Card>
        <LeaveTableToolbar
          numSelected={selected.length}
          filterName={payload.search}
          onFilterName={handleFilterByName}
          statusFilterValue={payload.status}
          onStatusFilterChange={handleStatusFilterChange}
        />
     

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 900 }}>
              <LeaveTableHead
                order={order}
                orderBy={orderBy}
                rowCount={count}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'applicant', label: 'Applicant' },
                  { id: 'start_date', label: 'Start Date' },
                  { id: 'end_date', label: 'End Date' },
                  { id: 'duration', label: 'Duration' },
                  { id: 'reason', label: 'Reason' },
                  { id: 'status', label: 'Status' },
                  { id: 'action', label: 'Action', align: 'right' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .map((row) => (
                    <LeaveTableRow
                      key={row.id}
                      name={`${row.Employee.first_name} ${row.Employee.last_name}`}
                      duration={
                        row.LeaveDays.length === 1
                          ? `${row.LeaveDays.length} Day`
                          : `${row.LeaveDays.length} Days`
                      }
                      start_date={row.start_date}
                      end_date={row.end_date}
                      reason={row.reason}
                      status={row.status}
                      selected={selected.indexOf(row.name) !== -1}
                      handleClick={(event) => handleClick(event, row.name)}
                      onEdit={`/admin/leaves/${row.id}/edit`}
                      onView={`/admin/leaves/${row.id}/view`}
                      onDelete={() => handleDelete(row.id)}
                    />
                  ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, count)}
                />

                {notFound && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={count}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
}
