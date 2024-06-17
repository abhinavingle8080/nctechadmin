// PaymentDetails.jsx

import React from 'react';
import moment from 'moment';
import propTypes from 'prop-types';

import { Grid } from '@mui/material';
import label from 'src/components/label';

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

PaymentDetails.propTypes = {
  data: propTypes.object,
};

function PaymentDetails({ data }) {
  const dummyData = [
    {
      label: 'Student Name',
      value: data?.Student ? `${data.Student.first_name} ${data.Student.last_name}` : 'N/A',
    },
    {
      label: 'Course',
      value: data?.Course ? data.Course.course_name : 'N/A',
    },
    {
      label: 'Payment Method',
      value: data?.payment_method ? data.payment_method : 'N/A',
    },
    // {
    //   label: 'Transaction ID',
    //   value: data?.transaction_id ? data.transaction_id : 'N/A',
    // },
    {
      label: 'Total Fees Amount',
      value: data?.Course ? `Rs.${data.Course.fees}` : 'N/A',
    },
    {
       label: 'Discount Amount',
       value: data?.Course ? `Rs.${data.Course.discount_fees}` : 'N/A',
    },
    {
      label: 'Paid Amount',
      value: data?.paid_amount ? `Rs.${data.paid_amount}` : 'N/A',
    },
    {
      label: 'Due Amount',
      value: data?.due_amount ? `Rs.${data.due_amount}` : 'N/A',
    },
    {
      label: 'Payment Date',
      value: data?.payment_date ? moment(data.payment_date).format('DD/MM/YYYY') : 'N/A',
    },
    {
      label: 'Payment Status',
      value: data?.payment_status ? data.payment_status : 'N/A',
    },
    {
      label: 'Invoice Number',
      value: data?.invoice_number ? data.invoice_number : 'N/A',
    },
   
  ];

  return (
    <Grid container spacing={3} margin={0} width="100%">
      {dummyData?.map((item, index) => (
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
              <h4 style={{ fontSize: '16px' }}>{item?.label}</h4>
            </Grid>
            <Grid item xs={12} md={8}>
              <p>{item?.value}</p>
            </Grid>
          </Grid>
        </Grid>
      ))}
    </Grid>
  );
}

export default PaymentDetails;
