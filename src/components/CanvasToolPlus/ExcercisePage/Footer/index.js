import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Row, Space } from 'antd';

function Footer({ onSubmit, tryAgain, footerMode, setFooterMode }) {
  const [isDoing, setIsDoing] = useState(true);

  const handleSubmit = () => {
    onSubmit();
    setIsDoing(false);
  };
  //
  const handletryAgain = () => {
    tryAgain();
    setIsDoing(true);
  };

  const renderButton = () => {
    const { EDIT, PREVIEW, VIEW, CREATE } = footerKey;
    switch (footerMode) {
      case EDIT: {
        return (
          <Button
            type="primary"
            onClick={() => {
              setIsDoing(true);
              setFooterMode(PREVIEW);
            }}
          >
            Xem trước
          </Button>
        );
        // break;
      }
      case PREVIEW: {
        return (
          <Space>
            <Button type="primary" onClick={() => setFooterMode(EDIT)}>
              Chỉnh sửa
            </Button>

            {isDoing === false ? (
              <Button type="primary" onClick={handletryAgain}>
                Làm lại
              </Button>
            ) : (
              <Button type="primary" onClick={handleSubmit}>
                Kiểm tra
              </Button>
            )}
          </Space>
        );
        // break;
      }
      case VIEW: {
        return (
          <Space>
            {/* <Button Button type='primary' onClick={() => setFooterMode(EDIT)}>Chỉnh sửa</Button> */}

            {isDoing === false ? (
              <Button type="primary" onClick={handletryAgain}>
                Làm lại
              </Button>
            ) : (
              <Button type="primary" onClick={handleSubmit}>
                Kiểm tra
              </Button>
            )}
          </Space>
        );
        // break;
      }
      case CREATE: {
        return null;
        // break;
      }
      default: {
        return (
          <Button type="primary" onClick={handleSubmit}>
            Submit
          </Button>
        );
        // break;
      }
    }
  };

  return (
    <>
      <Row>
        <Col span={8}>
          <div />
        </Col>
        <Col span={8} className="d-flex justify-content-center align-items-center">
          <div id="Footer-ExcercisePage-Audio" />
        </Col>
        <Col span={8}>
          <div>{renderButton()}</div>
        </Col>
      </Row>
    </>
  );
}

Footer.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  tryAgain: PropTypes.func.isRequired,
  footerMode: PropTypes.string,
  setFooterMode: PropTypes.func,
};

export default Footer;

//
export const footerKey = {
  EDIT: 'Edit',
  PREVIEW: 'Preview',
  VIEW: 'View',
  CREATE: 'Create',
};
