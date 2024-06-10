import { Helmet } from 'react-helmet-async';

import DashboardPage from './view/DashboardPage';

// ----------------------------------------------------------------------

export default function AppPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard | NC-TECH </title>
      </Helmet>

      <DashboardPage />
    </>
  );
}
