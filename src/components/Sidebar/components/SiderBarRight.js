import { Layout, Menu, Row, Col } from 'antd';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'reactstrap'
import * as ActionTypes from 'components/Sidebar/actions/types'
import { FETCH_SESSION } from '../../../modules/SessionModule/actions/types';
import { FETCH_ASSIGNMENT_REQUEST } from '../../../modules/AssignmentModule/actions/types';
import { SAVE_SELECTED_CLASS } from '../../../modules/ClassModule/actions/types';
import { SAVE_SELECTED_SESSION } from '../../../modules/SessionModule/actions/types';
import PropTypes from 'prop-types';
const { Sider } = Layout;

let title = 'CLASS LIST';
let selectedKeys = '2';

const SiderRightBar = (props) => {

  const dispatch = useDispatch();

  const toggleMenuBar = () => {
    dispatch({ type: ActionTypes.TOGGLE_MENU_BAR })
  }

  const loggedInUser = useSelector((rootState) => rootState.loginReducer.loggedInUser);

  const classList = useSelector((rootState) => rootState.classReducer.data);

  const sessionsList = useSelector((rootState) => rootState.sessionReducer.data);


  const selectedSession = useSelector((rootState) => rootState.sessionReducer.selectedSession);

  // const assignmentsList = useSelector((rootState) => rootState.assignmentReducer.data);

  const selectedClass = useSelector((rootState) => rootState.classReducer.selectedClass)

  const pathname = props.location.pathname;

  

  const getClassIndex = React.useCallback(() => {
    const classIndex = selectedClass.courseType === 'AMES' ?
      classList.findIndex(x => x.classId === selectedClass.classId)
      : classList.findIndex(x => x.amesCourseId === selectedClass.amesCourseId)
    return classIndex
  }, [selectedClass, classList])

  const getSessionIndex = React.useCallback(() => {
    const sessionIndex = selectedSession.sessionId ? sessionsList.findIndex(x => x.sessionId === selectedSession.sessionId) : sessionsList.findIndex(x => x.id === selectedSession.id)
    return sessionIndex
  }, [selectedSession, sessionsList])

  const onClickClass = React.useCallback((item) => () => {

    let classId = item.courseType === 'AMES' ? item.classId : item.amesCourseId;
    classId = classId.toString();

    const link = `/ames/class/${classId}/sessions`;

    props.history.push(link)

    const typeClass = item.courseType;
    const note = item.note;
    const studentId =
      typeClass === 'AMES'
        ? loggedInUser.userMyames.StudentId
        : loggedInUser.userMyai.StudentId;
    const classItem = item;

    const payload = {
      classId,
      studentId,
      typeClass,
      note,
      classItem
    };
    dispatch({
      type: SAVE_SELECTED_CLASS,
      selectedClass: item,
    });
    dispatch({ type: FETCH_SESSION, payload })

  }, [dispatch, loggedInUser,  props.history]);

  const renderClassList = React.useCallback(() => {
    return classList.map((item, index) => {
      const isSelected = selectedKeys === index
      return (
        <Menu.Item className={isSelected ? 'ant-menu-item ant-menu-item-selected' : ''} onClick={onClickClass(item)} key={index} icon={<i className="fas fa-book-reader mr-3"></i>}>
          {item.className || item.courseName}
        </Menu.Item>
      )
    })
  }, [classList, onClickClass])

  const onClickSession = React.useCallback((item) => () => {

    let classId = selectedClass.courseType === 'AMES' ? selectedClass.classId : selectedClass.amesCourseId;
    classId = classId.toString();
    const sessionId = item.id || item.sessionId || item.level;
    const link = `/ames/class/${classId}/session/${sessionId}/assignments`;

    props.history.push(link)

    const AppName = loggedInUser?.userMyai?.AppName;
    const typeApp = selectedClass.courseType;
    const studentId =
      typeApp === 'AMES'
        ? loggedInUser.userMyames.StudentId
        : loggedInUser.userMyai.StudentId;
    const payload = {
      classId,
      studentId,
      sessionId,
      typeApp,
      AppName
    };
    dispatch({
      type: SAVE_SELECTED_SESSION,
      selectedSession: item,
    });
    dispatch({ type: FETCH_ASSIGNMENT_REQUEST, payload })
  }, [dispatch, loggedInUser, props.history, selectedClass]);

  const renderSessionsList = React.useCallback(() => {

    return sessionsList.map((item, index) => {
      const isSelected = selectedKeys === index
      return (
        <Menu.Item className={isSelected ? 'ant-menu-item ant-menu-item-selected' : ''} onClick={onClickSession(item)} key={index} icon={<i className="fas fa-book-reader mr-3"></i>}>
          {item.sessionName || item.title}
        </Menu.Item>
      )
    })
  }, [onClickSession, sessionsList])

  const renderSideBar = React.useCallback(() => {

    if (pathname.includes('sessions') || pathname.includes('questionsMix')) {
      title = 'CLASS LIST';
      selectedKeys = getClassIndex()
      return renderClassList()
    }

    if (pathname.includes('assignments') || pathname.includes('questions')) {
      title = 'SESSION LIST'
      selectedKeys = getSessionIndex()
      return renderSessionsList()
    }

    // if (pathname.includes('questions')) {
    //   title = 'Danh sách bài học'
    //   return renderAssignmentsList()
    // }

  }, [getClassIndex, getSessionIndex, pathname, renderClassList, renderSessionsList])

  return (
    <Sider
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        right: 0,
        top: 0,

      }}
      width='300'
      trigger={null}
      className='bg-gradient-default text-white'
    >
      <Row justify="center">
        <Col  >
          <div>
            <h2 className="display-6 text-white mt-2" >{title}</h2>
          </div>
        </Col>
      </Row>
      <Menu
        className='bg-gradient-default text-white'
        mode="inline"
      >
        {renderSideBar()}
      </Menu>
      <Col style={{ width: '90%' }} className='mt-4 ml-3'>
        <Button onClick={toggleMenuBar} block color="secondary" size="lg" type="button">
          Đóng
        </Button>
      </Col>
    </Sider>
  );

}

SiderRightBar.propTypes = {
  history: PropTypes.instanceOf(Object),
  location: PropTypes.instanceOf(Object),
}
export default SiderRightBar;