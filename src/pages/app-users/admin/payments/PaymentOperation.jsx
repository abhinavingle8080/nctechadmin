import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Container } from '@mui/material';
import PaymentForm from './PaymentForm'; // Ensure this is the correct path and has a default export
import ViewPayment from './view/ViewPayment'; // Ensure this is the correct path and has a default export
import Page from '../../../../components/Page';
import useSettings from '../../../../hooks/useSettings';
import { getPaymentApi } from '../../../../apis/admin/payment/PaymentsApis'; // Ensure this is the correct path
import HeaderBreadcrumbs from '../../../../components/HeaderBreadcrumbs';

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
            console.log('Payment data fetched:', res?.data?.data); // Debug log
            setData(res?.data?.data);
          })
          .catch((err) => {
            console.error('Error fetching payment data:', err); // Debug log
          });
      }
    };

    getPayment(id);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  console.log('Rendering PaymentOperation with data:', data); // Debug log

  return (
    <Page title={`${name} Payment`}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={heading}
          links={[
            { name: 'Dashboard', href: '/admin/dashboard' },
            { name: `${mainTitle}`, href: '/admin/payments' },
            { name: `${name} ${title}` },
          ]}
        />

        {isView && (
          <ViewPayment details={data} logs={data} />
        )}
        
        {!isView && (
          <PaymentForm isEdit={isEdit} data={data} />
        )}
      </Container>
    </Page>
  );
}
