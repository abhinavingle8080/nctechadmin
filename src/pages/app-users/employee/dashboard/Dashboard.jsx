import React from 'react';
import { Helmet } from 'react-helmet-async';
import DashboardPage from './view/DashboardPage';

export default function AppPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard | Nc Tech </title>
      </Helmet>

      <DashboardPage />
    </>
  );
}
