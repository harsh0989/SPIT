// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const dataConfig = [
    {
        title: 'Exfiltration 1',
        path: '/detection/exfiltration1',
        icon: icon('ic_analytics'),
    },
    // {
    //   title: 'Employees',
    //   path: '/dashboard/user',
    //   icon: icon('ic_user'),
    // },
    {
        title: 'news',
        path: '/dashboard/news',
        icon: icon('ic_cart'),
    },
    // {
    //   title: 'blog',
    //   path: '/dashboard/blog',
    //   icon: icon('ic_blog'),
    // },
    // {
    //   title: 'Add Product',
    //   path: '/dashboard/scanbarcode',
    //   icon: icon('ic_add')
    // },
    // {
    //   title: 'schedule',
    //   path: '/dashboard/schedule',
    //   icon: icon('ic_schedule')
    // },
];

export default dataConfig;