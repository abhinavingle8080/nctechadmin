import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import { useTheme } from '@mui/material/styles';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import { Container } from '@mui/material';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import Swal from 'sweetalert2';


import Iconify from 'src/components/Iconify';
import Scrollbar from 'src/components/Scrollbar';

import { getDesignationsApi, deleteDesignationApi } from '../../../../apis/admin/designation/DesignationApis';

import TableNoData from '../../../../sections/designation/table-no-data';
import DesignationTableRow from '../../../../sections/designation/designation-table-row';
import DesignationTableHead from '../../../../sections/designation/designation-table-head';
import TableEmptyRows from '../../../../sections/designation/table-empty-rows';
import HeaderBreadcrumbs from '../../../../components/HeaderBreadcrumbs';
import DesignationTableToolbar from '../../../../sections/designation/designation-table-toolbar';
import {emptyRows, applyFilter,  getComparator } from '../../../../sections/designation/utils';


export default function Designations() {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [count, setCount] = useState(0);
  const [designations, setDesignations] = useState([]);
  const [payload, setPayload] = useState({
    page: 1,
    limit: 5,
    search: '',
  });

  useEffect(() => {
    getDesignations(payload);
  }, [payload]);

  const getDesignations = async (data) => {
    getDesignationsApi(data)
      .then((res) => {
        setDesignations(res.data.data.rows);
        setCount(res.data.data.count);
      })
      .catch((err) => {
        console.error(err);
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
      const newSelecteds = designations.map((n) => n.title);
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
    inputData: designations,
    comparator: getComparator(order, orderBy),
    filterName: payload.search,
  });

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this Designation!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
      cancelButtonColor: theme.palette.error.main,
      confirmButtonColor: theme.palette.success.main,
    }).then((result) => {
      if (result.isConfirmed) {
        deleteDesignationApi({ designation_id: id })
          .then((res) => {
            if (res?.data?.success) {
              Swal.fire('Deleted!', res?.data?.message, 'success');
              getDesignations(payload);
            } else {
              Swal.fire('Error!', res?.data?.message, 'error');
            }
          })
          .catch((err) => {
            console.error(err);
          });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'Your Designation is safe :)', 'error');
      }
    });
  };

  const notFound = !dataFiltered.length && !payload.search;

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <HeaderBreadcrumbs
          heading="Designation"
          links={[
            { name: 'Dashboard', href: '/admin/dashboard' },
            { name: 'Designation', href: '/admin/designations' },
            { name: 'Designation List' },
          ]}
        />
        <Button
          variant="contained"
          to="/admin/designations/add"
          component={RouterLink}
          color="inherit"
          startIcon={<Iconify icon="eva:plus-fill" />}
        >
          New Designation
        </Button>
      </Stack>

      <Card>
        <DesignationTableToolbar
          numSelected={selected.length}
          filterName={payload.search}
          onFilterName={handleFilterByName}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <DesignationTableHead
                order={order}
                orderBy={orderBy}
                rowCount={count}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'title', label: 'Title' },
                  { id: 'status', label: 'Status' },
                  { id: 'action', label: 'Action', align: 'center' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .map((row) => (
                    <DesignationTableRow
                      key={row.id}
                      title={row.title}
                      status={row.status}
                      selected={selected.indexOf(row.title) !== -1}
                      handleClick={(event) => handleClick(event, row.title)}
                      onEdit={`/admin/designations/${row.id}/edit`}
                      onView={`/admin/designations/${row.id}/view`}
                      onDelete={() => handleDelete(row.id)}
                    />
                  ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(payload.page - 1, rowsPerPage, count)}
                />

                {notFound && <TableNoData query={filterName} />}
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
