import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';

import { Box, Grid, Card, Link, Divider, Typography, CardContent } from '@mui/material';
import { Image, Attachment, PictureAsPdf } from '@mui/icons-material';
import ExcelIcon from '../../../../../../public/assets/icons/glass/icon-excel.svg';
import WordIcon from '../../../../../../public/assets/icons/glass/icon-word.svg';

const styles = {
    gridItem: {
        borderBottom: '1px solid black',
        paddingTop: 0,
        paddingBottom: '1rem',
    },
    noBorderBottom: {
        borderBottom: 'none',
    },
    attachmentContainer: {
        display: 'flex',
        alignItems: 'center',
    },
    attachmentIcon: {
        marginRight: '0.5rem',
    },
};

function getFileTypeIcon(fileType) {
    switch (fileType) {
        case 'pdf':
            return <PictureAsPdf />;
        case 'jpg':
        case 'jpeg':
        case 'png':
            return <Image />;
        case 'xls':
        case 'xlsx':
            return <img src={ExcelIcon} alt="Excel Icon" />; // You can replace with an Excel icon if available
        case 'doc':
        case 'docx':
            return <img src={WordIcon} alt="Word Icon" />;
        default:
            return <Attachment />;
    }
}

const NoticeDetails = ({ data }) => {
    const dummyData = [
        {
            label: 'Title',
            value: data ? data?.title : 'N/A',
        },
        {
            label: 'Content',
            value: data ? data?.content : 'N/A',
        },
        {
            label: 'Posted By',
            value: data ? data?.posted_by : 'N/A',
        },
        {
            label: 'Date Posted',
            value: data?.date_posted ? moment(data?.date_posted).format('DD/MM/YYYY') : 'N/A',
        },
        {
            label: 'Expiration Date',
            value: data?.expiration_date ? moment(data?.expiration_date).format('DD/MM/YYYY') : 'N/A',
        },
        {
            label: 'Category',
            value: data ? data?.category : 'N/A',
        },
        {
            label: 'Tags',
            value: data ? data?.tags : 'N/A',
        },
        {
            label: 'Visibility',
            value: data ? data?.visibility : 'N/A',
        },
        {
            label: 'Status',
            value: data ? data?.status : 'N/A',
        },
        {
            label: 'Priority',
            value: data ? data?.priority : 'N/A',
        },
        {
            label: 'Attachments',
            value: data?.attachments ? (
                <Link href={`http://localhost:8020/storage/images/${data.attachments}`} target="_blank" rel="noopener noreferrer">
                    <Box style={styles.attachmentContainer}>
                        <Box style={styles.attachmentIcon}>{getFileTypeIcon(data.attachments.split('.').pop())}</Box>
                        <Typography variant="body1">{data.attachments.split('/').pop()}</Typography>
                    </Box>
                </Link>
            ) : 'N/A',
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
                    <Card>
                        <CardContent>
                            <Typography variant="h6">{item.label}</Typography>
                            <Typography variant="body1">{item.value}</Typography>
                            {item.value === 'Attachments' && item.value}
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
};

NoticeDetails.propTypes = {
    data: PropTypes.object,
};

export default NoticeDetails;