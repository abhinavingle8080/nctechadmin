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
      value: course.course_name ? course.course_name : 'N/A',
    },
    {
      label: 'Description',
      value: course.description ? course.description : 'N/A',
    },
    {
      label: 'Fees',
      value: course.fees ? `$${parseInt(course.fees, 10).toFixed(2)}` : 'N/A',
    },
    {
      label: 'Discount Fees',
      value: course?.discount_fees ? `$${parseInt(course?.discount_fees, 10)?.toFixed(2)}` : 'N/A',
    },
    {
      label: 'Duration (hours)',
      value: course.duration ? `${course.duration} hours` : 'N/A',
    },
    {
      label: 'Start Date',
      value: course.start_date ? moment(course.start_date).format('DD/MM/YYYY') : 'N/A',
    },
    {
      label: 'End Date',
      value: course.end_date ? moment(course.end_date).format('DD/MM/YYYY') : 'N/A',
    },
    {
      label: 'Location',
      value: course.location ? course.location : 'N/A',
    },
    {
      label: 'Max Capacity',
      value: course.max_capacity ? course.max_capacity : 'N/A',
    },
    {
      label: 'Current Capacity',
      value: course.current_capacity ? course.current_capacity : 'N/A',
    },
    {
      label: 'Status',
      value: course.status ? course.status : 'N/A',
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
