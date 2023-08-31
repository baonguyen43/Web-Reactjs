import Dashboard from 'pages/Dashboard';
// import Dashboard from 'views/pages/dashboards/Dashboard';

// ///Luyện tập từ vựng
import ChooseVocabulary from 'modules/ChooseVocabularyModule/ChooseVocabularyComponent';
import Vocabulary from 'modules/ChooseVocabularyModule/VocabularyComponent';
import StressPosition from 'modules/ChooseVocabularyModule/StressPositionComponent';
// ///// VOA
import VOA from 'modules/VOAModule/components/VOAComponent';
import VOAItemList from 'modules/VOAModule/components/VOAItemList';
// ///// CLASSES
import Classes from 'modules/ClassModule/components/ClassComponent';
// ///// SHARE
import Share from 'pages/Share';
// ///// AUDIO FILE
import AudioFile from 'pages/AudioFile';
// ///// Course Code
import CourseCode from 'pages/CourseCode';
// ///// SESSION
import Sessions from 'modules/SessionModule/components/SessionComponent';
// ///// ASSIGNMENT
import Assignments from 'modules/AssignmentModule/components/AssignmentComponent';
// ///// ASSIGNMENT_MIX_4
import AssignmentsMix4 from 'modules/AssignmentModule/components/AssignmentMix4Component';
// ///// IELTSMODULE
import IELTSMindSet from 'modules/IeltsMindsetModule';
import IELTSMindSetQuestion from 'modules/IeltsMindsetModule/IELTSMindSetQuestion';
// ///// Questions_mix
import QuestionsMix from 'modules/QuestionModule/questionsMix';
// ///// Questions
import Questions from 'modules/QuestionModule';
// ///// Results
import Results from 'modules/ResultModule';
import Results_Mix from 'modules/ResultModule/ResultMix/index_mix';
// ///////AUTH
// import Teacher from 'modules/TeacherModule/components/TeacherComponent';
// ///////Star & Gift
import Gift from 'modules/GiftModule';
// ///////Account
import Profile from 'modules/profileModule/Profile';
// ///////Calendar
import Calendar from 'modules/StudentCalendarModule/Calendar';
// ///////Calendar
import Notifications from 'modules/NotificationsModule';
import BookReading from 'pages/BookReading';
import ViewResultModule from 'modules/ViewResultModule';
import ResultsTable from 'modules/ViewResultModule/components/ResultsTable';
import LiveWorksheetType from 'modules/QuestionModule/LiveWorksheetType';
import WorksheetResultAnswers from 'modules/ResultModule/LiveWorksheetResult';

