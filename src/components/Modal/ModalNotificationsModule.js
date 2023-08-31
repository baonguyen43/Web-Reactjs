import React from 'react';
import {
  Button,
  Modal,
} from 'reactstrap';
import PropTypes from 'prop-types';
import moment from 'moment';

const ModalNotificationsModule = ({ isVisibled, toggleModal, question }) => {

  return (
    <>
      <Modal
        className="modal-dialog-centered modal-danger"
        contentClassName="bg-gradient-danger"
        isOpen={isVisibled}
        toggle={toggleModal}
      >
        <div className="modal-header">
          <h6 className="modal-title" id="modal-title-notification">
            Kết quả làm bài
          </h6>
          <button
            aria-label="Close"
            className="close"
            data-dismiss="modal"
            type="button"
            onClick={toggleModal}
          >
            <span aria-hidden={true}>×</span>
          </button>
        </div>
        <div className="modal-body text-left">
          <p style={{ fontSize: 18, fontWeight: '500' }}>SPEAKING TOPIC:</p>
          <div >
            <p dangerouslySetInnerHTML={{ __html: question.text }} />
          </div>
          <p style={{ fontSize: 18, fontWeight: '500' }}>BÀI GHI ÂM CỦA BẠN:</p>
          <div className='text-center'>
            <audio controls="controls" src={question.recordUrl} />
          </div>
          <React.Fragment>
            {question.isMarked && (
              <div>
                <p style={{ fontSize: 18, fontWeight: '500' }}>ĐÁNH GIÁ:</p>
                <p>Ngày chấm điểm: <span>{moment(question.markedDate).format('DD-MM-YYYY')}</span></p>
                <p>Giáo viên: <span>{question.teacherName}</span></p>
                {/* <p>Kết quả: <Rate disabled allowHalf value={question.mark / 2} /></p> */}
                <p>Kết quả: <span>{question.mark}</span></p>
                <p>Nhận xét:</p>
                <div className='text-center'>
                  <audio controls="controls" src={question.recordUrlComment}></audio>
                </div>
                <div >
                  <p dangerouslySetInnerHTML={{ __html: question.comment }} />
                </div>
              </div>
            )}

          </React.Fragment>
        </div>
        <div className="modal-footer">
          <Button
            className="text-warning ml-auto"
            color="secondary"
            data-dismiss="modal"
            type="button"
            onClick={toggleModal}
          >
            Đóng
       </Button>
        </div>
      </Modal>
    </>
  )
}

ModalNotificationsModule.propTypes = {

  isVisibled: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired,
  question : PropTypes.instanceOf(Object).isRequired,
}

export default ModalNotificationsModule;