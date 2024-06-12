import React from 'react';
import { Box, Typography } from '@mui/material';
import workInProgressImage from 'src/assets/workprogress3.jpg'; // Adjust the path if necessary

const CourseOperation = () => (
  <Box
    display="flex"
    flexDirection="column"
    alignItems="center"
    justifyContent="center"
    height="70vh" // Adjusted height to make the component smaller
    textAlign="center"
    bgcolor="inherit"
    p={1} // Adjusted padding to make the component smaller
  >
    <Box mb={1}>
      <img 
        src={workInProgressImage} 
        alt="Work in Progress" 
        style={{ maxWidth: '200px', height: 'auto' }} // Adjusted max width to make the image smaller
      />
    </Box>
    <Typography variant="h4" color="textPrimary" gutterBottom>
      Work in Progress
    </Typography>
    <Typography variant="body2" color="textSecondary"> {/* Adjusted variant to make the text smaller */}
      We are currently working on this section. Please check back later !
          Lastest Coureses will be added soon...!
    </Typography>
  </Box>
);

export default CourseOperation;
