import { useState } from 'react';
import PropTypes from 'prop-types';
import { capitalCase } from 'change-case';

// @mui
import { Tab, Box, Tabs, Card, Container } from '@mui/material';

// sections
import TeamDetails from './TeamDetails'; // Adjusted import for team details
// components
import Page from '../../../../../components/Page';
import Iconify from '../../../../../components/iconify';
// hooks
import useSettings from '../../../../../hooks/useSettings';

// ----------------------------------------------------------------------

ViewTeam.propTypes = {
    details: PropTypes.object,
    logs: PropTypes.array,
};

export default function ViewTeam({ details, logs }) { // Adjusted component name
    const { themeStretch } = useSettings();

    const [currentTab, setCurrentTab] = useState('Team Details'); // Adjusted default tab

    const DETAIL_TABS = [
        {
            value: 'Team Details', // Adjusted tab value
            // icon: <Iconify icon='akar-icons:info' width={20} height={20} />,
            component: <TeamDetails data={details} />, // Adjusted component for team details
        }
    ];

    return (
        <Page title="View Team">
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
