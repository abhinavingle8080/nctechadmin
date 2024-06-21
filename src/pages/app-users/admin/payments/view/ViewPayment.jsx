// ViewPayment.jsx

import { useState } from 'react';
import propTypes from 'prop-types';
import { capitalCase } from 'change-case';
import { Link as RouterLink } from 'react-router-dom';

// @mui
import { Tab, Box, Tabs, Card,Stack,Button,Container } from '@mui/material';

// sections
import PaymentDetails from './PaymentDetails'; // Import your PaymentDetails component
// components
import Page from '../../../../../components/Page';
import Iconify from '../../../../../components/iconify';
// hooks
import useSettings from '../../../../../hooks/useSettings';

// ----------------------------------------------------------------------

ViewPayment.propTypes = {
  details: propTypes.object,
  logs: propTypes.array,
};

export default function ViewPayment({ details, logs }) {
  const { themeStretch } = useSettings();

  const [currentTab, setCurrentTab] = useState('Payment Details');

  const DETAIL_TABS = [
    {
      value: 'Payment Details',
      component: <PaymentDetails data={details} />,
    },
    // Add more tabs if needed, similar to the above
  ];

  return (
    <Page title="View Payment">
      <Card sx={{ mb: 3 }}>
        <Container maxWidth={themeStretch ? false : 'lg'}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
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
            <Button
              variant="contained"
              to="/admin/payments/add"
              component={RouterLink}
              color="inherit"
              // startIcon={<Iconify icon="eva:plus-fill" />}
            >
              Download Invoice
            </Button>
          </Stack>

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
