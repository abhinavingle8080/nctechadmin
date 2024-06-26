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

import Iconify from 'src/components/Iconify';
import Label from 'src/components/Label';
import moment from 'moment';

// ----------------------------------------------------------------------

export default function NoticeTableRow({
  selected,
  title,
  content,
  posted_by,
  date_posted,
  expiration_date,
  category,
  tags,
  visibility,
  attachments,
  status,
  priority,
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

  const handleAttachmentClick = (e, attachmentUrl) => {
    e.preventDefault(); // Prevent default behavior of the anchor tag
    window.open(attachmentUrl, '_blank'); // Open the attachment in a new tab
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

        <TableCell>{moment(date_posted).format('MMMM Do YYYY')}</TableCell>

        <TableCell>{content}</TableCell>

        <TableCell>{category}</TableCell>

        <TableCell>{tags}</TableCell>

        <TableCell>{visibility}</TableCell>

        {/* <TableCell>
          {attachments && (
            <a
              href={`http://localhost:8020/storage/images/${attachments}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {attachments.substring(attachments.lastIndexOf('/') + 1)} {/* Display file name */}
            {/* </a>
          )}
        </TableCell> */}

        <TableCell>
          <Label
            color={
              (status === 'Active' && 'success') || (status === 'Pending' && 'warning') || 'error'
            }
          >
            {status}
          </Label>
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
      </Popover>
    </>
  );
}

NoticeTableRow.propTypes = {
  title: PropTypes.string,
  content: PropTypes.string,
  posted_by: PropTypes.string,
  date_posted: PropTypes.any,
  expiration_date: PropTypes.any,
  category: PropTypes.string,
  tags: PropTypes.string,
  visibility: PropTypes.string,
  attachments: PropTypes.string,
  status: PropTypes.string,
  priority: PropTypes.string,
  handleClick: PropTypes.func,
  selected: PropTypes.any,
  onView: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};
