import { Helmet } from 'react-helmet-async';

import Notices from './Notices';

// ----------------------------------------------------------------------

export default function UserPage() {
  return (
    <>
      <Helmet>
        <title> Notice | list  </title>
      </Helmet>

      <Notices />
    </>
  );
}