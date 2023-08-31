import React from 'react'
import { Card, ListGroup, Row, ListGroupItem } from 'reactstrap'
import queryString from 'query-string';
import { useLocation, useHistory, useParams } from 'react-router';
import { useSelector } from 'react-redux';
import NotData from 'components/Error/NotData';
import './index.css'

function compare(a, b) {
    if (a.exercise - b.exercise > 0) return 1
    if (a.exercise - b.exercise < 0) return -1
    if (a.exercise - b.exercise === 0) {
        if (typeof a.exercise === 'string') {
            return a.subExercise?.charCodeAt(0) - b.subExercise?.charCodeAt(0)
        }
        return a.subExercise - b.subExercise
    }
}

const AssignmentSidebar = () => {
    const location = useLocation();
    const history = useHistory();
    const params = useParams();
    const { classId, sessionId, assignmentId } = params;
    const { asrId, takeExamTime, questionId } = queryString.parse(location.search)
    const selectedSession = useSelector((rootState) => rootState.sessionReducer.selectedSession)
    const allQuestions = useSelector((rootState) => rootState.questionReducer.data.questions)

    const moveToQuestion = React.useCallback((item) => () => {
        // const { asrId, takeExamTime } = queryString.parse(location.search)
        const linkStart = `/ames/class/${classId}/session/${sessionId}/assignment/${assignmentId}/IELTSMindSetQuestion`;
        const type = `${item.questionType}`
        history.push({
            pathname: linkStart,
            search: `?type=${type}&asrId=${asrId}&takeExamTime=${takeExamTime}&questionId=${item.id}`,
        });
    }, [classId, sessionId, assignmentId, history, asrId, takeExamTime])

    const renderItem = React.useCallback(() => {
        if (!allQuestions) return <NotData />;
        return allQuestions.sort((a, b) => compare(a, b)).map((item, index) => {
            return (
                <ListGroupItem key={index} style={{ cursor: 'pointer' }} className={`px-0 ${item.id === parseInt(questionId) ? 'currentlySelectedAssignment': ''}`} onClick={moveToQuestion(item)}>
                    <Row className="align-items-center ml-2 mr-2">
                        <div className="col ml--2">
                            <h4 className="mb-0">
                                <a href="#pablo" onClick={e => e.preventDefault()}>
                                    Exercise {item.exercise}
                                </a>
                            </h4>
                            {
                                item.subExercise &&
                                <small>{item.subExercise}</small>
                            }
                        </div>
                    </Row>
                </ListGroupItem>
            );
        });
    }, [allQuestions, moveToQuestion, questionId])

    return (
        <React.Fragment>
            <Card style={{ fontWeight: 750 }}>
                <ListGroup className="list" flush>
                    {selectedSession.title.split('-').map((item, index) => {
                        return (
                            index !== 0 && <span key={index}>{item}</span>
                        )
                    })}
                    {renderItem()}
                </ListGroup>
            </Card>
        </React.Fragment>
    )
}

export default AssignmentSidebar
