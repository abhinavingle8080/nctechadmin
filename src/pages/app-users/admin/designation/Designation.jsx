import { Helmet } from 'react-helmet-async';

import Designations from './Designations';

// ----------------------------------------------------------------------

export default function UserPage() {
  return (
    <>
      <Helmet>
        <title>Designation | List</title>
      </Helmet>

      <Designations />
    </>
  );
}
