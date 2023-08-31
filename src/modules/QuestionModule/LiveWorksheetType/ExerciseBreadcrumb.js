import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Container, Breadcrumb, BreadcrumbItem, Row, Col } from 'reactstrap';
import * as Colors from 'configs/color';
import { useSelector } from 'react-redux';
const ExerciseBreadcrumb = (props) => {
  let { classId, sessionId } = useParams();
  const { assignmentsMix4Id, assignmentId } = props;
  const selectedClass = useSelector((state) => state.classReducer.selectedClass);
  const selectedSession = useSelector((state) => state.sessionReducer.selectedSession);

  const isAmes = selectedClass?.courseType === 'AMES';
  const linkGoBackSession = `/ames/class/${classId}/sessions/`;
  const linkGoBackAssignment = `/ames/class/${classId}/session/${sessionId}/${
    assignmentId ? 'assignmentId' : 'assignmentsMix4'
  }/`;
  const colorClassName = `header bg-${Colors.PRIMARY} pb-2`;

  return (
    <div>
      <Container className={colorClassName} fluid>
        <div className="header-body">
          <Row className="align-items-center py-4">
            <Col>
              <Link to="/ames">
                <h6 className="h2 text-white d-inline-block mb-0">HOME PAGE</h6>
              </Link>
              <Breadcrumb className="d-none d-md-inline-block ml-md-4" listClassName="breadcrumb-links breadcrumb-dark">
                <BreadcrumbItem>
                  <a href="#pablo" onClick={(e) => e.preventDefault()} style={{ fontSize: 16 }}>
                    <i className="fas fa-book-open" />
                  </a>
                </BreadcrumbItem>
                {isAmes && (
                  <>
                    <BreadcrumbItem>
                      <Link to="/ames/classes" style={{ fontSize: 17 }}>
                        {selectedClass.className}
                      </Link>
                    </BreadcrumbItem>
                    <BreadcrumbItem>
                      <Link to={linkGoBackSession} style={{ fontSize: 16 }}>
                        {selectedSession.title}
                      </Link>
                    </BreadcrumbItem>
                  </>
                )}
                {!isAmes && (
                  <>
                    <BreadcrumbItem>
                      <Link to="/ames/classes" style={{ fontSize: 17 }}>
                        {selectedClass.courseName}
                      </Link>
                    </BreadcrumbItem>
                    <BreadcrumbItem>
                      <Link to={linkGoBackSession} style={{ fontSize: 16 }}>
                        {selectedSession.title}
                      </Link>
                    </BreadcrumbItem>
                  </>
                )}

                <BreadcrumbItem>
                  <Link to={linkGoBackAssignment} style={{ fontSize: 16 }}>
                    Assignments
                  </Link>
                </BreadcrumbItem>
                <BreadcrumbItem style={{ fontSize: 16 }} aria-current="page" className="active">
                  Questions
                </BreadcrumbItem>
              </Breadcrumb>
            </Col>
          </Row>
        </div>
      </Container>
    </div>
  );
};

ExerciseBreadcrumb.propTypes = {};

export default ExerciseBreadcrumb;
