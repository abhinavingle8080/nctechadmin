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
{
  title: 'Students',
  path: '/admin/students',
  icon: icon('ic_user'),
},
{
  title: 'Batches',
  path: '/admin/teachers',
  icon: icon('ic_user'),    
},
{
  title: 'Courses',
  path: '/admin/subjects',
  icon: icon('ic_user'),  
},
{
  title: 'Holiday',
  path: '/admin/holidays',
  icon: icon('holiday'),
},
{
  title: 'Admission Sections',
  path: '/admin/subjects',
  icon: icon('ic_user'),
},

  
  // {
  //   title: 'Leave',
  //   path: '/admin/leaves',
  //   icon: icon('ic_blog'),
  // },
//  {
//     title: 'Designation',
//     path: '/admin/designations',
//     icon: icon('ic_blog'),
//   },
  // {
  //   title: 'Notices',
  //   path: '/admin/notices',
  //   icon: icon('ic_blog'),
  // },
  // {
  //   title: 'Teams',
  //   path: '/admin/teams',
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
