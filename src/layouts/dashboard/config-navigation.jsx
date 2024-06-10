import SvgColor from 'src/components/svg-color';

// Function to generate SVG icons
const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

// Navigation configuration array
const navConfig = [
  {
    title: 'dashboard',         // Title for dashboard
    path: '/user/dashboard',    // Path for dashboard
    icon: icon('dashboard'),    // Icon for dashboard
  },
  {
    title: 'Employee',          // Title for Employee section
    path: '/employees',         // Path for Employee section
    icon: icon('ic_user'),      // Icon for Employee section
  },
  // Commented out sections
  // {
  //   title: 'Holiday',
  //   path: '/user/holidays',
  //   icon: icon('holiday'),
  // },
  // {
  //   title: 'Leave',
  //   path: '/user/leaves',
  //   icon: icon('ic_blog'),
  // },
  // {
  //   title: 'Notices',
  //   path: '/user/notices',
  //   icon: icon('ic_blog'),
  // },
  // {
  //   title: 'login',
  //   path: '/login',
  //   icon: icon('ic_lock'),
  // },
  // {
  //   title: 'Not found',
  //   path: '/404',
  //   icon: icon('ic_disabled'),
  // },
  {
    title: 'Students',  // Title for Students section
    path: '/students',  // Path for Students section
    icon: icon('ic_user'),  // Icon for Students section
  },
  {
    title: 'Batches',  // Title for Batches section
    path: '/batches',  // Path for Batches section
    icon: icon('ic_batches'),  // Icon for Batches section
  },
  {
    title: 'Courses',  // Title for Courses section
    path: '/courses',  // Path for Courses section
    icon: icon('ic_courses'),  // Icon for Courses section
  },
  {
    title: 'Holiday',  // Title for Holiday section
    path: '/holidays',  // Path for Holiday section
    icon: icon('ic_holiday'),  // Icon for Holiday section
  },
  {
    title: 'Admission',  // Title for Admission section
    path: '/admission',  // Path for Admission section
    icon: icon('ic_admission'),  // Icon for Admission section
  },
];

export default navConfig;
