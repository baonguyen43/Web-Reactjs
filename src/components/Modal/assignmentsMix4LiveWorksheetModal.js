import { Rate } from 'antd';
import { dynamicApiAxios } from 'configs/api';
import * as ActionTypes from 'modules/SessionModule/actions/types';
import PropTypes from 'prop-types';
import React from 'react';
import { useDispatch } from 'react-redux';
import { Button, Card, CardBody, CardImg, CardText, Col, Modal, Progress, Row } from 'reactstrap';

const AssignmentsMix4LiveWorksheetModal = ({
  isVisibled,
  toggleModal,
  sessionItem,
  studentId,
  sessionId,
  classId,
  history,
  takeExamTime,
  questionItem,
}) => {
  const dispatch = useDispatch();
  const [state, setState] = React.useState({
    data: [],
    isLoading: false,
  });
  // Chuyển đến QuestionModule - PartQuestions
  const moveToNextPage = React.useCallback(
    (item, index) => {
      const { asrId, assignmentId: assignmentsMix4Id, questionType } = questionItem;
      dispatch({
        type: ActionTypes.SAVE_SELECTED_PART,
        selectedPart: { ...item, index },
        groupPart: state.data,
      });
      const linkStart = `/ames/class/${classId}/session/${sessionId}/assignmentsMix4/${assignmentsMix4Id}/attachment/${item.id}/questions`;
      const linkQuestion = {
        pathname: linkStart,
        search: `?type=${questionType}&asrId=${asrId}&takeExamTime=${takeExamTime}`,
      };

      history.push(linkQuestion);
    },
    [classId, dispatch, history, questionItem, sessionId, state.data, takeExamTime]
  );

  React.useEffect(() => {
    if (isVisibled) {
      const getLiveWorkSheet = async () => {
        const response = await dynamicApiAxios.query.post('', {
          sqlCommand: 'dbo.p_MYAMES_SHARE_Attachments',
          parameters: {
            SessionId: sessionId,
          },
        });
        if (response.data.ok) {
          setState((previousState) => ({ ...previousState, data: response.data.items, isLoading: true }));
        }
      };
      getLiveWorkSheet();
    }
  }, [isVisibled, questionItem.id, sessionId, studentId]);

  const Content = React.useCallback(() => {
    return state.data.map((item, index) => {
      return (
        <Col key={index} xs={12} sm={12} md={6} lg={4} xl={4} xxl={2}>
          <Card>
            <CardImg
              alt="..."
              src="https://image.freepik.com/free-photo/learn-english-sticky-notes-pink-background_23-2148293417.jpg"
              top
            />
            <CardBody>
              <CardText>
                <span className="text-warning" style={{ fontSize: 18, fontWeight: '500' }}>
                  {item.title}
                </span>
              </CardText>

              <span>
                <small className="text-muted">Đánh giá </small>
                <Rate style={{ marginLeft: 15 }} disabled allowHalf value={item.star / 20} />
              </span>
              <span>
                <div className="progress-wrapper">
                  <div className="progress-warning">
                    <div className="progress-label">
                      <span style={{ color: '#fb6340' }}>Hoàn thành</span>
                    </div>
                    <div className="progress-percentage">
                      <span>{item.completedPercent ?? 0}%</span>
                    </div>
                  </div>
                  <Progress max="100" value={item.completedPercent} color="warning" />
                </div>
              </span>
              <div className="text-right">
                <Button outline color="warning" onClick={() => moveToNextPage(item, index)}>
                  Làm bài
                </Button>
              </div>
            </CardBody>
          </Card>
        </Col>
      );
    });
  }, [moveToNextPage, state.data]);

  React.useEffect(() => {
    if (isVisibled && state.isLoading && state.data.length === 1) {
      moveToNextPage(state.data[0], 0);
    }
  }, [isVisibled, moveToNextPage, state.data, state.isLoading]);
  return (
    <>
      <Modal className="modal-dialog-centered modal-danger modal-xl" isOpen={isVisibled} toggle={() => toggleModal()}>
        <div className="modal-header">
          <h5 className="modal-title" id="exampleModalLabel">
            Chọn phần làm bài Live Worksheet
          </h5>
          <button aria-label="Close" className="close" data-dismiss="modal" type="button" onClick={() => toggleModal()}>
            <span aria-hidden={true}>×</span>
          </button>
        </div>
        <Row className="modal-body">
          <div className="card-deck ">{Content()}</div>
        </Row>
        <div className="modal-footer">
          <Button color="secondary" data-dismiss="modal" type="button" onClick={() => toggleModal()}>
            Close
          </Button>
        </div>
      </Modal>
    </>
  );
};

AssignmentsMix4LiveWorksheetModal.propTypes = {
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
};

export default AssignmentsMix4LiveWorksheetModal;
