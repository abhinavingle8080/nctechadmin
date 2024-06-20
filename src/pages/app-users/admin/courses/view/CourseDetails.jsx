import React from 'react';
import moment from 'moment';
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

CourseDetails.propTypes = {
  data: PropTypes.object,
};

function CourseDetails({ data }) {
  const dummyData = [
    {
      label: 'Course Name',
      value: data ? data.course_name : 'N/A',
    },
    {
      label: 'Description',
      value: data ? data.description : 'N/A',
    },
    {
      label: 'Fees',
      value: data ? `$${parseFloat(data.fees).toFixed(2)}` : 'N/A',
    },
    {
      label: 'Discount Fees',
      value: data ? `$${parseFloat(data.discount_fees).toFixed(2)}` : 'N/A',
    },
    {
      label: 'Duration (days)',
      value: data ? `${data.duration} days` : 'N/A',
    },
    {
      label: 'Start Date',
      value: data ? moment(data.start_date).format('DD/MM/YYYY') : 'N/A',
    },
    {
      label: 'End Date',
      value: data ? moment(data.end_date).format('DD/MM/YYYY') : 'N/A',
    },
    {
      label: 'Location',
      value: data ? data.location : 'N/A',
    },
    {
      label: 'Max Capacity',
      value: data ? data.max_capacity : 'N/A',
    },
    {
      label: 'Current Capacity',
      value: data ? data.current_capacity : 'N/A',
    },
    {
      label: 'Status',
      value: data ? data.status : 'N/A',
    },
    {
      label: 'Type',
      value: data ? data.type: 'N/A',
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
            ...(dummyData.length === 2 ? styles.noBorderBottom : {}),
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

export default CourseDetails;
