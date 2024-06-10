import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';

// @mui
import { Container } from '@mui/material';

// sections
import NoticeForm from './NoticeForm';
import ViewNotice from './view/ViewNotice';
// components
import Page from '../../../../components/Page';
// hooks
import useSettings from '../../../../hooks/useSettings';
import { getNoticeApi } from '../../../../apis/admin/notice/NoticeApis'; // Assuming this is the correct import for getNoticeApis
import HeaderBreadcrumbs from '../../../../components/HeaderBreadcrumbs';


// ----------------------------------------------------------------------

export default function NoticeOperation() {
  const { themeStretch } = useSettings();
  const { pathname } = useLocation();
  const { id = '' } = useParams();
  const isEdit = pathname.includes('edit');
  const isView = pathname.includes('view');
  const [data, setData] = useState({});

  let name;
  let heading;
  const mainTitle = 'Notices';
  const title = 'Notice';

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

  const getNotice = (noticeId) => {
    if (isEdit || isView) {
      getNoticeApi({ notice_id: noticeId })
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
      getNotice(id);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [id]
  );

  return (
    <Page title={`${name} Notices`}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={heading}
          links={[
            { name: 'Dashboard', href: '/admin/dashboard' },
            { name: `${mainTitle}`, href: '/admin/notices' },
            { name: `${name} ${title}` },
          ]}
        />

        {isView ? (
          <ViewNotice details={data} logs={data} />
        ) : (
          <NoticeForm isEdit={isEdit} data={data} />
        )}
      </Container>
    </Page>
  );
}
