import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';

// @mui
import { Container } from '@mui/material';

// sections
import CourseForm from './CourseForm';
import ViewCourse from './view/ViewCourse';
// components
import Page from '../../../../components/Page';
// hooks
import useSettings from '../../../../hooks/useSettings';
import { getCourseApi } from '../../../../apis/admin/course/CourseApis';
import HeaderBreadcrumbs from '../../../../components/HeaderBreadcrumbs';

// ----------------------------------------------------------------------

export default function CourseOperation() {
  const { themeStretch } = useSettings();
  const { pathname } = useLocation();
  const { id = '' } = useParams();
  const isEdit = pathname.includes('edit');
  const isView = pathname.includes('view');
  const [data, setData] = useState({});

  let name;
  let heading;
  const mainTitle = 'Courses';
  const title = 'Course';

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

  const getCourse = (courseId) => {
    if (isEdit || isView) {
      getCourseApi({ course_id: courseId })
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
      getCourse(id);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [id]
  );

  return (
    <Page title={`${name} Course`}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={heading}
          links={[
            { name: 'Dashboard', href: '/user/dashboard' },
            { name: `${mainTitle}`, href: '/user/courses' },
            { name: `${name} ${title}` },
          ]}
        />

        {isView ? (
          <ViewCourse details={data} logs={data} />
        ) : (
          <CourseForm isEdit={isEdit} data={data} />
        )}
      </Container>
    </Page>
  );
}
