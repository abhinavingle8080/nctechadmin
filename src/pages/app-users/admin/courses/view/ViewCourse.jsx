import { useState } from 'react';
import PropTypes from 'prop-types';
import { capitalCase } from 'change-case';

// @mui
import { Tab, Box, Tabs, Card, Container } from '@mui/material';

// sections
import CourseDetails from './CourseDetails'; // Adjust import path as per your project structure

// components
import Page from '../../../../../components/Page';
import Iconify from '../../../../../components/Iconify';

// hooks
import useSettings from '../../../../../hooks/useSettings';

// ----------------------------------------------------------------------

ViewCourse.propTypes = {
  details: PropTypes.object,
  logs: PropTypes.array,
};

export default function ViewCourse({ details, logs }) {
  const { themeStretch } = useSettings();

  const [currentTab, setCurrentTab] = useState('Course Details');

  const DETAIL_TABS = [
    {
      value: 'Course Details',
      // icon: <Iconify icon='akar-icons:info' width={20} height={20} />,
      component: <CourseDetails course={details} />, // Pass course details as props
    },
    // Add more tabs if needed
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
                label={capitalCase(tab.value)}
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
