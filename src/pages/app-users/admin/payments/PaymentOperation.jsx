import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';

// @mui
import { Container } from '@mui/material';

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

        {isView ? (
          <ViewPayment details={data} logs={data} />
        ) : (
          <PaymentForm isEdit={isEdit} data={data} />
        )}
      </Container>
    </Page>
  );
}
