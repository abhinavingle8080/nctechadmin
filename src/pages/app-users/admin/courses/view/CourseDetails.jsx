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
  course: PropTypes.object,
};

function CourseDetails({ course }) {
  const dummyData = [
    {
      label: 'Course Name',
      value: course ? course.course_name : 'N/A',
    },
    {
      label: 'Description',
      value: course ? course.description : 'N/A',
    },
    {
      label: 'Fees',
      value: course ? `$${course.fees.toFixed(2)}` : 'N/A',
    },
    {
      label: 'Discount Fees',
      value: course ? `$${course.discount_fees.toFixed(2)}` : 'N/A',
    },
    {
      label: 'Duration (hours)',
      value: course ? `${course.duration} hours` : 'N/A',
    },
    {
      label: 'Start Date',
      value: course ? moment(course.start_date).format('DD/MM/YYYY') : 'N/A',
    },
    {
      label: 'End Date',
      value: course ? moment(course.end_date).format('DD/MM/YYYY') : 'N/A',
    },
    {
      label: 'Location',
      value: course ? course.location : 'N/A',
    },
    {
      label: 'Max Capacity',
      value: course ? course.max_capacity : 'N/A',
    },
    {
      label: 'Current Capacity',
      value: course ? course.current_capacity : 'N/A',
    },
    {
      label: 'Status',
      value: course ? course.status : 'N/A',
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
