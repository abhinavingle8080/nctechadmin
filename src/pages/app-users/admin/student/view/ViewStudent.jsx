import { useState } from 'react';
import propTypes from 'prop-types';
import { capitalCase } from 'change-case';

// @mui
import { Tab, Box, Tabs, Card, Container } from '@mui/material';

// sections
import StudentDetails from './StudentDetails'; // Import your StudentDetails component
// components
import Page from '../../../../../components/Page';
import Iconify from '../../../../../components/Iconify';
// hooks
import useSettings from '../../../../../hooks/useSettings';

// ----------------------------------------------------------------------

ViewStudent.propTypes = {
  details: propTypes.object,
  logs: propTypes.array,
};

export default function ViewStudent({ details, logs }) {
  const { themeStretch } = useSettings();

  const [currentTab, setCurrentTab] = useState('Student Details');

  const DETAIL_TABS = [
    {
      value: 'Student Details',
      component: <StudentDetails data={details} />,
    },
    // Add more tabs if needed, similar to the above
  ];

  return (
    <Page title="View Student">
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
            return isMatched && (
              <Box key={tab.value} sx={{ mb: 3 }}>
                {tab.component}
              </Box>
            );
          })}
        </Container>
      </Card>
    </Page>
  );
}