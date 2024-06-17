import { Helmet } from 'react-helmet-async';

import Courses from './Courses';

// ----------------------------------------------------------------------

export default function UserPage() {
  return (
    <>
      <Helmet>
        <title>Course | List</title>
      </Helmet>

      <Courses />
    </>
  );
}
