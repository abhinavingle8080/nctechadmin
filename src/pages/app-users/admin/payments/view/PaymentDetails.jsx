import React from 'react';
import { Box, Grid, Divider, Typography } from '@mui/material'; // Add Divider to the import statement
import PropTypes from 'prop-types';
import moment from 'moment';

const styles = {
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
    marginBottom: '24px',
    textAlign: 'center',
  },
  section: {
    marginBottom: '24px',
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: '8px',
  },
  gridItem: {
    borderBottom: '1px solid #ddd',
    paddingTop: '8px',
    paddingBottom: '8px',
  },
  noBorderBottom: {
    borderBottom: 'none',
  },
  tableHeader: {
    backgroundColor: '#f0f0f0',
    fontWeight: 'bold',
  },
  tableRow: {
    borderBottom: '1px solid #ddd',
  },
  tableCell: {
    padding: '8px',
  },
};

PaymentDetails.propTypes = {
  data: PropTypes.object,
};

function PaymentDetails({ data }) {
  const details = [
    { label: 'Invoice Number', value: data?.invoice_number || 'N/A' },
    {
      label: 'Student Name',
      value: data?.Student ? `${data?.Student?.first_name} ${data?.Student?.last_name}` : 'N/A',
    },
    { label: 'Course', value: data?.Course ? data?.Course?.course_name : 'N/A' },
    { label: 'Payment Method', value: data?.payment_method || 'N/A' },
    { label: 'Total Fees Amount', value: data?.Course ? `Rs.${data?.Course?.fees}` : 'N/A' },
    { label: 'Discount Amount', value: data?.Course ? `Rs.${data?.Course?.discount_fees}` : 'N/A' },
    { label: 'Paid Amount', value: data?.paid_amount ? `Rs.${data?.paid_amount}` : 'N/A' },
    { label: 'Due Amount', value: data?.due_amount ? `Rs.${data?.due_amount}` : 'N/A' },
    {
      label: 'Payment Date',
      value: data?.payment_date ? moment(data?.payment_date).format('DD/MM/YYYY') : 'N/A',
    },
    { label: 'Payment Status', value: data?.payment_status || 'N/A' },
  ];

  return (
    <Box style={styles.container}>
      <Box style={styles.header}>
        <Typography variant="h4">INVOICE</Typography>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Typography variant="h5" style={styles.sectionTitle}>
            Company Name
          </Typography>
          <Typography variant="body1">Non Criterion Technology Buldhana</Typography>
          <Typography variant="body1">Saraswati Apartment Circular Road Buldhana </Typography>
          <Typography variant="body1">Maharashtra 443001</Typography>
          <Typography variant="body1">Phone : 9309393108</Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="body1" style={styles.sectionTitle}>
                INVOICE{' '}
              </Typography>
              <Typography variant="body1">{data?.invoice_number || 'N/A'}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1" style={styles.sectionTitle}>
                DATE
              </Typography>
              <Typography variant="body1">
                {data?.payment_date ? moment(data?.payment_date).format('DD/MM/YYYY') : 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              {/* <Typography variant="body1" style={styles.sectionTitle}>Student ID</Typography>
              <Typography variant="body1">{data?.id || 'N/A'}</Typography> */}
            </Grid>
            <Grid item xs={6}>
              {/* <Typography variant="body1" style={styles.sectionTitle}>TERMS</Typography>
              <Typography variant="body1">Due Upon Receipt</Typography> */}
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Divider style={{ margin: '24px 0' }} />

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" style={styles.sectionTitle}>
            BILL TO
          </Typography>
          <Typography variant="body1">
            {data?.Student ? `${data?.Student?.first_name} ${data?.Student?.last_name}` : 'N/A'}
          </Typography>
          <Typography variant="body1">{data?.Student?.address || 'N/A'}</Typography>
          {/* <Typography variant="body1">Course : {data?.Course?.course_name || 'N/A'}</Typography> */}
          {/* <Typography variant="body1">[City, ST ZIP]</Typography> */}
          <Typography variant="body1">{data?.Student?.phone_no || 'N/A'}</Typography>
          <Typography variant="body1">{data?.Student?.email || 'N/A'}</Typography>
        </Grid>
      </Grid>

      <Divider style={{ margin: '24px 0' }} />

      <Box>
        <Grid container style={styles.tableHeader}>
          <Grid item xs={6} style={styles.tableCell}>
            <Typography variant="h6">COURSE</Typography>
          </Grid>
          <Grid item xs={2} style={styles.tableCell}>
            <Typography variant="h6">TYPE</Typography>
          </Grid>
          <Grid item xs={2} style={styles.tableCell}>
            {/* <Typography variant="body1">PAID AMOUNT</Typography> */}
          </Grid>
          <Grid item xs={2} style={styles.tableCell}>
            <Typography variant="h6">AMOUNT</Typography>
          </Grid>
        </Grid>
        <Grid container style={styles.tableRow}>
          <Grid item xs={6} style={styles.tableCell}>
            <Typography variant="body1">
              {data?.Course?.course_name || 'N/A'} ({data?.Course?.type}){' '}
            </Typography>
          </Grid>
          <Grid item xs={2} style={styles.tableCell}>
            {/* <Typography variant="body1">{data?.Course?.type || 'N/A'}</Typography> */}
          </Grid>
          <Grid item xs={2} style={styles.tableCell}>
            {/* <Typography variant="body1">{data?.paid_amount || 'N/A'}</Typography> */}
          </Grid>
          <Grid item xs={2} style={styles.tableCell}>
            <Typography variant="body1">{data?.Course?.discount_fees || 'N/A'}</Typography>
          </Grid>
        </Grid>
        <Grid container style={styles.tableRow}>
          <Grid item xs={6} style={styles.tableCell}>
            <Typography variant="body1">Paid Amount</Typography>
          </Grid>
          <Grid item xs={2} style={styles.tableCell}>
            <Typography variant="body1">{data?.payment_method || 'N/A'}</Typography>
          </Grid>
          <Grid item xs={2} style={styles.tableCell}>
            {/* <Typography variant="body1">-</Typography> */}
          </Grid>
          <Grid item xs={2} style={styles.tableCell}>
            <Typography variant="body1">{data?.paid_amount || 'N/A'}</Typography>
          </Grid>
        </Grid>
        <Grid container style={styles.tableRow}>
          <Grid item xs={6} style={styles.tableCell}>
            <Typography variant="body1">Remaining Amount</Typography>
          </Grid>
          <Grid item xs={2} style={styles.tableCell}>
            <Typography variant="body1" />
          </Grid>
          <Grid item xs={2} style={styles.tableCell}>
            <Typography variant="body1" />
          </Grid>
          <Grid item xs={2} style={styles.tableCell}>
            <Typography variant="body1">
              {data?.Course?.discount_fees !== undefined && data?.paid_amount !== undefined
                ? (parseFloat(data.Course.discount_fees) - parseFloat(data.paid_amount)).toFixed(2)
                : 'N/A'}
            </Typography>
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs={6} />
          <Grid item xs={4} style={styles.tableCell}>
            <Typography variant="h6" style={styles.totalAmount}>
              TOTAL PAID AMOUNT
            </Typography>
          </Grid>
          <Grid item xs={2} style={styles.tableCell}>
            <Typography variant="h6" style={styles.totalAmount}>
              {data?.paid_amount || 'N/A'}
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default PaymentDetails;
