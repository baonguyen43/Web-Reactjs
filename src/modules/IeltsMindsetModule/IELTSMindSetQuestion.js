/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-undef */
/* eslint-disable eqeqeq */
import React from 'react';
import { Card, Container, Row, Col, Breadcrumb, BreadcrumbItem } from 'reactstrap';
import * as Colors from 'configs/color';
import { Link } from 'react-router-dom';
import { BackTop } from 'antd';
import { useSelector } from 'react-redux';
import queryString from 'query-string';
import { useLocation, useParams } from 'react-router';
import Loading from 'components/Loading';
import QuestionType from './ExcerciseTypes';
import NotData from 'components/Error/NotData';
import CardHeader from 'reactstrap/lib/CardHeader';
import TitleQuestion from 'components/TitleQuestion';
import ReactHtmlParser from 'react-html-parser';
import AssignmentSidebar from './components/AssignmentSidebar';
import './styles.ieltsmindsetmodule.css';
// import Sidebar from './components/Sidebar';
import CardBody from 'reactstrap/lib/CardBody';
import { QUESTION_BACKGROUND_COLOR } from './constants/AdjustSpecifications';
import SideNav from './components/SideNav';
import AudioList from './components/AudioList';

const IeltsMindSet = () => {
  const location = useLocation();
  const params = useParams();
  const { classId, sessionId } = params;
  // const { classId, sessionId, assignmentId } = params;
  // const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
  const selectedClass = useSelector((rootState) => rootState.classReducer.selectedClass);
  const selectedSession = useSelector((rootState) => rootState.sessionReducer.selectedSession);

  const allQuestions = useSelector((rootState) => rootState.questionReducer.data.questions);

  const loading = useSelector((rootState) => rootState.questionReducer.loading);
  const typeApp = selectedClass.courseType;

  const { questionId, type } = queryString.parse(location.search);
  const question = allQuestions.find((x) => x.id == questionId);

  const linkGoBackSession = `/ames/class/${classId}/sessions/`;
  const linkGoBackAssignment = `/ames/class/${classId}/session/${sessionId}/assignments/`;
  // const linkGoBackIELTSMindSet = `/ames/class/${classId}/session/${sessionId}/assignments/${assignmentId}/IELTSMindSet`
  const imgArray = question?.questionImage ? JSON.parse(question?.questionImage) : '';

  const transform = React.useCallback(
    (node, i) => {
      let count = 0;
      if (node.type === 'text') {
        if (!node.data.includes('#')) return;
        const elementArray = node.data.split('#');
        return (
          <span key={i}>
            {elementArray.map((item, index) => {
              if (index < elementArray.length - 1) {
                count++;
              }
              return (
                <React.Fragment key={index}>
                  {item}
                  {imgArray && index < elementArray.length - 1 && (
                    <img
                      src={imgArray[count - 1]}
                      style={{
                        height: 'fit-content',
                        // width: 'fit-content',
                        maxWidth: 'fit-content',
                      }}
                      alt="img"
                    />
                  )}
                </React.Fragment>
              );
            })}
          </span>
        );
      }
    },
    [imgArray]
  );

  const renderQuestion = React.useCallback(() => {
    // const Component = QuestionType[type]
    // if (!Component) return <NotData />;

    return (
      <React.Fragment>
        {/* <CardHeader style={{ padding: 0 }}>
          <TitleQuestion
            no={question?.exercise}
            type={`${question?.unit}: Lesson ${question?.lesson}`}
            title={question?.title}
            subtitle={question?.subtitle}
            subExercise={question?.subExercise}
          />
        </CardHeader> */}
        <CardBody style={{ padding: 0 }}>
          {question?.questionText &&
            // <div dangerouslySetInnerHTML={{ __html: question.questionText }} />
            // ReactHtmlParser(question.questionText)
            ReactHtmlParser(question.questionText, { transform })}
        </CardBody>
        {/* <Component question={question} audio={question?.audio} /> */}
      </React.Fragment>
    );
  }, [allQuestions, location.search]);

  const Component = QuestionType[type];
  if (!Component) return <NotData />;

  const color = `header bg-${Colors.PRIMARY} pb-6`;

  return loading ? (
    <Loading />
  ) : (
    <>
      {/* Index section */}
      <div className={color}>
        <Container fluid>
          <div className="header-body">
            <Row className="align-items-center">
              <Col xl={11}>
                <Link to="/ames">
                  <h6 className="h2 text-white d-inline-block mb-0">HOME PAGE</h6>
                </Link>
                <Breadcrumb
                  className="d-none d-md-inline-block ml-md-4"
                  listClassName="breadcrumb-links breadcrumb-dark"
                >
                  <BreadcrumbItem>
                    <Link to="/ames/classes" style={{ fontSize: 15 }}>
                      {typeApp ? selectedClass.className : selectedClass.courseName}
                    </Link>
                  </BreadcrumbItem>
                  <BreadcrumbItem aria-current="page" className="active">
                    <Link to={linkGoBackSession} style={{ fontSize: 15 }}>
                      Sessions
                    </Link>
                  </BreadcrumbItem>
                  <BreadcrumbItem aria-current="page" className="active">
                    <Link to={linkGoBackAssignment} style={{ fontSize: 15 }}>
                      Unit {selectedSession.title.split('-')[0].trim()}: {selectedSession.title.split('-')[1]} |{' '}
                      {selectedSession.title.split('-')[2]} | Assignments
                    </Link>
                  </BreadcrumbItem>
                  <BreadcrumbItem>
                    <span style={{ fontSize: 15, color: 'white' }}>Exercise {question?.exercise}</span>
                  </BreadcrumbItem>

                  {/* <BreadcrumbItem>
                    <a href="#pablo" onClick={(e) => e.preventDefault()} style={{ fontSize: 17 }}>
                      <i className="fas fa-book-open" />
                    </a>
                  </BreadcrumbItem>
                  <BreadcrumbItem>
                    <Link to="/ames/classes" style={{ fontSize: 15 }}>{typeApp ? selectedClass.className : selectedClass.courseName}</Link>
                  </BreadcrumbItem>
                  <BreadcrumbItem aria-current="page" className="active">
                    <Link to={linkGoBackSession} style={{ fontSize: 15 }}>{selectedSession.title}</Link>
                  </BreadcrumbItem>
                  <BreadcrumbItem aria-current="page" className="active">
                    <Link to={linkGoBackAssignment} style={{ fontSize: 15 }}>Assignments</Link>
                  </BreadcrumbItem>
                  <BreadcrumbItem aria-current="page" className="active">
                    <Link to={linkGoBackIELTSMindSet} style={{ fontSize: 15 }}>IELTSMindSet</Link>
                  </BreadcrumbItem>
                  <BreadcrumbItem aria-current="page" className="active">
                    <span>IELTSMindSetQuestions</span>
                  </BreadcrumbItem> */}
                </Breadcrumb>
              </Col>
              <Col xl={1}>
                <SideNav title="Assignments" content={<AssignmentSidebar />} width={300} opendDefault={true} />
              </Col>
            </Row>
          </div>
        </Container>
      </div>
      {/* Exercise section */}
      <Container className="mt--5" fluid style={{ height: 'calc(100vh - 131px)' }}>
        <Card style={{ flex: 1, height: 'inherit', margin: 0 }}>
          <CardHeader style={{ padding: 0, paddingLeft: 15, paddingRight: 15 }}>
            <TitleQuestion
              no={question?.exercise}
              type={`${question?.unit}: Lesson ${question?.lesson}`}
              title={question?.title}
              subtitle={question?.subtitle}
              subExercise={question?.subExercise}
            />
            <AudioList audioUrl={question?.audio} />
          </CardHeader>
          <Row style={{ height: 'inherit', margin: 0, padding: 15, overflow: 'hidden' }}>
            {question?.questionText ? (
              <React.Fragment>
                <Col
                  style={{
                    padding: '0 15px 0 0',
                    overflowY: 'auto',
                    height: '100%',
                    textAlign: 'justify',
                    backgroundColor: QUESTION_BACKGROUND_COLOR,
                  }}
                >
                  {renderQuestion()}
                </Col>
                <Col
                  className="d-flex flex-column"
                  style={{ padding: '0 0 0 15px', height: '100%', overflowY: 'auto' }}
                >
                  <Component question={question} audio={question?.audio} tapescript={question?.listenTranscript} />
                </Col>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Col className="d-flex flex-column" style={{ padding: 0, height: '100%' }}>
                  {/* <CardHeader style={{ padding: 0 }}>
                      <TitleQuestion
                        no={question?.exercise}
                        type={`${question?.unit}: Lesson ${question?.lesson}`}
                        title={question?.title}
                        subtitle={question?.subtitle}
                        subExercise={question?.subExercise}
                      />
                    </CardHeader> */}
                  <Component question={question} audio={question?.audio} tapescript={question?.listenTranscript} />
                </Col>
              </React.Fragment>
            )}
            {/* <Sidebar style={{ flex: 1, textAlign: 'center' }} content={<AssignmentSidebar />} /> */}
          </Row>
        </Card>
      </Container>
      <BackTop />
    </>
  );
};

export default IeltsMindSet;
