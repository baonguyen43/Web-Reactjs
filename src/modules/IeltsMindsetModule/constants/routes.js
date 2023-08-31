import Login from '../Pages/Login'
import Home from '../Pages/Ebook';

export const routePaths = {
  Login: '/',
  Dashboard: '/dashboard',
  QuestionType: '/dashboard/:book/:type/:id/:index',
  NotFound: '*',
}

export const routes = [
  {
    exact: true,
    protected: true,
    component: Login,
    path: routePaths.Login,
  },
  {
    exact: true,
    protected: true,
    component: Home,
    path: [routePaths.Dashboard, routePaths.QuestionType],
  },
  {
    exact: false,
    protected: false,
    component: () => "404 NOT FOUND",
    path: routePaths.NotFound,
  }
]

export default routes;
