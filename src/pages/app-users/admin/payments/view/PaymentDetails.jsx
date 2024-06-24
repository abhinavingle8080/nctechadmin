import React from 'react';
import {Box, Grid, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import moment from 'moment';

const styles = {
  gridItem: {
    borderBottom: '1px solid #ddd',
    paddingTop: '8px',
    paddingBottom: '8px',
  },
  noBorderBottom: {
    borderBottom: 'none',
  },
  container: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '24px',
    maxWidth: '800px',
    margin: 'auto',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f9f9f9',
  },
  header: {
    borderBottom: '1px solid #ddd',
    marginBottom: '24px',
    paddingBottom: '16px',
    textAlign: 'center',
  },
  section: {
    marginBottom: '24px',
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: '16px',
  },
  totalAmount: {
    fontWeight: 'bold',
    fontSize: '18px',
  },
};

PaymentDetails.propTypes = {
  data: PropTypes.object,
};

function PaymentDetails({ data }) {
  const details = [
    { label: 'Invoice Number ', value: data?.invoice_number || 'N/A' },
    { label: 'Student Name  ', value: data?.Student ? `${data?.Student?.first_name} ${data?.Student?.last_name}` : 'N/A' },
    { label: 'Course  ', value: data?.Course ? data?.Course?.course_name : 'N/A' },
    { label: 'Payment Method  ', value: data?.payment_method || 'N/A' },
    { label: 'Total Fees Amount  ', value: data?.Course ? `Rs.${data?.Course?.fees}` : 'N/A' },
    { label: 'Discount Amount  ', value: data?.Course ? `Rs.${data?.Course?.discount_fees}` : 'N/A' },
    { label: 'Paid Amount  ', value: data?.paid_amount ? `Rs.${data?.paid_amount}` : 'N/A' },
    { label: 'Due Amount  ', value: data?.due_amount ? `Rs.${data?.due_amount}` : 'N/A' },
    { label: 'Payment Date  ', value: data?.payment_date ? moment(data?.payment_date).format('DD/MM/YYYY') : 'N/A' },
    { label: 'Payment Status ', value : data?.payment_status || 'N/A' },
  ];

  return (
    <Box style={styles.container}>
      <Box style={styles.header}>
        <Typography variant="h4">Payment Details</Typography>
      </Box>
      <Grid container spacing={2}>
        {details.map((item, index) => (
          <Grid
            item
            xs={12}
            md={6}
            style={{
              ...styles.gridItem,
              ...(index === details.length - 1 ? styles.noBorderBottom : {}),
            }}
            key={index}
          >
            <Grid container>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" style={styles.sectionTitle}>{item.label}</Typography>
              </Grid>
              <Grid item xs={12} md={8}>
                <Typography variant="body1">{item.value}</Typography>
              </Grid>
            </Grid>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default PaymentDetails;
