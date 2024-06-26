import { useState } from 'react';
import propTypes from 'prop-types';
import { capitalCase } from 'change-case';

// @mui
import { Tab, Box, Tabs, Card, Container } from '@mui/material';

// sections
import NoticeDetails from './NoticeDetails'; // Assuming you have a NoticeDetails component
// components
import Page from '../../../../../components/Page';
import Iconify from '../../../../../components/Iconify';
// hooks
import useSettings from '../../../../../hooks/useSettings';

// ----------------------------------------------------------------------

ViewNotice.propTypes = {
  details: propTypes.object,
};

export default function ViewNotice({ details }) {
  const { themeStretch } = useSettings();

  const [currentTab, setCurrentTab] = useState('Notice Details');

  const DETAIL_TABS = [
    {
      value: 'Notice Details',
      // icon: <Iconify icon='akar-icons:info' width={20} height={20} />,
      component: <NoticeDetails data={details} />,
    }
  ];

  return (
    <Page title="View Notice">
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
