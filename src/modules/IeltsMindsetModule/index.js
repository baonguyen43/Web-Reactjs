/**
 * Classes
 *  |
 *  |_Book
 *     |
 *     |_Lesson
 *       |
 *       |_Assignment
 * 
 * Mô tả: Hiển thị danh sách assignment.
 */
import React from 'react'
import { Container, Row, Col, Breadcrumb, BreadcrumbItem, Button, ListGroupItem, ListGroup } from 'reactstrap';
import * as Colors from 'configs/color';
import { Link } from 'react-router-dom'
import { BackTop } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import queryString from 'query-string';
import { useLocation, useHistory, useParams } from 'react-router';
import { FETCH_QUESTIONS_REQUEST } from 'modules/QuestionModule/actions/types'
import { FETCH_SCORE } from 'modules/IeltsMindsetModule/actions/types'
import Loading from 'components/Loading';
import NotData from 'components/Error/NotData';

function compare(a, b) {
  if (a.exercise - b.exercise > 0) return 1
  if (a.exercise - b.exercise < 0) return -1
  if (a.exercise - b.exercise === 0) {
    if (typeof a.exercise === 'string') {
      return a.subExercise < b.subExercise ? -1 : 1;
      // return a.subExercise?.charCodeAt(0) - b.subExercise?.charCodeAt(0)
    }
    return a.subExercise - b.subExercise
  }
}

const IeltsMindSet = () => {
  const dispatch = useDispatch();

  const location = useLocation();

  const history = useHistory();

  const params = useParams();

  const { classId, sessionId, assignmentId } = params;

  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

  const selectedClass = useSelector((rootState) => rootState.classReducer.selectedClass)

  const selectedSession = useSelector((rootState) => rootState.sessionReducer.selectedSession)

  const allQuestions = useSelector((rootState) => rootState.questionReducer.data?.questions)

  const loading = useSelector((rootState) => rootState.questionReducer.loading)

  const typeApp = selectedClass.courseType;

  const fetchIeltsMindsetScore = () => {
    const { takeExamTime } = queryString.parse(location.search)
    const studentId = loggedInUser.userMyames.StudentId
    const payload = {
      studentId, sessionId, assignmentId, takeExamTime,
    }
    dispatch({ type: FETCH_SCORE, payload })
  }

  React.useEffect(() => {
    const fetchQuestions = () => {
      const { takeExamTime, asrId } = queryString.parse(location.search)
      const userId = typeApp === 'AMES' ? loggedInUser.userMyames.StudentId : loggedInUser.userMyai.StudentId;
      const payload = {
        sessionId, assignmentId, takeExamTime, userId, asrId,
      };
      dispatch({ type: FETCH_QUESTIONS_REQUEST, payload })
    }

    fetchQuestions()
    fetchIeltsMindsetScore()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const moveToQuestion = React.useCallback((item) => () => {

    const { asrId, takeExamTime } = queryString.parse(location.search)

    const linkStart = `/ames/class/${classId}/session/${sessionId}/assignment/${assignmentId}/IELTSMindSetQuestion`;
    const type = `${item.questionType}`
    history.push({
      pathname: linkStart,
      search: `?type=${type}&asrId=${asrId}&takeExamTime=${takeExamTime}&questionId=${item.id}`,
    });
  }, [location.search, classId, sessionId, assignmentId, history])

  const renderItem = React.useCallback(() => {
    if (!allQuestions) return <NotData />;
    return allQuestions.sort((a, b) => compare(a, b)).map((item, index) => {
      return (
        <ListGroupItem key={index} style={{ cursor: 'pointer' }} className="px-0" onClick={moveToQuestion(item)}>
          <Row className="align-items-center ml-2 mr-2">
            <Col className="col-auto">
              <a
                className="avatar rounded-circle"
                href="#pablo"
                onClick={e => e.preventDefault()}
              >
                <img
                  alt="..."
                  src='https://img.freepik.com/free-vector/learn-english-design-vector-illustration-eps10-graphic_24908-10596.jpg?size=626&ext=jpg&ga=GA1.2.466521553.1607654878'
                />
              </a>
            </Col>
            <div className="col ml--2">
              <h4 className="mb-0">
                <a href="#pablo" onClick={e => e.preventDefault()}>
                  {item.exercise} - {item.title}
                </a>
              </h4>
              {/* <span className="text-success">●</span> */}
              {
                item.subExercise &&
                <small>{item.subExercise}{'. '}{item.subtitle}</small>
              }
            </div>
            <Col className="col-auto">
              <Button color="default" size="sm" type="button">
                Làm bài
              </Button>
            </Col>
          </Row>
        </ListGroupItem>

      );
    });
  }, [allQuestions, moveToQuestion])

  const linkGoBackSession = `/ames/class/${classId}/sessions/`
  // const linkGoBackAssignment = `/ames/class/${classId}/session/${sessionId}/assignments/`;

  const color = `header bg-${Colors.PRIMARY} pb-6`
  return loading ? (<Loading />) : (
    <>
      <div className={color}>
        <Container fluid>
          <div className="header-body">
            <Row className="align-items-center py-4">
              <Col xs={24} sm={12} md={12} lg={8} xl={12} xxl={4}>
                <Link to="/ames">
                  <h6 className="h2 text-white d-inline-block mb-0">
                    HOME PAGE
                  </h6>
                </Link>
                <Breadcrumb
                  className="d-none d-md-inline-block ml-md-4"
                  listClassName="breadcrumb-links breadcrumb-dark"
                >
                  <BreadcrumbItem>
                    <Link to="/ames/classes" style={{ fontSize: 15 }}>{typeApp ? selectedClass.className : selectedClass.courseName}</Link>
                  </BreadcrumbItem>
                  <BreadcrumbItem aria-current="page" className="active">
                    <Link to={linkGoBackSession} style={{ fontSize: 15 }}>Sessions</Link>
                  </BreadcrumbItem>
                  <BreadcrumbItem aria-current="page" className="active">
                    <span style={{ fontSize: 15 }}>Unit {selectedSession.title.split('-')[0].trim()}: {selectedSession.title.split('-')[1]} | {selectedSession.title.split('-')[2]} | Assignments</span>
                  </BreadcrumbItem>

                  {/* <BreadcrumbItem>
                    <a href="#pablo" onClick={(e) => e.preventDefault()} style={{ fontSize: 17 }}>
                      <i className="fas fa-book-open" />
                    </a>
                  </BreadcrumbItem> */}
                  {/* <BreadcrumbItem aria-current="page" className="active">
                    <Link to={linkGoBackSession} style={{ fontSize: 15 }}>{selectedSession.title}</Link>
                  </BreadcrumbItem> */}
                  {/* <BreadcrumbItem aria-current="page" className="active">
                    <Link to={linkGoBackAssignment} style={{ fontSize: 15 }}>Assignments</Link>
                  </BreadcrumbItem> */}
                  {/* <BreadcrumbItem aria-current="page" className="active">
                    <span>IELTSMindSet</span>
                  </BreadcrumbItem> */}
                </Breadcrumb>
              </Col>
            </Row>
          </div>
        </Container>
      </div>
      <Container className="mt--5" fluid>
        <Row>
          <Col>
            <ListGroup className="list my--3" flush>
              {renderItem()}
            </ListGroup>
          </Col>
        </Row>
      </Container>

      <BackTop />
    </>
  )
}

export default IeltsMindSet;