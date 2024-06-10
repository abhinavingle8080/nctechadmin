import React from 'react';
import PropTypes from 'prop-types';

import { Grid } from '@mui/material';

const styles = {
    gridItem: {
        borderBottom: '1px solid black',
        paddingTop: 0,
        paddingBottom: '1rem',
    },
    noBorderBottom: {
        borderBottom: 'none',
    },
};

TeamDetails.propTypes = {
    data: PropTypes.object,
};

function TeamDetails({ data }) { // Adjusted component name
    const dummyData = [
        {
            label: 'Name', // Adjusted label
            value: data ? data?.name : 'N/A', // Adjusted value
        },
        {
            label: 'Description', // Adjusted label
            value: data ? data?.description : 'N/A', // Adjusted value
        },
        {
            label: 'Type', // Adjusted label
            value: data ? data?.type : 'N/A', // Adjusted value
        },
    ];

    return (
        <Grid container spacing={3} margin={0} width="100%">
            {dummyData.map((item, index) => (
                <Grid
                    item
                    xs={12}
                    md={6}
                    style={{
                        ...styles.gridItem,
                        ...(index === dummyData.length - 1 ? styles.noBorderBottom : {}),
                    }}
                    key={index}
                >
                    <Grid container spacing={3} margin={0} width="100%">
                        <Grid item xs={12} md={4}>
                            <h4 style={{ fontSize: '16px' }}>{item.label}</h4>
                        </Grid>
                        <Grid item xs={12} md={8}>
                            <p>{item.value}</p>
                        </Grid>
                    </Grid>
                </Grid>
            ))}
        </Grid>
    );
}

export default TeamDetails;
