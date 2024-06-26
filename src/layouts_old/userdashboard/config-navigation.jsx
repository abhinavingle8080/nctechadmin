import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const navConfig = [
  {
    title: 'dashboard',
    path: '/user/dashboard',
    icon: icon('dashboard'),
  },
  // {
  //   title: 'Employee',
  //   path: '/employees',
  //   icon: icon('ic_user'),
  // },
  {
    title: 'Holiday',
    path: '/user/holidays',
    icon: icon('holiday'),
  },
  {
    title: 'Leave',
    path: '/user/leaves',
    icon: icon('ic_blog'),
  },
  {
    title: 'Notices',
    path: '/user/notices',
    icon: icon('ic_blog'),
  },
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
