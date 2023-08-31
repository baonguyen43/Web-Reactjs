import Login from 'modules/LoginAmes_AiModule/components/LoginComponent';
import Register from 'modules/RegisterModule/components/RegisterComponent';
import Teacher from 'modules/TeacherModule/components/TeacherComponent';
import LiveWorkSheetReview from 'pages/LiveWorkSheetReview';

const sharedRoutes = [
  {
    path: '/login',
    name: 'Login',
    icon: 'ni ni-calendar-grid-58 text-red',
    component: Login,
    layout: '/auth',
    showInSidebar: false
  },
  {
    path: '/register',
    name: 'Register',
    icon: 'ni ni-calendar-grid-58 text-red',
    component: Register,
    layout: '/auth',
    showInSidebar: false
  },
  {
    path: '/teacher',
    name: 'Register',
    icon: 'ni ni-calendar-grid-58 text-red',
    component: Teacher,
    layout: '/auth',
    showInSidebar: false
  },
  {
    path: '/assigments-preview',
    name: 'Xem trước bài tập',
    icon: 'fas fa-book text-green',
    component: LiveWorkSheetReview,
    layout: '/preview',
    showInSidebar: false
  },
];

export default sharedRoutes;