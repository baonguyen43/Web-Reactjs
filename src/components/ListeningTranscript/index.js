import React, { Fragment } from 'react';
import { Drawer } from 'antd';
import PropTypes from 'prop-types';
import ReactHtmlParser from 'react-html-parser';

const ListeningTranstript = ({ onClose, tapescript, visible }) => {
  return (
    <Fragment>
      <Drawer
        title="Tapescript"
        placement="right"
        closable={true}
        onClose={onClose}
        visible={visible}
        width={640}
      >
        {ReactHtmlParser(tapescript)}
      </Drawer>
    </Fragment>
  );
};

ListeningTranstript.propTypes = {
  onClose: PropTypes.func.isRequired,
  tapescript: PropTypes.string,
  visible: PropTypes.bool.isRequired,
};

export default ListeningTranstript;
