import SvgColor from 'src/components/svg-color';

// Function to generate SVG icons
const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

// Navigation configuration array
const navConfig = [
  {
    title: 'dashboard',         // Title for dashboard
    path: '/admin/dashboard',    // Path for dashboard
    icon: icon('dashboard'),    // Icon for dashboard
  },

  {
     title: 'Employees',
     path: '/admin/employees',
     icon: icon('ic_user'),
  },
 
{
  title: 'Students',
  path: '/admin/students',
  icon: icon('ic_user'),
},
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
];

export default navConfig;
