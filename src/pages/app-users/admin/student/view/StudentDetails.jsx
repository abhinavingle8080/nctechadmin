import React from 'react';
import moment from 'moment';
import propTypes from 'prop-types';
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

StudentDetails.propTypes = {
  data: propTypes.object,
};

function StudentDetails({ data }) {
  const studentData = [
    {
      label: 'Name',
      value: data?.first_name ? `${data?.first_name} ${data?.last_name}` : "N/A"
    },
    {
      label: 'Phone Number',
      value: data?.phone_no ? `${data?.country_code} ${data?.phone_no}` : 'N/A',
    },
    {
      label: 'Email',
      value: data?.email ? data.email : 'N/A',

    },
    {
      label: 'Birth Date',
      value: data?.birth_date ? moment(data.birth_date).format('DD/MM/YYYY') : 'N/A',
    },
    {
      label: 'Phone Number',
      value: data?.phone_no ? `${data?.country_code} ${data?.phone_no}` : 'N/A',
    },
    {
      label: 'Education',
      value: data?.education ? data.education : 'N/A',
    },
    {
      label: 'College',
      value: data?.college ? data.college : 'N/A',
    },
    {
      label: 'Parents Contact Number',
      value: data?.parents_contact_no ? `${data?.country_code} ${data?.parents_contact_no}` : 'N/A',
    },
    {
      label: 'Profile Image',
      value: data?.profile_image ? <img src={data.profile_image} alt="Profile" /> : 'N/A',
    },
    {
      label: 'ID Proof',
      value: data?.id_proof ? data.id_proof : 'N/A',
    },
    {
      label: 'Admission Date',
      value: data?.admission_date ? moment(data.admission_date).format('DD/MM/YYYY') : 'N/A',
    },
    {
      label: 'Status',
      value: data?.status ? data.status : 'N/A',
    },
    {
      label: 'Course',
      value: data?.Course ? data.Course.course_name : 'N/A',
    },

  ];

  return (
    <Grid container spacing={3} margin={0} width="100%">
      {studentData.map((item, index) => (
        <Grid
          item
          xs={12}
          md={6}
          style={{
            ...styles.gridItem,
            ...(studentData.length === 2 ? styles.noBorderBottom : {}),
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

export default StudentDetails;
