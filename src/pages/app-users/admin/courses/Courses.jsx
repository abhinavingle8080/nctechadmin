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
import { getCoursesApi, deleteCourseApi } from 'src/apis/admin/course/CourseApis';
import TableNoData from 'src/sections/course/table-no-data';
import TableEmptyRows from 'src/sections/user/table-empty-rows';
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs';
import CourseTableToolbar from 'src/sections/course/course-table-toolbar';
import { emptyRows, applyFilter, getComparator } from 'src/sections/course/utils';
import CourseTableHead from 'src/sections/course/course-table-head';
import CourseTableRow from 'src/sections/course/course-table-row';

export default function Courses() {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
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
      const newSelecteds = courses.map((n) => n.name);
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
    setPage(0);
    setFilterName(event.target.value);
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
              setSelected([]);
            } else {
              Swal.fire('Error!', res?.data?.message, 'error');
            }
          })
          .catch((err) => {
            console.error(err);
            Swal.fire('Error!', 'Failed to delete the course.', 'error');
          });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'Your course is safe :)', 'error');
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
          filterName={filterName}
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
                  { id: 'name', label: 'Course Name' },
                  { id: 'description', label: 'Description' },
                  { id: 'fees', label: 'Fees' },
                  { id: 'date', label: 'Date', align: 'center' },
                  { id: 'status', label: 'Status' },
                  { id: 'action', label: 'Action', align: 'center' },
                ]}
              />
              <TableBody>
                {dataFiltered.map((row) => (
                  <CourseTableRow
                    key={row.id}
                    name={row.course_name}
                    description={row.description}
                    fees={row.fees}
                    date={moment(row.date).format('DD/MM/YYYY')}
                    status={row.status}
                    selected={selected.indexOf(row.name) !== -1}
                    handleClick={(event) => handleClick(event, row.name)}
                    onEdit={`/admin/courses/${row.id}/edit`}
                    onView={`/admin/courses/${row.id}/view`}
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
