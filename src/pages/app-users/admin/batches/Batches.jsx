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

// apis

// // Components
// import Iconify from 'src/components/Iconify';
// import Scrollbar from 'src/components/Scrollbar';
// import TableNoData from 'src/sections/user/table-no-data';
// import TableEmptyRows from 'src/sections/user/table-empty-rows';
// import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs';
// import UserTableToolbar from 'src/sections/user/user-table-toolbar';
// import { emptyRows, applyFilter, getComparator } from 'src/sections/user/utils';
// import UserTableHead from 'src/sections/user/user-table-head';
// import UserTableRow from 'src/sections/user/user-table-row';
// import { getBatchesApi, deleteBatchApi } from '../../../../apis/admin/batch/BatchesApis';
// Components
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import TableNoData from 'src/sections/user/table-no-data';
import TableEmptyRows from 'src/sections/user/table-empty-rows';
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs';
import UserTableToolbar from 'src/sections/user/user-table-toolbar';
import { emptyRows, applyFilter, getComparator } from 'src/sections/user/utils';
import UserTableHead from 'src/sections/user/user-table-head';
import UserTableRow from 'src/sections/user/user-table-row';
import { getBatchesApi, deleteBatchApi } from '../../../../apis/admin/batch/BatchesApis';



export default function Batches() {
    const theme = useTheme();
    const [page, setPage] = useState(0);
    const [order, setOrder] = useState('asc');
    const [selected, setSelected] = useState([]);
    const [orderBy, setOrderBy] = useState('batchName');
    const [filterName, setFilterName] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [count, setCount] = useState(0);
    const [batches, setBatches] = useState([]);

    const [payload, setPayload] = useState({
        page: 1,
        limit: 5,
        search: '',
    });

    useEffect(() => {
        getBatches(payload);
    }, [payload]);

    const getBatches = async (data) => {
        getBatchesApi(data)
            .then((res) => {
                setBatches(res.data.data.rows);
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
            const newSelecteds = batches.map((n) => n.batchName);
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
        setFilterName(event.target.value);
        setPayload({
            ...payload,
            page: 1,
            search: event.target.value,
        });
    };

    const dataFiltered = applyFilter({
        inputData: batches,
        comparator: getComparator(order, orderBy),
        filterName: payload.search,
    });

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You will not be able to recover this Batch!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, keep it',
            cancelButtonColor: theme.palette.error.main,
            confirmButtonColor: theme.palette.success.main,
        }).then((result) => {
            if (result.isConfirmed) {
                deleteBatchApi({ batch_id: id })
                    .then((res) => {
                        if (res?.data?.success) {
                            Swal.fire('Deleted!', res?.data?.message, 'success');
                            getBatches(payload);
                        } else {
                            Swal.fire('Error!', res?.data?.message, 'error');
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire('Cancelled', 'Your batch is safe :)', 'error');
            }
        });
    };

    const notFound = !dataFiltered.length && payload.search;

    return (
        <Container>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                <HeaderBreadcrumbs
                    heading="Batches"
                    links={[
                        { name: 'Dashboard', href: '/admin/dashboard' },
                        { name: 'Batches', href: '/admin/batches' },
                        { name: 'Batch List' },
                    ]}
                />
                <Button
                    variant="contained"
                    to="/admin/batches/add"
                    component={RouterLink}
                    color="inherit"
                    startIcon={<Iconify icon="eva:plus-fill" />}
                >
                    New Batch
                </Button>
            </Stack>

            <Card>
                <UserTableToolbar
                    numSelected={selected.length}
                    filterName={payload.search}
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
                                    { id: 'batchName', label: 'Batch Name' },
                                    { id: 'studentList', label: 'Student List' },
                                    { id: 'courseName', label: 'Course Name' },
                                    { id: 'startDate', label: 'Start Date' },
                                    { id: 'action', label: 'Action', align: 'center' },
                                ]}
                            />
                            <TableBody>
                                {dataFiltered.map((row) => (
                                    <UserTableRow
                                        key={row?.id}
                                        name={row?.batch_name}
                                        studentList={row?.Students?.map(student => `${student?.first_name} ${student?.last_name}`).join(', ')}
                                        courseName={row?.Course?.course_name}
                                        startDate={moment(row?.start_date).format('DD/MM/YYYY')}
                                        selected={selected?.indexOf(row?.batch_name) !== -1}
                                        handleClick={(event) => handleClick(event, row?.batch_name)}
                                        onEdit={`/admin/batches/${row?.id}/edit`}
                                        onView={`/admin/batches/${row?.id}/view`}
                                        onDelete={() => handleDelete(row?.id)}
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
