import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';

// @mui
import { Container } from '@mui/material';

// sections
import HolidayForm from './HolidayForm';
import ViewHoliday from './view/ViewHoliday';
// components
import Page from '../../../../components/Page';
// hooks
import useSettings from '../../../../hooks/useSettings';
import { getHolidayApi } from '../../../../apis/admin/holiday/HolidayApis';
import HeaderBreadcrumbs from '../../../../components/HeaderBreadcrumbs';


// ----------------------------------------------------------------------

export default function HolidayOperation() {
  const { themeStretch } = useSettings();
  const { pathname } = useLocation();
  const { id = '' } = useParams();
  const isEdit = pathname.includes('edit');
  const isView = pathname.includes('view');
  const [data, setData] = useState({});

  let name;
  let heading;
  const mainTitle = 'Holidays';
  const title = 'Holiday';

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

  const getHoliday = (holidayId) => {
    if (isEdit || isView) {
      getHolidayApi({ holiday_id: holidayId })
        .then((res) => {
          setData(res?.data?.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  useEffect(
    () => {
      getHoliday(id);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [id]
  );

  return (
    <Page title={`${name} Leave`}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={heading}
          links={[
            { name: 'Dashboard', href: '/user/dashboard' },
            { name: `${mainTitle}`, href: '/user/holidays' },
            { name: `${name} ${title}` },
          ]}
        />

        {isView ? (
          <ViewHoliday details={data} logs={data} />
        ) : (
          <HolidayForm isEdit={isEdit} data={data} />
        )}
      </Container>
    </Page>
  );
}
