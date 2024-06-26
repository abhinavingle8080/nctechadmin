// hooks
import useAuth from '../hooks/useAuth';

//
import Avatar from './Avatar';

/* eslint-disable */
// ----------------------------------------------------------------------

export default function MyAvatar({ ...other }) {
  const { user } = useAuth();
  const profileImage = user?.profile_image;
  const displayName = `${user?.first_name} ${user?.last_name}`;

  return (
    <Avatar
      src={profileImage}
      alt={displayName}
      color={'default'}
      {...other}
    >
    </Avatar>
  );
}
