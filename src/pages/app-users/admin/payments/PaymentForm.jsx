// PaymentForm.jsx

import React from 'react';
import propTypes from 'prop-types';

// Define your form component here
function PaymentForm({ isEdit, data }) {
  // Your form implementation
  return (
    <div>
      <h1>{isEdit ? 'Edit Payment' : 'Create Payment'}</h1>
      {/* Your form fields and logic here */}
    </div>
  );
}

// Specify prop types
PaymentForm.propTypes = {
  isEdit: propTypes.bool.isRequired,
  data: propTypes.object.isRequired,
};

// Export the component as the default export
export default PaymentForm;
