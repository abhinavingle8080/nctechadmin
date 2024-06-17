import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';

// @mui
import { Container } from '@mui/material';

// Sections
import StudentForm from './StudentForm';
import ViewStudent from './view/ViewStudent';

// Components
import Page from '../../../../components/Page';
import HeaderBreadcrumbs from '../../../../components/HeaderBreadcrumbs';

// Hooks
import useSettings from '../../../../hooks/useSettings';
import { getStudentApi } from '../../../../apis/admin/student/StudentApis';

export default function StudentOperation() {
  const { themeStretch } = useSettings();
  const { pathname } = useLocation();
  const { id = '' } = useParams();
  const isEdit = pathname.includes('edit');
  const isView = pathname.includes('view');
  const [data, setData] = useState({});

  let name;
  let heading;
  const mainTitle = 'Students';
  const title = 'Student';

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

  const getStudent = (studentId) => {
    if (isEdit || isView) {
      getStudentApi({ student_id: studentId })
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
      getStudent(id);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [id]
  );

  return (
    <Page title={`${name} ${title}`}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={heading}
          links={[
            { name: 'Dashboard', href: '/admin/dashboard' },
            { name: `${mainTitle}`, href: '/admin/students' },
            { name: `${name} ${title}` },
          ]}
        />

        {isView ? (
          <ViewStudent details={data} logs={data} />
        ) : (
          <StudentForm isEdit={isEdit} data={data} />
        )}
      </Container>
    </Page>
  );
}
