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

import Iconify from 'src/components/iconify';
import moment from 'moment';

// ----------------------------------------------------------------------

export default function NoticeTableRow({
  selected,
  title,
  content,
//   posted_by,
  datePosted,
  expirationDate,
  category,
//   tags,
  visibility,
  attachments,
  status,
//   priority,
  handleClick,
  onDelete,
  onView,
  onEdit,

 
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
          <Checkbox disableRipple checked={selected} onChange={handleClick} />
        </TableCell>

        <TableCell component="th" scope="row" padding="none">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="subtitle2" noWrap>
              {title}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell>{datePosted}</TableCell>

        <TableCell>{content}</TableCell>

        <TableCell>{expirationDate}</TableCell>

        <TableCell>{category}</TableCell>

        <TableCell>{status}</TableCell>

        <TableCell>{visibility}</TableCell>

        {/* <TableCell>{posted_by}</TableCell> */}

        {/* <TableCell>{tags}</TableCell> */}

        {/* <TableCell>{attachments}</TableCell> */}

        {/* <TableCell>{priority}</TableCell> */}



    
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

NoticeTableRow.propTypes = {
  title: PropTypes.string,
  datePosted: PropTypes.any,
  content: PropTypes.string,
  expirationDate: PropTypes.any,
  category: PropTypes.string,
  status: PropTypes.string,
  visibility: PropTypes.string,

 
//   tags: PropTypes.string,
//   posted_by: PropTypes.string,
  attachments: PropTypes.string,
//   priority: PropTypes.number,
  handleClick: PropTypes.func,  
  selected: PropTypes.any,
  onView: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};
