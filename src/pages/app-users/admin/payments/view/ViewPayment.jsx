import { useState } from 'react';
import PropTypes from 'prop-types';
import { capitalCase } from 'change-case';
import { Tab, Box, Tabs, Card, Stack, Container } from '@mui/material';
import PaymentDetails from './PaymentDetails'; // Import your PaymentDetails component
import Page from '../../../../../components/Page';
import useSettings from '../../../../../hooks/useSettings';

ViewPayment.propTypes = {
  details: PropTypes.object,
  logs: PropTypes.array,
};

export default function ViewPayment({ details, logs }) {
  const { themeStretch } = useSettings();

  const [currentTab, setCurrentTab] = useState('Payment Details');

  const DETAIL_TABS = [
    {
      value: 'Payment Details',
      component: <PaymentDetails data={details} />,
    },
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
