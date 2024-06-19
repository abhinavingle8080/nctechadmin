import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { capitalCase } from 'change-case';

// @mui
import { Tab, Box, Tabs, Card, Container } from '@mui/material';

// sections
import CourseDetails from './CourseDetails';
// components
import Page from '../../../../../components/Page';
// hooks
import useSettings from '../../../../../hooks/useSettings';

ViewCourse.propTypes = {
  details: PropTypes.object, // Ensure details prop is correctly defined
  logs: PropTypes.array,
};

export default function ViewCourse({ details, logs }) {
  const { themeStretch } = useSettings();

  const [currentTab, setCurrentTab] = useState('Course Details'); // Initialize currentTab state

  const DETAIL_TABS = [
    {
      value: 'Course Details',
      component: <CourseDetails data={details} />, // Ensure details are passed to CourseDetails correctly
    },
    // Add other tabs if needed, for example:
    // {
    //   value: 'Course Logs',
    //   component: <CourseLogs data={logs} />,
    // },
  ];

  return (
    <Page title="View Course">
      <Card sx={{ mb: 3 }}>
        <Container maxWidth={themeStretch ? false : 'lg'}>
          <Tabs
            value={currentTab}
            scrollButtons="auto"
            variant="scrollable"
            allowScrollButtonsMobile
            onChange={(e, value) => setCurrentTab(value)}
          >
            {DETAIL_TABS.map((tab) => (
              <Tab
                disableRipple
                key={tab.value}
                label={capitalCase(tab.value)} // Capitalize tab label
                value={tab.value}
                style={{ textTransform: 'capitalize' }}
              />
            ))}
          </Tabs>

          <Box sx={{ mb: 1 }} />

          {DETAIL_TABS.map((tab) => {
            const isMatched = tab.value === currentTab;
            return isMatched && <Box key={tab.value} sx={{ mb: 3 }}>{tab.component}</Box>;
          })}
        </Container>
      </Card>
    </Page>
  );
}
