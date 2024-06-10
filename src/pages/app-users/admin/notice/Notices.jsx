import moment from 'moment';
import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';

// @mui
import { useTheme } from '@mui/material/styles';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import Swal from 'sweetalert2';

// apis
// Assuming you have APIs for fetching and deleting notices
import { getNoticesApi, deleteNoticeApi } from 'src/apis/admin/notice/NoticeApis';
import Iconify from 'src/components/iconify';

// Components
// Assuming you have components like NoticeTableRow, NoticeTableHead, NoticeTableToolbar, etc.
import TableEmptyRows from 'src/sections/notice/table-empty-rows';
import NoticeTableRow from '../../../../sections/notice/notice-table-row';
import NoticeTableHead from '../../../../sections/notice/notice-table-head';
import NoticeTableToolbar from '../../../../sections/notice/notice-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../../../../sections/notice/utils';
import HeaderBreadcrumbs from '../../../../components/HeaderBreadcrumbs';
// Other imports...

export default function Notices() {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('date_posted');
  const [filterTitle, setFilterTitle] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [count, setCount] = useState(0);
  const [notices, setNotices] = useState([]);
  const [payload, setPayload] = useState({
    page: 1,
    limit: 5,
    search: '',
  });

  useEffect(() => {
    // Replace the function call with your actual API call to fetch notices
    getNotices(payload);
  }, [payload]);

  const getNotices = async (data) => {
    // Replace the API call with your actual API call to fetch notices
    getNoticesApi(data)
      .then((res) => {
        setNotices(res.data.data.rows);
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

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = notices.map((n) => n.title);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, title) => {
    const selectedIndex = selected.indexOf(title);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, title);
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

  const handleFilterByTitle = (event) => {
    setPayload({
      ...payload,
      page: 1,
      search: event.target.value,
    });
  };

//   Assuming you have functions like applyFilter, getComparator, emptyRows
//   Replace these with your actual utility functions

  const dataFiltered = applyFilter({
    inputData: notices,
    comparator: getComparator(order, orderBy),
    filterName: payload.search,
  });

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this Notice!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
      cancelButtonColor: theme.palette.error.main,
      confirmButtonColor: theme.palette.success.main,
    }).then((result) => {
      if (result.isConfirmed) {
        // Replace the API call with your actual API call to delete a notice
        deleteNoticeApi({ notice_id: id })
          .then((res) => {
            if (res?.data?.success) {
              Swal.fire('Deleted!', res?.data?.message, 'success');
              getNotices(payload);
            } else {
              Swal.fire('Error!', res?.data?.message, 'error');
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'Your Notice is safe :)', 'error');
      }
    });
  };

  const notFound = !dataFiltered.length && !payload.search;

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        {/* Replace 'HeaderBreadcrumbs' with your actual component */}
        <HeaderBreadcrumbs
          heading="Notice"
          links={[
            { name: 'Dashboard', href: '/admin/dashboard' },
            { name: 'Notice', href: '/admin/notices' },
            { name: 'Notice List' },
          ]}
        />
        <Button
          variant="contained"
          to="/admin/notices/add"
          component={RouterLink}
          color="inherit"
          // Replace 'Iconify' with your actual component or icon library
          startIcon={<Iconify icon="eva:plus-fill" />}
        >
          New Notice
        </Button>
      </Stack>

      <Card>
        {/* Replace 'NoticeTableToolbar' with your actual component */}
        <NoticeTableToolbar
          numSelected={selected.length}
          filterTitle={payload.search}
          onFilterTitle={handleFilterByTitle}
        />

        {/* Replace 'NoticeTableRow', 'NoticeTableHead', etc. with your actual components */}
        <TableContainer sx={{ overflow: 'unset' }}>
          <Table sx={{ minWidth: 800 }}>
            <NoticeTableHead
              order={order}
              orderBy={orderBy}
              rowCount={count}
              numSelected={selected.length}
              onRequestSort={handleSort}
              onSelectAllClick={handleSelectAllClick}
              headLabel={[
                { id: 'title', label: 'Title' },
                { id: 'date_posted', label: 'Date Posted' },
                { id: 'content', label: 'Content' },
                // { id: 'posted_by', label: 'Posted By' },
                { id: 'expiration_date', label: 'Expiration Date' },
                { id: 'category', label: 'Category' },
                // { id: 'tags', label: 'Tags' },
                // { id: 'attachments', label: 'Attachments' },
                { id: 'status', label: 'Status' },
                { id: 'visibility', label: 'Visibility' },

                // { id: 'priority', label: 'Priority' },
                { id: 'actions', label: 'Actions', alignRight: true },
              
              ]}
            />
            <TableBody>
              {dataFiltered.map((row) => (
                // Replace 'NoticeTableRow' with your actual component
                <NoticeTableRow
                  key={row.id}
                  title={row.title}
                  datePosted={moment(row.date_posted).format('MMMM Do YYYY')}
                  content={row.content}
                  postedBy={row.posted_by}
                  expirationDate={moment(row.expiration_date).format('MMMM Do YYYY')}
                  category={row.category}
                  tags={row.tags}
                  visibility={row.visibility}
                  attachments={row.attachments}
                  status={row.status}
                  priority={row.priority}
                  selected={selected.indexOf(row.title) !== -1}
                  handleClick={(event) => handleClick(event, row.title)}
                  // Assuming you have edit and view links for notices
                  onEdit={`/admin/notices/${row.id}/edit`}
                  onView={`/admin/notices/${row.id}/view`}
                  onDelete={() => handleDelete(row.id)}
                />
                
              ))}

              <TableEmptyRows
                height={77}
                emptyRows={emptyRows(payload.page - 1, rowsPerPage, count)}
              />

              {notFound && <Typography>No notices found.</Typography>}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          page={payload.page - 1}
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
