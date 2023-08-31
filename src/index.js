import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
// react library for routing
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
// bootstrap rtl for rtl support page
import 'assets/vendor/bootstrap-rtl/bootstrap-rtl.scss';
// plugins styles from node_modules
import 'react-notification-alert/dist/animate.css';
import 'react-perfect-scrollbar/dist/css/styles.css';
// plugins styles downloaded
import 'assets/vendor/fullcalendar/dist/fullcalendar.min.css';
import 'assets/vendor/sweetalert2/dist/sweetalert2.min.css';
import 'assets/vendor/select2/dist/css/select2.min.css';
import 'assets/vendor/quill/dist/quill.core.css';
import 'assets/vendor/nucleo/css/nucleo.css';
import 'assets/vendor/@fortawesome/fontawesome-free/css/all.min.css';

// core styles
import 'assets/scss/argon-dashboard-pro-react.scss?v1.1.0';
import 'antd/dist/antd.css';
import 'index.css';
////redux
import { Provider, useSelector } from 'react-redux';
import { persistor, store } from './rootStore';
import { PersistGate } from 'redux-persist/integration/react';

import AdminLayout from 'layouts/Admin.js';
import RTLLayout from 'layouts/RTL.js';
import AuthLayout from 'layouts/Auth.js';
import LiveWorkSheetReview from 'pages/LiveWorkSheetReview';

const AuthenticateWrapper = ({ childProps, component }) => {
  const { pathname, search } = childProps.location;

  const loggedInUser = useSelector((state) => state.teacherReducer.loggedInUser ?? state.loginReducer.loggedInUser);

  if (loggedInUser === null) {
    const authRoutes = '/auth/';

    if (pathname === '/' || pathname.includes(authRoutes)) return component;

    return <Redirect from="*" to="/" />;
  }

  let to = pathname + search;

  if (loggedInUser?.typeLogin === 'teacher') {
    // to = '/ames/teacher/assigments-management';
  } else if (to.includes('/ames/') === false) {
    to = '/ames/';
  }

  return (
    <React.Fragment>
      <Redirect to={to} />
      {component}
    </React.Fragment>
  );
};

AuthenticateWrapper.propTypes = {
  component: PropTypes.node.isRequired,
  childProps: PropTypes.instanceOf(Object).isRequired,
};

// Create a query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  React.useEffect(() => {
    const isMobile = () => {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    };
    if (!isMobile()) {
      document.body.classList.replace('g-sidenav-hidden', 'g-sidenav-pinned');
    } else {
      document.body.classList.replace('g-sidenav-pinned', 'g-sidenav-hidden');
    }
  }, []);
  return (
    <DndProvider backend={HTML5Backend}>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <BrowserRouter>
              <Switch>
                <Route path="/preview/:id" component={LiveWorkSheetReview} />
                <Route
                  path="/ames"
                  render={(props) => <AuthenticateWrapper childProps={props} component={<AdminLayout {...props} />} />}
                />
                <Route
                  path="/rtl"
                  render={(props) => <AuthenticateWrapper childProps={props} component={<RTLLayout {...props} />} />}
                />
                <Route
                  path="/auth"
                  render={(props) => <AuthenticateWrapper childProps={props} component={<AuthLayout {...props} />} />}
                />
                {/* <Route
              path="/"
              render={(props) => (
                <AuthenticateWrapper childProps={props} component={<IndexView {...props} />} />
              )}
            /> */}
                <Redirect from="*" to="/auth/" />
              </Switch>
            </BrowserRouter>
          </PersistGate>
        </Provider>
      </QueryClientProvider>
    </DndProvider>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
