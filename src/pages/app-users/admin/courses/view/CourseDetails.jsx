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
      label: 'Duration (days)',
      value: course.duration ? `${course.duration} days` : 'N/A',
    },
    {
      label: 'Fees',
      value: course.fees ? `${parseInt(course.fees, 10).toFixed(2)}` : 'N/A',
    },
    {
      label: 'Discount Fees',
      value: course?.discount_fees ? `${parseInt(course?.discount_fees, 10)?.toFixed(2)}` : 'N/A',
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
      label: 'Status',
      value: course.status ? course.status : 'N/A',
    },
    {
      label: 'Type',
      value: course ? course.type : 'N/A',
    },
    {
      label: 'Description',
      value: course.description ? course.description : 'N/A',
      isDescription: true, // Add a flag to identify the description field
    },
  ];

  return (
    <Grid container spacing={3} margin={0} width="100%">
      {dummyData.map((item, index) => (
        <Grid
          item
          xs={12}
          md={item.isDescription ? 12 : 6} // Allocate full width for description
          style={{
            ...styles.gridItem,
            ...(index === dummyData.length - 1 ? styles.noBorderBottom : {}),
          }}
          key={index}
        >
          <Grid container spacing={3} margin={0} width="100%">
            <Grid item xs={12} md={item.isDescription ? 2 : 4}>
              <h4 style={{ fontSize: '16px' }}>{item.label}</h4>
            </Grid>
            <Grid item xs={12} md={item.isDescription ? 10 : 8}>
              <p>{item.value}</p>
            </Grid>
          </Grid>
        </Grid>
      ))}
    </Grid>
  );
}

export default CourseDetails;
