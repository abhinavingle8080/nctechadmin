import { useState, useEffect } from 'react';
import {useParams, useLocation, Link as RouterLink} from 'react-router-dom';

// @mui
import { Stack, Button,  Container } from '@mui/material';
import moment from 'moment';

// sections
import PaymentForm from './PaymentForm';
import ViewPayment from './view/ViewPayment';
// components
import Page from '../../../../components/Page';
// hooks
import useSettings from '../../../../hooks/useSettings';
import { getPaymentApi } from '../../../../apis/admin/payment/PaymentsApis';
import HeaderBreadcrumbs from '../../../../components/HeaderBreadcrumbs';

// ----------------------------------------------------------------------

export default function PaymentOperation() {
  const { themeStretch } = useSettings();
  const { pathname } = useLocation();
  const { id = '' } = useParams();
  const isEdit = pathname.includes('edit');
  const isView = pathname.includes('view');
  const [data, setData] = useState({});

  let name;
  let heading;
  const mainTitle = 'Payments';
  const title = 'Payment';

  if (isEdit) {
    name = 'Update';
    heading = `Update ${title}`;
  } else if (isView) {
    name = 'View';
    heading = `View ${title}`;
  } else {
    name = 'Create';
    heading = `Create ${title}`;
  }

  useEffect(() => {
    const getPayment = (paymentId) => {
      if (isEdit || isView) {
        getPaymentApi({ payment_id: paymentId })
          .then((res) => {
            setData(res?.data?.data);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    };

    getPayment(id);
  }, [id, isEdit, isView]);

  const handleDownload = async (url) => {
    try {
      if (!url) {
        return;
      }

      const studenName = `${data?.Student?.first_name}-${data?.Student?.last_name}`;
      const formattedDate = data?.created_at ? moment(data?.created_at).format('DD-MM-YYYY') : '';

      const fileName = `${studenName}-${formattedDate}.pdf`;

      const response = await fetch(url);
      const blob = await response.blob();
      const urlBlob = window.URL.createObjectURL(blob);

      const anchor = document.createElement('a');
      anchor.href = urlBlob;
      anchor.download = fileName;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);

      window.URL.revokeObjectURL(urlBlob);
    } catch (error) {
      console.error('Failed to download file:', error);
    }
  };

  return (
    <Page title={`${name} ${title}`}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <HeaderBreadcrumbs
          heading={heading}
          links={[
            { name: 'Dashboard', href: '/admin/dashboard' },
            { name: `${mainTitle}`, href: '/admin/payments' },
            { name: `${name} ${title}` },
          ]}
        />
        {
          isView ? (
            <Button variant="contained" to="/admin/payments/add" component={RouterLink} color="inherit"
             onClick={() => handleDownload(data?.invoice_url)}>
            Download Invoice
          </Button>
          ) : (
            null
          )
        }
     
        </Stack>

        {isView ? (
          <ViewPayment details={data} logs={data} />
        ) : (
          <PaymentForm isEdit={isEdit} data={data} />
        )}
      </Container>
    </Page>
  );
}
