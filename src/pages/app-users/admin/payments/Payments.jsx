import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import moment from 'moment';

// @mui
import { useTheme } from '@mui/material/styles';
import {
  Card,
  Stack,
  Table,
  Button,
  Container,
  TableBody,
  TableContainer,
  TablePagination,
} from '@mui/material';

import Swal from 'sweetalert2';

// Components
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import TableNoData from '../../../../sections/user/table-no-data';
import TableEmptyRows from '../../../../sections/user/table-empty-rows';
import HeaderBreadcrumbs from '../../../../components/HeaderBreadcrumbs';
import UserTableToolbar from '../../../../sections/user/user-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../../../../sections/user/utils';
import UserTableHead from '../../../../sections/user/user-table-head';
import UserTableRow from '../../../../sections/user/user-table-row';

// Mock Data
const mockPayments = [
  { id: 1, studentName: 'Sagar Wakekar', course: 'Java', paymentAmount: 10000, date: '2022-01-01', status: 'Completed' },
  { id: 2, studentName: 'Diksha Sapkal', course: 'Python', paymentAmount: 5000, date: '2022-02-01', status: 'Pending' },
  { id: 3, studentName: 'Tanvi Shrivastav', course: 'React js', paymentAmount: 10000, date: '2022-01-01', status: 'Completed' },
  { id: 4, studentName: 'Vaishnavi Misal', course: 'CoreJava', paymentAmount: 10000, date: '2022-01-01', status: 'Failed' },
  // Add more mock data as needed
];

export default function Payments() {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('studentName');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [count, setCount] = useState(0);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    setPayments(mockPayments);
    setCount(mockPayments.length);
  }, []);

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = payments.map((n) => n.studentName);
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
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const dataFiltered = applyFilter({
    inputData: payments,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this Payment!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
      cancelButtonColor: theme.palette.error.main,
      confirmButtonColor: theme.palette.success.main,
    }).then((result) => {
      if (result.isConfirmed) {
        setPayments(payments.filter((payment) => payment.id !== id));
        Swal.fire('Deleted!', 'Your payment has been deleted.', 'success');
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'Your payment is safe :)', 'error');
      }
    });
  };

  const notFound = !dataFiltered.length && !filterName;

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <HeaderBreadcrumbs
          heading="Payments"
          links={[
            { name: 'Dashboard', href: '/admin/dashboard'},
            { name: 'Payment', href: '/admin/payments' },
            { name: 'Payment List' },
          ]}
        />
        <Button
          variant="contained"
          to="/admin/payments/add"
          component={RouterLink}
          color="inherit"
          startIcon={<Iconify icon="eva:plus-fill" />}
        >
          New Payment
        </Button>
      </Stack>

      <Card>
        <UserTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <UserTableHead
                order={order}
                orderBy={orderBy}
                rowCount={count}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'studentName', label: 'Student Name' },
                  { id: 'course', label: 'Course' },
                  { id: 'paymentAmount', label: 'Payment Amount' },
                  { id: 'date', label: 'Date', align: 'center' },
                  { id: 'status', label: 'Status' },
                  { id: 'action', label: 'Action', align: 'center' },
                ]}
              />
              <TableBody>
                {dataFiltered.map((row) => (
                  <UserTableRow
                    key={row.id}
                    name={row.studentName}
                    course={row.course}
                    paymentAmount={row.paymentAmount}
                    date={moment(row.date).format('DD/MM/YYYY')}
                    status={row.status}
                    selected={selected.indexOf(row.studentName) !== -1}
                    handleClick={(event) => handleClick(event, row.studentName)}
                    onEdit={`/admin/payments/${row.id}/edit`}
                    onView={`/admin/payments/${row.id}/view`}
                    onDelete={() => handleDelete(row.id)}
                  />
                ))}

                <TableEmptyRows height={77} emptyRows={emptyRows(page, rowsPerPage, count)} />

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
