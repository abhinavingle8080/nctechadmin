import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);



const navConfig = [
  {
    title: 'dashboard',
    path: '/admin/dashboard',
    icon: icon('dashboard'),
  },
  // {
  //   title: 'Employee',
  //   path: '/admin/employees',
  //   icon: icon('ic_user'),
  // },
{
  title: 'Students',
  path: '/admin/students',
  icon: icon('ic_user'),
},
// {
//   title: 'Batches',
//   path: '/admin/teachers',
//   icon: icon('ic_user'),    
// },
{
  title: 'Courses',
  path: '/admin/courses',
  icon: icon('ic_user'),  
},
{
  title: 'Payments',
  path: '/admin/payments',
  icon: icon('ic_user'),
},
// {
//   title: 'Holiday',
//   path: '/admin/holidays',
//   icon: icon('holiday'),
// },
// {
//   title: 'Admission Sections',
//   path: '/admin/subjects',
//   icon: icon('ic_user'),
// },

  
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
];

export default navConfig;





// import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

// const icon = (name) => (
//   <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
// );

// const navConfig = [
//   {
//     title: 'Master',
//     icon: icon('ic_master'),
//     subNav: [
//       {
//         title: 'Designation',
//         path: '/admin/designations',
//         icon: icon('ic_blog'),
//       },
//     ],
//   },
//   {
//     title: 'Dashboard',
//     path: '/admin/dashboard',
//     icon: icon('dashboard'),
//   },
//   {
//     title: 'Employee',
//     path: '/admin/employees',
//     icon: icon('ic_user'),
//   },
//   {
//     title: 'Holiday',
//     path: '/admin/holidays',
//     icon: icon('holiday'),
//   },
//   {
//     title: 'Leave',
//     path: '/admin/leaves',
//     icon: icon('ic_blog'),
//   },
// ];

// export default navConfig;
