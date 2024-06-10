import { useState } from 'react';
import propTypes from 'prop-types';
import { capitalCase } from 'change-case';

// @mui
import { Tab, Box, Tabs,  Card, Container,} from '@mui/material';

// sections
import LeaveDetails from './LeaveDetails';
// components
import Page from '../../../../../components/Page';
import Iconify from '../../../../../components/iconify';
// hooks
import useSettings from '../../../../../hooks/useSettings';

// ----------------------------------------------------------------------

ViewLeave.propTypes = {
    details: propTypes.object,
    logs: propTypes.array,
};


export default function ViewLeave({ details, logs }) {
  const { themeStretch } = useSettings();

  const [currentTab, setCurrentTab] = useState('Leave Details');

  const DETAIL_TABS = [
    {
      value: 'Leave Details',
      // icon: <Iconify icon='akar-icons:info' width={20} height={20} />,
      component: <LeaveDetails data={details}/>,
    }
  ];

  return (
    <Page title="View Leave">
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
            <Tab disableRipple key={tab.value} label={capitalCase(tab.value)} value={tab.value} style={{ textTransform: 'capitalize' }}/>
          ))}
        </Tabs>

        <Box sx={{ mb: 1 }} />

        {DETAIL_TABS.map((tab) => {
          const isMatched = tab.value === currentTab;
          return isMatched && <Box key={tab.value} sx={{ mb: 3}}>{tab.component}</Box>;
        })}
      </Container>
      </Card>
    </Page>
  );
}