import React from 'react';
import {
  Button,
  Modal,
  Card,
  CardImg,
  CardBody,
  CardText,
  Progress,
  Col,
  Row
} from 'reactstrap';
import { Rate } from 'antd';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { dynamicApiAxios } from 'configs/api';
import * as ActionTypes from 'modules/SessionModule/actions/types';

const AssignmentsToeicModal = ({
  isVisibled,
  toggleModal,
  sessionItem,
  studentId,
  sessionId,
  classId, history, takeExamTime, questionItem
}) => {
  const dispatch = useDispatch();
  const [state, setState] = React.useState({
    data: [],
  })
  // Chuyển đến QuestionModule - PartQuestions
  const moveToNextPage = React.useCallback(
    (item, index) => {

      dispatch({
        type: ActionTypes.SAVE_SELECTED_PART,
        selectedPart: { ...item, index },
        groupPart: state.data,
      });

      const linkStart = `/ames/class/${classId}/session/${sessionId}/assignment/${item.assignmentId}/questions`;
      const linkQuestion = {
        pathname: linkStart,
        search: `?type=${questionItem.questionType}&asrId=${questionItem.asrId}&takeExamTime=${takeExamTime}`,
      }

      history.push(linkQuestion);
    },
    [classId, dispatch, history, questionItem.asrId, questionItem.questionType, sessionId, state.data, takeExamTime]
  );

  React.useEffect(() => {
    const getTOEICListening = async () => {
      const response = await dynamicApiAxios.query.post('', {
        sqlCommand: '[dbo].[p_AMES247_ReadingListeningQuestions_GetPart_V2]',
        parameters: {
          StudentId: studentId,
          SessionId: sessionId,
        },
      });
      if (response.data.ok) {

        setState((previousState) => ({ ...previousState, data: response.data.items }))
      }
    }
    getTOEICListening();
  }, [studentId, sessionId])

  const Content = React.useCallback(() => {
    // if(!groupPart._dispatchInstances) return null;
    return state.data.map((item, index) => {
      return (
        //  className="card-lift--hover"
        <Col key={index} xs={12} sm={6} md={6} lg={4} xl={4} xxl={2} >
          <Card >
            <CardImg
              alt="..."
              src="https://image.freepik.com/free-photo/learn-english-sticky-notes-pink-background_23-2148293417.jpg"
              top
            />
            <CardBody>
              <CardText>
                <span
                  className="text-warning"
                  style={{ fontSize: 18, fontWeight: '500' }}
                >
                  {item.title}
                </span>
              </CardText>

              <span>
                <small className="text-muted">Đánh giá </small>
                <Rate
                  style={{ marginLeft: 15 }}
                  disabled
                  allowHalf
                  value={item.star / 20}
                />
              </span>
              <span>
                <div className="progress-wrapper">
                  <div className="progress-warning">
                    <div className="progress-label">
                      <span style={{ color: '#fb6340' }}>Hoàn thành</span>
                    </div>
                    <div className="progress-percentage">
                      <span>{item.completedPercent}%</span>
                    </div>
                  </div>
                  <Progress
                    max="100"
                    value={item.completedPercent}
                    color="warning"
                  />
                </div>
              </span>
              <div className="text-right">
                <Button
                  outline
                  color="warning"
                  onClick={() => moveToNextPage(item, index)}
                >
                  Làm bài
              </Button>
              </div>
            </CardBody>
          </Card>
        </Col>
      );
    });
  }, [moveToNextPage, state.data]);
  return (
    <>
      <Modal
        className="modal-dialog-centered modal-danger modal-xl"
        isOpen={isVisibled}
        toggle={() => toggleModal()}
      >
        <div className="modal-header">
          <h5 className="modal-title" id="exampleModalLabel">
            Chọn phần học bài Listen and Reading
          </h5>
          <button
            aria-label="Close"
            className="close"
            data-dismiss="modal"
            type="button"
            onClick={() => toggleModal()}
          >
            <span aria-hidden={true}>×</span>
          </button>
        </div>
        <Row className="modal-body">
          <div className="card-deck ">{Content()}</div>
        </Row>
        <div className="modal-footer">
          <Button
            color="secondary"
            data-dismiss="modal"
            type="button"
            onClick={() => toggleModal()}
          >
            Close
          </Button>
        </div>
      </Modal>
    </>
  );
};

AssignmentsToeicModal.propTypes = {
  groupPart: PropTypes.instanceOf(Array),
  sessionItem: PropTypes.instanceOf(Object),
  history: PropTypes.instanceOf(Object),
  questionItem: PropTypes.instanceOf(Object),
  studentId: PropTypes.number,
  sessionId: PropTypes.string,
  takeExamTime: PropTypes.string,
  classId: PropTypes.string,
  isVisibled: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired,
}

export default AssignmentsToeicModal;
