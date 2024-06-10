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

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

// Adjusted imports based on your environment

// Import APIs for fetching and deleting teams
import { getTeamsApi, deleteTeamApi } from '../../../../apis/admin/team/TeamApis';

import TableNoData from '../../../../sections/team/table-no-data';
import TeamTableRow from '../../../../sections/team/team-table-row';
import TeamTableHead from '../../../../sections/team/team-table-head';
import TableEmptyRows from '../../../../sections/team/table-empty-rows';
import HeaderBreadcrumbs from '../../../../components/HeaderBreadcrumbs';
import TeamTableToolbar from '../../../../sections/team/team-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../../../../sections/team/utils';

export default function Teams() {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [count, setCount] = useState(0);
  const [teams, setTeams] = useState([]);
  const [payload, setPayload] = useState({
    page: 1,
    limit: 5,
    search: '',
  });

  useEffect(() => {
    getTeams(payload);
  }, [payload]);

  const getTeams = async (data) => {
    getTeamsApi(data)
      .then((res) => {
        setTeams(res.data.data.rows);
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
      const newSelecteds = teams.map((n) => n.name);
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
    inputData: teams,
    comparator: getComparator(order, orderBy),
    filterName: payload.search,
  });

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this Team!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
      cancelButtonColor: theme.palette.error.main,
      confirmButtonColor: theme.palette.success.main,
    }).then((result) => {
      if (result.isConfirmed) {
        deleteTeamApi({ team_id: id })
          .then((res) => {
            if (res?.data?.success) {
              Swal.fire('Deleted!', res?.data?.message, 'success');
              getTeams(payload);
            } else {
              Swal.fire('Error!', res?.data?.message, 'error');
            }
          })
          .catch((err) => {
            console.error(err);
          });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'Your Team is safe :)', 'error');
      }
    });
  };

  const notFound = !dataFiltered?.length && !payload.search;

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <HeaderBreadcrumbs
          heading="Teams"
          links={[
            { name: 'Dashboard', href: '/admin/dashboard' },
            { name: 'Teams', href: '/admin/teams' },
            { name: 'Team List' },
          ]}
        />
        <Button
          variant="contained"
          to="/admin/teams/add"
          component={RouterLink}
          color="inherit"
          startIcon={<Iconify icon="eva:plus-fill" />}
        >
          New Team
        </Button>
      </Stack>

      <Card>
        <TeamTableToolbar
          numSelected={selected?.length}
          filterName={payload.search}
          onFilterName={handleFilterByName}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <TeamTableHead
                order={order}
                orderBy={orderBy}
                rowCount={count}
                numSelected={selected?.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'name', label: 'Name' },
                  { id: 'description', label: 'Description' },
                  { id: 'type', label: 'Type' },
                  { id: 'action', label: 'Action', align: 'center' },
                ]}
              />
              <TableBody>
                {dataFiltered?.map((row) => (
                  <TeamTableRow
                    key={row.id}
                    name={row.name}
                    description={row.description}
                    type={row.type}
                    selected={selected.indexOf(row.name) !== -1}
                    handleClick={(event) => handleClick(event, row.name)}
                    onEdit={`/admin/teams/${row.id}/edit`}
                    onView={`/admin/teams/${row.id}/view`}
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