const studentRoutes = [
  // ////////////////////////////////////////////
  // ///////////////// Homepage ///////////////////////////
  // //////////////////////////////////////////
  {
    path: '/homepage',
    name: 'Dashboard',
    icon: 'fas fa-home text-red',
    component: Dashboard,
    layout: '/ames',
  },
  // ////////////////////////////////////////////
  // ///////////////// CLASS ///////////////////////////
  // //////////////////////////////////////////
  {
    path: '/classes',
    name: 'Lớp học của bạn',
    icon: 'fas fa-book-reader text-default',
    component: Classes,
    layout: '/ames',
    collapse: false,
  },

  // ////////////////////////////////////////////
  // ///////////////// SESSIONS ///////////////////////////
  // //////////////////////////////////////////
  {
    path: '/class/:classId/sessions',
    name: 'Sessions',
    icon: 'ni ni-calendar-grid-58 text-red',
    component: Sessions,
    layout: '/ames',
  },

  // ////////////////////////////////////////////
  // ///////////////// ASSIGNMENTS ///////////////////////////
  // //////////////////////////////////////////
  {
    path: '/class/:classId/session/:sessionId/assignments',
    name: 'Assignments',
    icon: 'ni ni-calendar-grid-58 text-red',
    component: Assignments,
    layout: '/ames',
  },

  // ////////////////////////////////////////////
  // ///////////////// ASSIGNMENTS MIX 4 ///////////////////////////
  // //////////////////////////////////////////
  {
    path: '/class/:classId/session/:sessionId/assignmentsMix4',
    name: 'AssignmentsMix4',
    icon: 'ni ni-calendar-grid-58 text-red',
    component: AssignmentsMix4,
    layout: '/ames',
    showInSidebar: false,
    exact: true,
  },

  // ////////////////////////////////////////////
  // ///////////////// IELTSMindSet ///////////////////////////
  // //////////////////////////////////////////
  {
    path: '/class/:classId/session/:sessionId/assignment/:assignmentId/IELTSMindSet',
    name: 'IELTSMindSet',
    icon: 'ni ni-calendar-grid-58 text-red',
    component: IELTSMindSet,
    layout: '/ames',
    // IELTSMindSetQuestion
  },
  {
    path: '/class/:classId/session/:sessionId/assignment/:assignmentId/IELTSMindSetQuestion',
    name: 'IELTSMindSet',
    icon: 'ni ni-calendar-grid-58 text-red',
    component: IELTSMindSetQuestion,
    layout: '/ames',
    // IELTSMindSetQuestion
  },

  // ////////////////////////////////////////////
  // ///////////////// QUESTIONS MIX ///////////////////////////
  // //////////////////////////////////////////
  {
    path: '/class/:classId/session/:sessionId/questionsMix',
    name: 'MixQuestions',
    icon: 'ni ni-calendar-grid-58 text-red',
    component: QuestionsMix,
    layout: '/ames',
  },

  // ////////////////////////////////////////////
  // ///////////////// Questions ///////////////////////////
  // //////////////////////////////////////////

  {
    path: '/class/:classId/session/:sessionId/assignment/:assignmentId/questions',
    name: 'Questions',
    icon: 'ni ni-calendar-grid-58 text-red',
    component: Questions,
    layout: '/ames',
  },

  // ////////////////////////////////////////////
  // ///////////////// Results Questions ///////////////////////////
  // //////////////////////////////////////////
  {
    path: '/class/:classId/session/:sessionId/assignment/:assignmentId/results',
    name: 'Results',
    icon: 'ni ni-calendar-grid-58 text-red',
    component: Results,
    layout: '/ames',
  },

  // ////////////////////////////////////////////
  // ///////////////// Results Questions_Mix ///////////////////////////
  // //////////////////////////////////////////
  {
    path: '/class/:classId/session/:sessionId/results_mix',
    name: 'Results',
    icon: 'ni ni-calendar-grid-58 text-red',
    component: Results_Mix,
    layout: '/ames',
  },
  // ////////////////////////////////////////////
  // ///////////////// VOCABULARY ///////////////////////////
  // //////////////////////////////////////////
  // {
  // collapse: true,
  // name: 'Vocabulary practice',
  // icon: 'ni ni-single-copy-04 text-info',
  // state: 'componentsCollapse',
  // views: [
  {
    path: '/audioFiles',
    name: 'Thư viện file nghe',
    icon: 'fas fa-headphones-alt text-yellow',
    component: AudioFile,
    layout: '/ames',
  },
  {
    path: '/stressposition',
    name: 'Xác định trọng âm',
    icon: 'ni ni-hat-3 text-red',
    component: StressPosition,
    layout: '/ames',
  },

  {
    path: '/vocabulary',
    name: 'Luyện tập từ vựng',
    icon: 'ni ni-paper-diploma text-primary',
    component: Vocabulary,
    layout: '/ames',
  },

  {
    path: '/book-reading',
    name: 'Đọc sách Tiếng Anh',
    icon: 'ni ni-headphones text-green',
    component: BookReading,
    layout: '/ames',
  },

  // ]
  // },
  // }
  {
    path: '/choose',
    name: 'Choose',
    icon: 'ni ni-calendar-grid-58 text-red',
    component: ChooseVocabulary,
    layout: '/ames',
  },

  // ////////////////////////////////////////////
  // ///////////////// VOA ///////////////////////////
  // //////////////////////////////////////////
  {
    path: '/VOA',
    name: 'List',
    icon: 'fas fa-atlas text-warning',
    component: VOA,
    layout: '/ames',
  },

  {
    path: '/VOA-itemList',
    name: 'Luyện nghe VOA',
    icon: 'fas fa-headphones-alt text-red',
    component: VOAItemList,
    layout: '/ames',
  },

  // ////////////////////////////////////////////
  // ///////////////// Star and Gift ///////////////////////////
  // //////////////////////////////////////////
  {
    path: '/gifts',
    name: 'Star & Gifts',
    icon: 'fas fa-gift text-warning',
    component: Gift,
    layout: '/ames',
  },
  // ////////////////////////////////////////////
  // ///////////////// Profile ///////////////////////////
  // //////////////////////////////////////////
  {
    path: '/Profile',
    name: 'Profile',
    icon: 'ni ni-calendar-grid-58 text-red',
    component: Profile,
    layout: '/ames',
  },
  // ////////////////////////////////////////////
  // ///////////////// Notification ///////////////////////////
  // //////////////////////////////////////////
  {
    path: '/Notifications',
    name: 'Notifications',
    icon: 'ni ni-calendar-grid-58 text-red',
    component: Notifications,
    layout: '/ames',
  },

  // ////////////////////////////////////////////
  // ///////////////// CALENDAR ///////////////////////////
  // //////////////////////////////////////////
  {
    path: '/calendar',
    name: 'Quản lý lịch',
    icon: 'ni ni-calendar-grid-58 text-red',
    component: Calendar,
    layout: '/ames',
  },
  // ////////////////////////////////////////////
  // ///////////////// SHARE ///////////////////////////
  // //////////////////////////////////////////
  {
    path: '/share',
    name: 'Giới thiệu - Nhận quà',
    icon: 'fas fa-user-friends text-default',
    component: Share,
    layout: '/ames',
  },
  // ////////////////////////////////////////////
  // ///////////////// Course Code ///////////////////////////
  // //////////////////////////////////////////
  {
    path: '/courseCode',
    name: 'Thêm khoá học',
    icon: 'fas fa-barcode text-default',
    component: CourseCode,
    layout: '/ames',
  },
  {
    path: '/view-results/:classId/:classIndex',
    name: 'Kết quả bài làm',
    icon: 'fas fa-barcode text-default',
    component: ResultsTable,
    layout: '/ames',
    showInSidebar: false,
  },
  {
    path: '/view-results',
    name: 'Kết quả bài làm',
    icon: 'fas fa-barcode text-default',
    component: ViewResultModule,
    layout: '/ames',
    showInSidebar: false,
  },

  // Live Worksheet

  {
    path: '/class/:classId/session/:sessionId/assignment/:assignmentId/attachment/:attachmentId/questions',
    name: 'Questions',
    icon: 'ni ni-calendar-grid-58 text-red',
    component: LiveWorksheetType,
    layout: '/ames',
    showInSidebar: false,
  },

  {
    path: '/class/:classId/session/:sessionId/assignment/:assignmentId/attachment/:attachmentId/results',
    name: 'Live worksheet result',
    icon: 'ni ni-calendar-grid-58 text-red',
    component: WorksheetResultAnswers,
    layout: '/ames',
    showInSidebar: false,
  },
  // Live Worksheet Mix4
  {
    path: '/class/:classId/session/:sessionId/assignmentsMix4/:assignmentsMix4Id/attachment/:attachmentId/questions',
    name: 'LiveWorksheetMix',
    icon: 'ni ni-calendar-grid-58 text-red',
    component: LiveWorksheetType,
    layout: '/ames',
    showInSidebar: false,
  },
  {
    path: '/class/:classId/session/:sessionId/assignmentsMix4Id/:assignmentsMix4Id/attachment/:attachmentId/results',
    name: 'Live worksheet result',
    icon: 'ni ni-calendar-grid-58 text-red',
    component: WorksheetResultAnswers,
    layout: '/ames',
    showInSidebar: false,
  },
];

export default studentRoutes.map((x) => ({ ...x, role: 'student' }));
