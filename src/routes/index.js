/* !

=========================================================
* Argon Dashboard PRO React - v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-pro-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import _ from 'lodash';

import teacherRoutes from './teacherRoutes'
import studentRoutes from './studentRoutes';
import sharedRoutes from './sharedRoutes';

const allRoutes = _.concat(sharedRoutes, studentRoutes, teacherRoutes);

export default allRoutes;
