import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import moment from 'moment';

// @mui
import { useTheme } from '@mui/material/styles';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import Swal from 'sweetalert2';

// APIs
import { getCoursesApi, deleteCourseApi } from 'src/apis/admin/course/CourseApis';

// Components
import Iconify from 'src/components/Iconify';
import Scrollbar from 'src/components/Scrollbar';

import TableNoData from 'src/sections/course/table-no-data';
import CourseTableRow from 'src/sections/course/course-table-row';
import CourseTableHead from 'src/sections/course/course-table-head';
import TableEmptyRows from 'src/sections/course/table-empty-rows';
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs';
import CourseTableToolbar from 'src/sections/course/course-table-toolbar';
import { emptyRows, applyFilter, getComparator } from 'src/sections/course/utils';

export default function Courses() {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [count, setCount] = useState(0);
  const [courses, setCourses] = useState([]);
  const [payload, setPayload] = useState({
    page: 1,
    limit: 5,
    search: '',
  });

  useEffect(() => {
    getCourses(payload);
  }, [payload]);

  const getCourses = async (data) => {
    try {
      const res = await getCoursesApi(data);
      setCourses(res.data.data.rows);
      setCount(res.data.data.count);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(id);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = courses.map((n) => n.course_name);
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
    const newRowsPerPage = parseInt(event.target.value, 10);
    setPage(0);
    setRowsPerPage(newRowsPerPage);
    setPayload({
      ...payload,
      limit: newRowsPerPage,
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
    inputData: courses,
    comparator: getComparator(order, orderBy),
    filterName: payload.search,
  });

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this Course!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
      cancelButtonColor: theme.palette.error.main,
      confirmButtonColor: theme.palette.success.main,
    }).then((result) => {
      if (result.isConfirmed) {
        deleteCourseApi({ course_id: id })
          .then((res) => {
            if (res?.data?.success) {
              Swal.fire('Deleted!', res?.data?.message, 'success');
              getCourses(payload);
            } else {
              Swal.fire('Error!', res?.data?.message, 'error');
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'Your Course is safe :)', 'error');
      }
    });
  };
  
  const notFound = !dataFiltered.length && !payload.search;
    return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <HeaderBreadcrumbs
          heading="Courses"
          links={[
            { name: 'Dashboard', href: '/admin/dashboard' },
            { name: 'Courses', href: '/admin/courses' },
            { name: 'Course List' },
          ]}
        />
        <Button
          variant="contained"
          to="/admin/courses/add"
          component={RouterLink}
          color="inherit"
          startIcon={<Iconify icon="eva:plus-fill" />}
        >
          New Course
        </Button>
      </Stack>

      <Card>
        <CourseTableToolbar
          numSelected={selected.length}
          filterName={payload.search}
          onFilterName={handleFilterByName}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <CourseTableHead
                order={order}
                orderBy={orderBy}
                rowCount={count}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'course_name', label: 'Course Name' },
                  { id: 'duration', label: 'Duration' },
                  { id: 'discount_fees', label: 'Discount Fees' },
                  { id: 'date', label: 'Date', align: 'center' },
                  { id: 'status', label: 'Status' },
                  { id: 'type', label: 'Type' },
                  { id: 'action', label: 'Action', align: 'center' },
                ]}
              />
              <TableBody>
                {dataFiltered.map((row) => (
                  <CourseTableRow
                    key={row.id}
                    name={row.course_name}
                    duration={row.duration}
                    fees={row.discount_fees}
                    date={moment(row.date).format('DD/MM/YYYY')}
                    status={row.status}
                    type={row.type}
                    selected={selected.indexOf(row.course_name) !== -1}
                    handleClick={(event) => handleClick(event, row.course_name)}
                    onEdit={`/admin/courses/${row.id}/edit`}
                    onView={`/admin/courses/${row.id}/view`}
                    onDelete={() => handleDelete(row.id)}
                  />
                ))}
                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(payload.page - 1, rowsPerPage, count)}
                />
                {notFound && <TableNoData query={payload.search} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

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
