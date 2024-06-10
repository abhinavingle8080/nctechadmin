import { Helmet } from 'react-helmet-async';

import Teams from './Teams'; // Adjusted import

// ----------------------------------------------------------------------

export default function TeamPage() {
  return (
    <>
      <Helmet>
        <title>Team | List</title>
      </Helmet>

      <Teams />
    </>
  );
}
