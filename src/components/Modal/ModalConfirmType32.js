import React from "react";
// reactstrap components
import {
  Button,
  Modal,
} from 'reactstrap';

const ModalConfirmType32 = ({isVisibled,toggleModal,onFinish}) => {

  return (
    <>
      <Modal
        className="modal-dialog-centered"
        isOpen={isVisibled}
        toggle={toggleModal}
      >
        <div className="modal-header">
          <h5 className="modal-title" id="exampleModalLabel">
            Thông báo
            </h5>
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
        <div className="modal-body">Bạn muốn gửi đáp án để chấm điểm và tiếp tục câu hỏi tiếp theo ??</div>
        <div className="modal-footer">
          <Button
            color="secondary"
            data-dismiss="modal"
            type="button"
            onClick={toggleModal}
          >
            Đóng
            </Button>
          <Button onClick={onFinish} color="primary" type="button">
            Xác nhận
            </Button>
        </div>
      </Modal>
    </>
  );

}

export default ModalConfirmType32;