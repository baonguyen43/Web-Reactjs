import AssignmentsManagement from 'modules/TeacherModule/components/AssignmentsManagement/components';
import Classes from 'modules/TeacherModule/components/Classes';
import ExerciseList from 'modules/TeacherModule/components/Classes/components/ExerciseList';
import StudentList from 'modules/TeacherModule/components/Classes/components/StudentList';

const teacherRoutes = [
  {
    path: '/teacher/assigments-management',
    name: 'Quản lý bài tập',
    icon: 'fas fa-book text-green',
    component: AssignmentsManagement,
    layout: '/ames',
    exact: true,
    // showInSidebar: false
  },
  {
    path: '/teacher/classes',
    name: 'Quản lý lớp học',
    icon: 'fas fa-book-open text-blue',
    component: Classes,
    layout: '/ames',
    exact: true,
    showInSidebar: true,
  },
  {
    path: '/teacher/classes/:classId',
    component: StudentList,
    layout: '/ames',
    exact: true,
    roles: ['teacher'],
  },
  {
    path: '/teacher/classes/:classId/ExerciseList/:studentId',
    component: ExerciseList,
    layout: '/ames',
    exact: true,
    roles: ['teacher'],
  },
];

export default teacherRoutes.map((x) => ({ ...x, role: 'teacher' }));
