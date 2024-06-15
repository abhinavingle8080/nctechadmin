import { useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';

// @mui
import { Container } from '@mui/material';

// sections
import CourseForm from './CourseForm';
import ViewCourse from './view/ViewCourse'; // Adjust import path as per your project structure

// components
import Page from '../../../../components/Page';
import HeaderBreadcrumbs from '../../../../components/HeaderBreadcrumbs';

// hooks
import useSettings from '../../../../hooks/useSettings';

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

  // Commented out API fetching code
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       if (isEdit || isView) {
  //         const response = await getCourseApi({ course_id: id });
  //         setData(response?.data?.data);
  //       }
  //     } catch (error) {
  //       console.error('Error fetching course data:', error);
  //     }
  //   };

  //   fetchData();
  // }, [id, isEdit, isView]);

  return (
    <Page title={`${name} Course`}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={heading}
          links={[
            { name: 'Dashboard', href: '/admin/dashboard' },
            { name: `${mainTitle}`, href: '/admin/courses' },
            { name: `${name} ${title}` },
          ]}
        />

        {/* Displaying either ViewCourse or CourseForm based on isView */}
        {isView ? (
          <ViewCourse details={data} logs={data} />
        ) : (
          <CourseForm isEdit={isEdit} data={data} />
        )}
      </Container>
    </Page>
  );
}
