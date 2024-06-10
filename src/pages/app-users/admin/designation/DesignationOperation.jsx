import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';

import { Container } from '@mui/material';

import DesignationForm from './DesignationForm';
import ViewDesignation from './view/ViewDesignation';

import Page from '../../../../components/Page';

import useSettings from '../../../../hooks/useSettings';
import { getDesignationApi } from '../../../../apis/admin/designation/DesignationApis';
import HeaderBreadcrumbs from '../../../../components/HeaderBreadcrumbs';

export default function DesignationOperation() {
  const { themeStretch } = useSettings();
  const { pathname } = useLocation();
  const { id = '' } = useParams();
  const isEdit = pathname.includes('edit');
  const isView = pathname.includes('view');
  const [data, setData] = useState({});

  let name;
  let heading;
  const mainTitle = 'Designations';
  const title = 'Designation';

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

  const getDesignation = (designationId) => {
    if (isEdit || isView) {
      getDesignationApi({ designation_id: designationId })
        .then((res) => {
          setData(res?.data?.data);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  useEffect(() => {
    getDesignation(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <Page title={`${name} Designation`}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={heading}
          links={[
            { name: 'Dashboard', href: '/admin/dashboard' },
            { name: `${mainTitle}`, href: '/admin/designations' },
            { name: `${name} ${title}` },
          ]}
        />

        {isView ? (
          <ViewDesignation details={data} />
        ) : (
          <DesignationForm isEdit={isEdit} data={data} />
        )}
      </Container>
    </Page>
  );
}
