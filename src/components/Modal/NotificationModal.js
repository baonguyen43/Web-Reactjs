import React from 'react';
import {
  Button,
  Modal,
} from 'reactstrap';
import PropTypes from 'prop-types';

const ModalNotification = ({ title, body, content, isVisibled, toggleModal }) => {


  return (
    <>
      <Modal
        className="modal-dialog-centered modal-primary"
        contentClassName="bg-gradient-primary"
        isOpen={isVisibled}
        toggle={toggleModal}
      >
        <div className="modal-header">
          <h6 className="modal-title" id="modal-title-notification">
            {title}
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
        <div className="modal-body">
          <div className="py-3 text-center">
            <i className="ni ni-bell-55 ni-3x" />
            <h4 className="heading mt-4">{body}</h4>
            <p>
              {content}
            </p>
          </div>
        </div>
        <div className="modal-footer">
          {/* <Button className="btn-white" color="default" type="button">
            Về trang chủ
          </Button> */}
          <Button
            className="text-primary ml-auto"
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

ModalNotification.propTypes = {
  title: PropTypes.string,
  body: PropTypes.string,
  content: PropTypes.string,
  isVisibled: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired,
}

export default ModalNotification;