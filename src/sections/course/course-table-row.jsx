import { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import Stack from '@mui/material/Stack';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import Label from 'src/components/Label';
import Iconify from 'src/components/Iconify';

export default function UserTableRow({
  selected,
  name,
  email,
  course,
  duration,
  fees,
  date,
  paymentAmount,
  status,
  type,
  onView,
  onEdit,
  onDelete,
}) {
  const [open, setOpen] = useState(null);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={() => {}} />
        </TableCell>

        <TableCell component="th" scope="row" padding="none">
          <Typography variant="subtitle2" noWrap>
            {name}
          </Typography>
        </TableCell>
        <TableCell>{course} {duration}</TableCell>
        <TableCell>{fees}</TableCell>
        <TableCell>{paymentAmount} {date}</TableCell>
        <TableCell>
          <Label color={(status === 'Inactive' && 'error') || 'success'}>{status}</Label>
        </TableCell>
        <TableCell>
        <Label color={(type === 'Offline' && 'warning') || 'success'}>{type}</Label>
        </TableCell>
        <TableCell align="right">
          <IconButton onClick={handleOpenMenu}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: { width: 140 },
        }}
      >
        <Link to={onView} style={{ textDecoration: 'none', color: 'inherit' }}>
          <MenuItem onClick={handleCloseMenu}>
            <Iconify icon="carbon:view" sx={{ mr: 2 }} />
            View
          </MenuItem>
        </Link>
        <Link to={onEdit} style={{ textDecoration: 'none', color: 'inherit' }}>
          <MenuItem onClick={handleCloseMenu}>
            <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
            Edit
          </MenuItem>
        </Link>

        <MenuItem
          onClick={() => {
            onDelete();
            handleCloseMenu();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
    </>
  );
}

UserTableRow.propTypes = {
  name: PropTypes.string.isRequired,
  email: PropTypes.string,
  course: PropTypes.string,
  duration: PropTypes.string,
  fees: PropTypes.number.isRequired,
  date: PropTypes.string,
  paymentAmount: PropTypes.number,
  status: PropTypes.string,
  type: PropTypes.string,
  onView: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  selected: PropTypes.bool.isRequired,
};
